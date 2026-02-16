import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal">
      <p>Modal opened</p>
      <button (click)="close.emit()">Close</button>
    </div>
  `,
})
export class Modal {
  @Output() close = new EventEmitter<void>();
}
