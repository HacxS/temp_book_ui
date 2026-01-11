import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookEntryPopupComponent } from './book-entry-popup/book-entry-popup.component';
import { BookEntryFullscreenComponent } from './book-entry-fullscreen/book-entry-fullscreen.component';

@Component({
  selector: 'app-book-management',
  standalone: true,
  imports: [CommonModule, BookEntryPopupComponent, BookEntryFullscreenComponent],
  templateUrl: './book-management.component.html',
  styleUrl: './book-management.component.scss'
})
export class BookManagementComponent {
  isPopupOpen = false;
  isFullScreenMode = false;

  openBookEntryPopup(): void {
    this.isPopupOpen = true;
    this.isFullScreenMode = false;
  }

  closePopup(): void {
    this.isPopupOpen = false;
    this.isFullScreenMode = false;
  }

  openFullScreen(): void {
    this.isPopupOpen = false;
    this.isFullScreenMode = true;
  }

  closeFullScreen(): void {
    this.isFullScreenMode = false;
    this.isPopupOpen = true;
  }

  onPopupBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('popup-overlay')) {
      this.closePopup();
    }
  }
}
