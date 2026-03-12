import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart: { name: string; category: string; price: number; quantity: number }[] = [];
  lastOrder: { name: string; category: string; price: number; quantity: number }[] = [];
  cartOpen = false;

  purchaseCompleted = false;

  add(product: { name: string; category: string; price: number }) {
    const existing = this.cart.find((p) => p.name === product.name);

    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({
        ...product,
        quantity: 1,
      });
    }

    this.cartOpen = true;
  }

  remove(index: number) {
    const item = this.cart[index];

    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.cart.splice(index, 1);
    }
  }

  clear() {
    this.cart = [];
  }

  total() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
  increase(index: number) {
    this.cart[index].quantity++;
  }

  decrease(index: number) {
    const item = this.cart[index];

    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.cart.splice(index, 1);
    }
  }
}
