import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

/** API endpoint for permanent override PDF upload. Set to your backend URL, or leave as-is to save only in app. */
export const OVERRIDE_PDF_UPLOAD_URL = '/api/book-entry/override-pdf';

export interface UploadResult {
  success: boolean;
  message?: string;
  fileId?: string;
  url?: string;
}

function readFileAsDataUrl(file: File): Observable<string> {
  return new Observable((observer) => {
    const reader = new FileReader();
    reader.onload = () => {
      observer.next(reader.result as string);
      observer.complete();
    };
    reader.onerror = () => observer.error(reader.error);
    reader.readAsDataURL(file);
  });
}

@Injectable({ providedIn: 'root' })
export class OverridePdfUploadService {
  /** The currently saved override PDF (browsed from system and uploaded/saved). */
  private savedOverridePdf: File | null = null;
  /** Data URL of the saved PDF so content can be shown every time user opens Override PDF. */
  private savedOverridePdfDataUrl: string | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Saves the selected file (and its content as data URL) in app state, then optionally uploads to the server.
   * Storing the data URL allows showing the PDF content every time the user opens Override PDF again.
   */
  uploadAndSave(file: File): Observable<{ saved: boolean; uploaded: boolean; error?: string }> {
    return readFileAsDataUrl(file).pipe(
      tap((dataUrl) => {
        this.savedOverridePdf = file;
        this.savedOverridePdfDataUrl = dataUrl;
      }),
      switchMap(() => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post<UploadResult>(OVERRIDE_PDF_UPLOAD_URL, formData).pipe(
          map(() => ({ saved: true, uploaded: true })),
          catchError((err) => {
            const message = err?.error?.message || err?.message || 'Server upload failed';
            return of({ saved: true, uploaded: false, error: message });
          })
        );
      })
    );
  }

  /** Returns the override PDF that was browsed and saved (if any). */
  getSavedFile(): File | null {
    return this.savedOverridePdf;
  }

  /** Returns a data URL of the saved PDF content for displaying in the modal (every time user comes back). */
  getSavedFileDataUrl(): string | null {
    return this.savedOverridePdfDataUrl;
  }

  /** Clears the saved override PDF and its content (e.g. when starting a new entry). */
  clearSavedFile(): void {
    this.savedOverridePdf = null;
    this.savedOverridePdfDataUrl = null;
  }
}
