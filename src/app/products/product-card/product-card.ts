import { Component, Input } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCardComponent {
  @Input() product!: Product;
}
