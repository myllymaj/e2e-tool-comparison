import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  constructor(private cd: ChangeDetectorRef, public cartService: CartService) {}
  purchaseSuccess = false;
  loading = true;
  filter = 'all';

  products: { name: string; category: string; price: number }[] = [];

  ngOnInit() {
    const delay = 2500;

    setTimeout(() => {
      this.products = [
        { name: 'Pizza', category: 'food', price: 11 },
        { name: 'Burger', category: 'food', price: 9 },
        { name: 'Cola', category: 'drink', price: 3 },
        { name: 'Water', category: 'drink', price: 2 },
      ];

      this.loading = false;
      this.cd.detectChanges();
    }, delay);

    setInterval(() => {
      if (this.cartService.purchaseCompleted) {
        this.purchaseSuccess = true;
        this.cd.detectChanges();

        this.cartService.purchaseCompleted = false;
      }
    }, 200);
  }

  setFilter(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filter = value;
  }

  filteredProducts() {
    if (this.filter === 'all') return this.products;
    return this.products.filter((p) => p.category === this.filter);
  }

  addToCart(product: any) {
    this.cartService.add(product);
  }
  getLastOrderTotal(): number {
    return this.cartService.lastOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
