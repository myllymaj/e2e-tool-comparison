import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, Modal],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
