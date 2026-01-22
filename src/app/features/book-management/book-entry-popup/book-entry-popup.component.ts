import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BookEntryStateService } from '../../book-entry/services/book-entry-state.service';

@Component({
  selector: 'app-book-entry-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-entry-popup.component.html',
  styleUrl: './book-entry-popup.component.scss'
})
export class BookEntryPopupComponent implements OnInit, OnDestroy {
  @Output() closePopup = new EventEmitter<void>();
  @Output() openFullScreen = new EventEmitter<void>();

  bookEntryForm!: FormGroup;
  isSubmitDisabled: boolean = true;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private stateService: BookEntryStateService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadFormData();
    this.subscribeToFormChanges();
    this.updateSubmitButtonState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(): void {
    this.bookEntryForm = this.fb.group({
      // Popup-specific display fields (not synced to state)
      secId: ['PSNAN'],
      currentStatus: [''],
      currentDate: ['01-09-2026'],
      
      // Shared fields (synced via state service)
      reason: [''],
      closeForIssuance: [''],
      openForIssuance: [''],
      closeForCancellation: [''],
      closeForCancellationError: [''],
      immediately: [false],
      permanent: [false],
      internalComment: [''],
      drWebNotice: [''],
      drWebNoticePublish: [true],
      brokerFlashRequired: [true],
      sendSwift: [true]
    });
  }

  loadFormData(): void {
    const savedData = this.stateService.getFormData();
    // Only patch the shared fields, not popup-specific display fields
    this.bookEntryForm.patchValue(savedData, { emitEvent: false });
    this.updateSubmitButtonState();
  }

  subscribeToFormChanges(): void {
    this.bookEntryForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        // Extract only the shared fields for state management
        const { secId, currentStatus, currentDate, ...sharedData } = value;
        this.stateService.updateFormData(sharedData);
        this.updateSubmitButtonState();
      });
  }

  updateSubmitButtonState(): void {
    const reason = this.bookEntryForm.get('reason')?.value;
    const closeForIssuance = this.bookEntryForm.get('closeForIssuance')?.value;
    const closeForCancellation = this.bookEntryForm.get('closeForCancellation')?.value;

    const hasReason = reason && reason.trim() !== '';
    const hasDate = (closeForIssuance && closeForIssuance.trim() !== '') || 
                    (closeForCancellation && closeForCancellation.trim() !== '');

    this.isSubmitDisabled = !(hasReason && hasDate);
  }

  onCancel(): void {
    this.closePopup.emit();
  }

  onSubmit(): void {
    if (this.bookEntryForm.valid) {
      console.log('Form submitted:', this.bookEntryForm.value);
      alert('Form submitted successfully!');
      this.closePopup.emit();
    }
  }

  onOpenFullScreen(): void {
    this.stateService.updateFormData(this.bookEntryForm.value);
    this.openFullScreen.emit();
  }
}
