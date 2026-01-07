import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-entry.component.html',
  styleUrl: './book-entry.component.scss'
})
export class BookEntryComponent implements OnInit {
  bookEntryForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
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

  onCancel(): void {
    console.log('Cancel clicked');
    // Navigation logic here
  }

  onSubmit(): void {
    if (this.bookEntryForm.valid) {
      console.log('Form submitted:', this.bookEntryForm.value);
      // Submit logic here
    }
  }
}

