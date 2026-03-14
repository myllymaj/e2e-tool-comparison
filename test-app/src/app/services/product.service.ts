import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Product {
  name: string
  category: string
  price: number
  stock: number
  initialStock?: number
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Promise<Product[]> {
    console.log('Fetching products...');

    return firstValueFrom(this.http.get<Product[]>('/assets/mock/products.json'));
  }
}
