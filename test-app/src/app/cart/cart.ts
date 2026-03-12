import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart.service';

type CheckoutState = 'idle' | 'confirm' | 'processing' | 'success';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  state: CheckoutState = 'idle';

  constructor(public cartService: CartService, private cd: ChangeDetectorRef) {}

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
    // start spinner
    this.state = 'processing';
    this.cd.detectChanges();

    setTimeout(() => {
      // show success toast
      this.state = 'success';
      this.cd.detectChanges();

      setTimeout(() => {
        // close cart window
        this.closeCart();

        // clear cart
        this.cartService.lastOrder = [...this.cartService.cart];
        this.cartService.clear();
        this.cd.detectChanges();
        // notify products page
        this.cartService.purchaseCompleted = true;

        // reset checkout state
        this.state = 'idle';
      }, 3000);
    }, 4000);
  }
}
