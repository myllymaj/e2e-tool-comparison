import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {

  constructor(private cd: ChangeDetectorRef) {}

  loading = true;
  filter = 'all';

  products: { name: string; category: string }[] = [];

  ngOnInit() {
    const delay = 1500 + Math.random() * 2000;

    setTimeout(() => {
      this.products = [
        { name: 'Pizza', category: 'food' },
        { name: 'Burger', category: 'food' },
        { name: 'Cola', category: 'drink' },
        { name: 'Water', category: 'drink' }
      ];

      this.loading = false;

      this.cd.detectChanges(); 

    }, delay);
  }

  setFilter(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filter = value;
  }

  filteredProducts() {
    if (this.filter === 'all') return this.products;
    return this.products.filter(p => p.category === this.filter);
  }
}
