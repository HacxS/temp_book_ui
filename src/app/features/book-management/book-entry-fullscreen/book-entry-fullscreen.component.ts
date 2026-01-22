import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BookEntryStateService } from '../../book-entry/services/book-entry-state.service';

@Component({
  selector: 'app-book-entry-fullscreen',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-entry-fullscreen.component.html',
  styleUrl: './book-entry-fullscreen.component.scss'
})
export class BookEntryFullscreenComponent implements OnInit, OnDestroy {
  @Output() closeFullScreen = new EventEmitter<void>();

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
      reason: [''],
      internalComment: ['Text Input'],
      closeForIssuance: [''],
      openForIssuance: [''],
      closeForCancellation: [''],
      closeForCancellationError: [''],
      immediately: [false],
      permanent: [false],
      drWebNotice: ['Text Input'],
      drWebNoticePublish: [true],
      brokerFlashRequired: [true],
      sendSwift: [true]
    });
  }

  loadFormData(): void {
    const savedData = this.stateService.getFormData();
    this.bookEntryForm.patchValue(savedData, { emitEvent: false });
    this.updateSubmitButtonState();
  }

  subscribeToFormChanges(): void {
    this.bookEntryForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.stateService.updateFormData(value);
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
    this.closeFullScreen.emit();
  }

  onSubmit(): void {
    if (this.bookEntryForm.valid) {
      console.log('Form submitted:', this.bookEntryForm.value);
      alert('Form submitted successfully!');
    }
  }
}
