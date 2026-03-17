import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { ProductService, Product } from '../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  constructor(
    public cartService: CartService,
    private productService: ProductService,
    private cd: ChangeDetectorRef
  ) {}

  purchaseSuccess = false;
  loading = true;

  filter = 'all';
  search = '';

  products: Product[] = [];
  filtered: Product[] = [];
  showAddToast = false;
  ngOnInit() {
    const savedProducts = localStorage.getItem('products');

    // simulated loading for E2E tests
    setTimeout(() => {
      if (savedProducts) {
        this.products = JSON.parse(savedProducts).map((p: Product) => ({
          ...p,
          initialStock: p.initialStock ?? p.stock,
        }));
        this.updateFilteredProducts();
        this.loading = false;
        this.cd.detectChanges();
      } else {
        this.productService.getProducts().then((products) => {
          this.products = products.map((p) => ({
            ...p,
            initialStock: p.stock,
          }));
          this.updateFilteredProducts();
          this.saveProducts();
          this.loading = false;
          this.cd.detectChanges();
        });
      }
    }, 3000);

    // purchase success trigger
    setInterval(() => {
      if (this.cartService.purchaseCompleted) {
        const savedProducts = localStorage.getItem('products');

        if (savedProducts) {
          this.products = JSON.parse(savedProducts).map((p: Product) => ({
            ...p,
            initialStock: p.initialStock ?? p.stock,
          }));
        }

        this.updateFilteredProducts();
        this.purchaseSuccess = true;

        this.cd.detectChanges();

        this.cartService.purchaseCompleted = false;
      }
    }, 200);
  }

  saveProducts() {
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  updateFilteredProducts() {
    let result = this.products;

    if (this.filter !== 'all') {
      result = result.filter((p) => p.category === this.filter);
    }

    if (this.search.trim()) {
      const term = this.search.toLowerCase();

      result = result.filter(
        (p) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
      );
    }

    this.filtered = result;
  }

  addToCart(product: Product) {
    if (this.getAvailableStock(product) > 0) {
      this.cartService.add(product);

      if (!this.showAddToast) {
        this.showAddToast = true;

        setTimeout(() => {
          this.showAddToast = false;
          this.cd.detectChanges();
        }, 1500);
      }

      this.saveProducts();
    }
  }
  increaseCartItem(product: Product) {
    this.cartService.increaseByName(product.name);

    this.saveProducts();
  }

  decreaseCartItem(product: Product) {
    this.cartService.decreaseByName(product.name);

    this.saveProducts();
  }

  getLastOrderTotal(): number {
    return this.cartService.lastOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  resetProducts() {
    localStorage.removeItem('products');
    location.reload();
  }

  getAvailableStock(product: Product): number {
    const cartItem = this.cartService.cart.find((c) => c.name === product.name);
    const baseStock = product.initialStock ?? product.stock;

    if (!cartItem) {
      return baseStock;
    }

    return baseStock - cartItem.quantity;
  }
}
