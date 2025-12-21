import { Component, Input, inject } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { Product } from '../../core/models/product.model';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCardComponent {
  @Input() product!: Product;
  cartService = inject(CartService);

  addToCart(event: Event) {
    event.stopPropagation();
    this.cartService.addToCart(this.product);
  }
}
