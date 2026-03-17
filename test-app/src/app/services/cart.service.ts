import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart: {
    name: string;
    category: string;
    price: number;
    quantity: number;
    maxStock: number;
  }[] = [];

  lastOrder: {
    name: string;
    category: string;
    price: number;
    quantity: number;
  }[] = [];

  cartOpen = false;
  purchaseCompleted = false;
  isProcessing = false;

  constructor() {
    this.loadCart();
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.cart = JSON.parse(saved);
    }
  }

  add(product: any) {
    const existing = this.cart.find((p) => p.name === product.name);

    const priceToUse =
      product.sale && product.salePrice != null ? product.salePrice : product.price;

    if (existing) {
      if (existing.quantity < existing.maxStock) {
        existing.quantity++;
      }
    } else {
      this.cart.push({
        name: product.name,
        category: product.category,
        price: priceToUse,
        quantity: 1,
        maxStock: product.stock,
      });
    }

    this.saveCart();
  }
  increaseByName(name: string) {
    const item = this.cart.find((p) => p.name === name);

    if (!item) return;

    if (item.quantity < item.maxStock) {
      item.quantity++;

      this.saveCart();
    }
  }

  decreaseByName(name: string) {
    const index = this.cart.findIndex((p) => p.name === name);

    if (index === -1) return;

    const item = this.cart[index];

    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.cart.splice(index, 1);
    }

    this.saveCart();
  }
  removeByName(name: string) {
    const index = this.cart.findIndex((p) => p.name === name);

    if (index !== -1) {
      this.cart.splice(index, 1);

      this.saveCart();
    }
  }
  clear() {
    this.cart = [];
    this.saveCart();
  }

  total() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getItemCount(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}
