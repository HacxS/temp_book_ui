import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { BookEntryPopupComponent } from './book-entry-popup/book-entry-popup.component';
import { BookEntryFullscreenComponent } from './book-entry-fullscreen/book-entry-fullscreen.component';
import { BookEntryStateService } from '../book-entry/services/book-entry-state.service';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-book-management',
  standalone: true,
  imports: [CommonModule, BookEntryPopupComponent, BookEntryFullscreenComponent],
  templateUrl: './book-management.component.html',
  styleUrl: './book-management.component.scss'
})
export class BookManagementComponent implements OnInit, OnDestroy {
  isPopupOpen = false;
  isFullScreenMode = false; // Toggle between popup and full screen
  private destroy$ = new Subject<void>();
  private hasCheckedReopen = false; // Prevent multiple checks

  constructor(
    private router: Router,
    private stateService: BookEntryStateService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('BookManagementComponent constructor called');
    
    // Listen to router events
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        console.log('Navigation ended to:', event.url);
        
        if (event.url === '/book-management') {
          this.checkAndReopenPopup();
        }
      });
  }

  ngOnInit(): void {
    console.log('BookManagement ngOnInit called');
    // Only check if not already checked in constructor's router subscription
    if (!this.hasCheckedReopen) {
      this.checkAndReopenPopup();
    } else {
      console.log('Already checked in router subscription, skipping ngOnInit check');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkAndReopenPopup(): void {
    // Mark that we've checked to prevent duplicate checks
    this.hasCheckedReopen = true;
    
    console.log('Checking if should reopen popup');
    const shouldReopen = this.stateService.getShouldReopenPopup();
    console.log('Should reopen popup:', shouldReopen);
    
    if (shouldReopen) {
      console.log('Flag is true - reopening popup');
      // Use setTimeout to ensure DOM is ready and Angular has settled
      setTimeout(() => {
        console.log('Setting isPopupOpen to true');
        this.isPopupOpen = true;
        console.log('Popup opened, isPopupOpen:', this.isPopupOpen);
        
        // Force change detection
        this.cdr.detectChanges();
        console.log('Change detection triggered');
        
        // Clear the flag AFTER opening
        this.stateService.clearReopenPopupFlag();
        
        // Verify the popup is visible in DOM
        setTimeout(() => {
          const popupElement = document.querySelector('.popup-overlay');
          console.log('Popup element in DOM:', popupElement ? 'YES' : 'NO');
          console.log('isPopupOpen value:', this.isPopupOpen);
          if (popupElement) {
            console.log('Popup classes:', (popupElement as HTMLElement).className);
            console.log('Popup computed display:', window.getComputedStyle(popupElement).display);
          } else {
            console.error('POPUP ELEMENT NOT FOUND IN DOM!');
          }
        }, 100);
      }, 200); // Increased timeout for better reliability
    }
  }

  openBookEntryPopup(): void {
    console.log('Opening popup manually');
    this.isPopupOpen = true;
    this.isFullScreenMode = false;
    this.stateService.clearReopenPopupFlag();
  }

  closePopup(clearReopenFlag: boolean = true): void {
    console.log('Closing popup, clearReopenFlag:', clearReopenFlag);
    this.isPopupOpen = false;
    this.isFullScreenMode = false;
    
    if (clearReopenFlag) {
      console.log('Clearing reopen flag');
      this.stateService.clearReopenPopupFlag();
    }
  }

  openFullScreen(): void {
    console.log('Switching to full screen mode');
    this.isPopupOpen = false; // Close popup
    this.isFullScreenMode = true; // Show full screen
  }

  closeFullScreen(): void {
    console.log('Closing full screen, reopening popup');
    this.isFullScreenMode = false;
    this.isPopupOpen = true; // Reopen popup immediately
  }

  onPopupBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('popup-overlay')) {
      console.log('Backdrop clicked - closing popup');
      this.closePopup(true);
    }
  }
}
