import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { FormsModule } from '@angular/forms';

type CheckoutState = 'idle' | 'confirm' | 'processing' | 'success';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  state: CheckoutState = 'idle';
  deliveryNote = '';

  constructor(public cartService: CartService, private cd: ChangeDetectorRef) {}

  isCartLocked(): boolean {
    return this.state === 'processing' || this.state === 'success';
  }

  increaseCartItem(item: any) {
    this.cartService.increaseByName(item.name);
  }

  decreaseCartItem(item: any) {
    this.cartService.decreaseByName(item.name);
  }
  removeCartItem(item: any) {
    this.cartService.removeByName(item.name);
  }

  checkout() {
    if (this.cartService.cart.length === 0) return;

    this.state = 'confirm';
  }

  cancelCheckout() {
    this.state = 'idle';
  }

  closeCart() {
    this.cartService.cartOpen = false;
  }

  confirmCheckout() {
    this.state = 'processing';
    this.cartService.isProcessing = true;

    this.cd.detectChanges();

    setTimeout(() => {
      this.state = 'success';
      this.cd.detectChanges();

      setTimeout(() => {
        this.closeCart();

        this.cartService.lastOrder = [...this.cartService.cart];

        this.cartService.clear();

        this.cartService.purchaseCompleted = true;

        this.cartService.isProcessing = false;

        this.state = 'idle';

        this.cd.detectChanges();
      }, 3000);
    }, 4000);
  }
}
