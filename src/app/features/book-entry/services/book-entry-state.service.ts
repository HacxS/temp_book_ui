import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BookEntryFormData {
  reason: string;
  internalComment: string;
  closeForIssuance: string;
  openForIssuance: string;
  closeForCancellation: string;
  closeForCancellationError: string;
  immediately: boolean;
  permanent: boolean;
  drWebNotice: string;
  drWebNoticePublish: boolean;
  brokerFlashRequired: boolean;
  sendSwift: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BookEntryStateService {
  private readonly initialFormData: BookEntryFormData = {
    reason: '',
    internalComment: 'Text Input',
    closeForIssuance: '',
    openForIssuance: '',
    closeForCancellation: '',
    closeForCancellationError: '',
    immediately: false,
    permanent: false,
    drWebNotice: 'Text Input',
    drWebNoticePublish: true,
    brokerFlashRequired: true,
    sendSwift: true
  };

  private formDataSubject = new BehaviorSubject<BookEntryFormData>(this.initialFormData);
  public formData$: Observable<BookEntryFormData> = this.formDataSubject.asObservable();

  getFormData(): BookEntryFormData {
    return this.formDataSubject.value;
  }

  updateFormData(data: Partial<BookEntryFormData>): void {
    const currentData = this.formDataSubject.value;
    this.formDataSubject.next({ ...currentData, ...data });
  }

  setFormData(data: BookEntryFormData): void {
    this.formDataSubject.next(data);
  }

  resetFormData(): void {
    this.formDataSubject.next(this.initialFormData);
  }
}
