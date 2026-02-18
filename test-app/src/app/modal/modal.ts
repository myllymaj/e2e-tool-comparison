import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',   
})
export class Modal {
  @Output() close = new EventEmitter<void>();
  closing = false;

  onClose() {
    this.closing = true;
    this.close.emit();
  }
}
