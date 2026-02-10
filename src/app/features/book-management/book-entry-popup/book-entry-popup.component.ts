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
      drWebNoticeContent: [''],
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

  onKeyPress(event: KeyboardEvent): boolean {
    // Allow: a-z, A-Z, 0-9, and period (.)
    const allowedPattern = /^[a-zA-Z0-9.]$/;
    
    // Check if it's a special key (navigation, modifiers, etc.)
    if (this.isSpecialKey(event)) {
      return true;
    }
    
    // Check the actual key pressed
    const key = event.key;
    
    // If key length is 1, it's a printable character
    if (key.length === 1 && !allowedPattern.test(key)) {
      event.preventDefault();
      return false;
    }
    
    return true;
  }
  
  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const currentValue = target.value || '';
    // Filter to only allow a-z, A-Z, 0-9, and period (.)
    const filteredValue = currentValue.replace(/[^a-zA-Z0-9.]/g, '');
    
    if (currentValue !== filteredValue) {
      target.value = filteredValue;
      // Update the form control value
      const controlName = target.getAttribute('formControlName');
      if (controlName) {
        this.bookEntryForm.get(controlName)?.setValue(filteredValue);
      }
    }
  }

  private isSpecialKey(event: KeyboardEvent): boolean {
    // Allow special keys like backspace, delete, tab, arrow keys, etc.
    const specialKeys = [
      'Backspace', 'Delete', 'Tab', 'Enter', 'Escape',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End', 'Insert', 'PageUp', 'PageDown'
    ];
    
    return specialKeys.includes(event.key) || 
           event.ctrlKey || 
           event.metaKey || 
           event.altKey;
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    // Filter to only allow a-z, A-Z, 0-9, and period (.)
    const filteredText = pastedText.replace(/[^a-zA-Z0-9.]/g, '');
    
    const target = event.target as HTMLTextAreaElement;
    const start = target.selectionStart || 0;
    const end = target.selectionEnd || 0;
    const currentValue = target.value || '';
    
    const newValue = currentValue.substring(0, start) + filteredText + currentValue.substring(end);
    target.value = newValue;
    
    // Update the form control value
    const controlName = target.getAttribute('formControlName');
    if (controlName) {
      this.bookEntryForm.get(controlName)?.setValue(newValue);
    }
    
    // Set cursor position after pasted text
    setTimeout(() => {
      target.setSelectionRange(start + filteredText.length, start + filteredText.length);
    }, 0);
  }
}
