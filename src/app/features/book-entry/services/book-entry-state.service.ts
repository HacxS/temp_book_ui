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

  // Flag to track if we should reopen popup after navigation
  private shouldReopenPopupSubject = new BehaviorSubject<boolean>(false);
  public shouldReopenPopup$: Observable<boolean> = this.shouldReopenPopupSubject.asObservable();

  constructor() {}

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

  // Methods to manage popup state
  setShouldReopenPopup(value: boolean): void {
    console.log('[StateService] Setting shouldReopenPopup to:', value);
    this.shouldReopenPopupSubject.next(value);
    console.log('[StateService] Current value after set:', this.shouldReopenPopupSubject.value);
  }

  getShouldReopenPopup(): boolean {
    const value = this.shouldReopenPopupSubject.value;
    console.log('[StateService] Getting shouldReopenPopup:', value);
    return value;
  }

  clearReopenPopupFlag(): void {
    console.log('[StateService] Clearing shouldReopenPopup flag');
    this.shouldReopenPopupSubject.next(false);
  }
}
