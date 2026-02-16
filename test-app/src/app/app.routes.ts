import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Products } from './products/products';
import { About } from './about/about';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products', component: Products },
  { path: 'about', component: About },
];
