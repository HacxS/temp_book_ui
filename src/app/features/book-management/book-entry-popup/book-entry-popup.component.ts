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
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private stateService: BookEntryStateService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadFormData();
    this.subscribeToFormChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(): void {
    this.bookEntryForm = this.fb.group({
      secId: ['PSNAN'],
      currentStatus: [''],
      currentDate: ['01-09-2026'],
      reason: [''],
      closeForIssuance: [''],
      openForIssuance: [''],
      closeForCancellation: [''],
      openForCancellation: [''],
      immediately: [false],
      permanent: [false],
      internalComment: [''],
      drWebNoticeContent: [''],
      drWebNoticePublish: [false],
      brokerFlashRequired: [false],
      sendSwift: [false]
    });
  }

  loadFormData(): void {
    const savedData = this.stateService.getFormData();
    this.bookEntryForm.patchValue(savedData, { emitEvent: false });
  }

  subscribeToFormChanges(): void {
    this.bookEntryForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.stateService.updateFormData(value);
      });
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
