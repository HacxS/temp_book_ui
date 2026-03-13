import { Component, EventEmitter, Output, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OverridePdfUploadService } from './override-pdf-upload.service';

@Component({
  selector: 'app-override-pdf-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './override-pdf-modal.component.html',
  styleUrl: './override-pdf-modal.component.scss'
})
export class OverridePdfModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() upload = new EventEmitter<File>();
  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  selectedFile: File | null = null;
  isDragging = false;
  isUploading = false;
  errorMessage: string | null = null;
  /** True when the shown file was loaded from previously saved (reopened modal). */
  isPreviouslySaved = false;
  /** Data URL or sanitized URL for displaying PDF content in the viewer. */
  pdfViewerUrl: SafeResourceUrl | null = null;

  get canUpload(): boolean {
    return this.selectedFile != null && !this.isUploading;
  }

  constructor(
    private uploadService: OverridePdfUploadService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const saved = this.uploadService.getSavedFile();
    const savedDataUrl = this.uploadService.getSavedFileDataUrl();
    if (saved && savedDataUrl) {
      this.selectedFile = saved;
      this.isPreviouslySaved = true;
      this.pdfViewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(savedDataUrl);
    }
  }

  private setPdfViewerUrlFromFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.pdfViewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  /** Format file size for display (e.g. "1.2 MB"). */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  onClose(): void {
    if (!this.isUploading) {
      this.close.emit();
    }
  }

  onDiscard(): void {
    if (!this.isUploading) {
      this.selectedFile = null;
      this.pdfViewerUrl = null;
      this.errorMessage = null;
      this.uploadService.clearSavedFile();
      this.close.emit();
    }
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.isPreviouslySaved = false;
      this.errorMessage = null;
      this.setPdfViewerUrlFromFile(file);
    }
    input.value = '';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.isPreviouslySaved = false;
      this.errorMessage = null;
      this.setPdfViewerUrlFromFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  /** Opens the system file picker so the user can browse and select a file from their device. */
  onBrowseClick(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.fileInputRef?.nativeElement?.click();
  }

  /**
   * On Upload click: if no file selected, open file browser. If file selected, save and upload it.
   */
  onUpload(): void {
    if (!this.selectedFile) {
      this.onBrowseClick();
      return;
    }

    this.isUploading = true;
    this.errorMessage = null;

    this.uploadService.uploadAndSave(this.selectedFile).subscribe({
      next: (result) => {
        this.upload.emit(this.selectedFile!);
        this.isUploading = false;
        this.isPreviouslySaved = true;
        // Keep modal open so user sees the uploaded PDF details and content, then closes via X
      },
      error: (err) => {
        this.isUploading = false;
        this.errorMessage = err?.error?.message || err?.message || 'Save failed. Please try again.';
      }
    });
  }
}
