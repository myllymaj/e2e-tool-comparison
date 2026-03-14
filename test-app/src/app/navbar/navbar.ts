import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cart } from '../cart/cart';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, Cart],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(public cartService: CartService) {}

  toggleCart() {
    this.cartService.cartOpen = !this.cartService.cartOpen;
  }
}
