import { Component, OnInit, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { WritableSignal, signal } from '@angular/core';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetailsComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  product: Product | null = null;
  loading = signal(true);
  quantity = 1;
  addedToCart = false;

  // Additional detail states matching Stitch specification
  selectedImageIndex = 0;
  productImages: string[] = [];

  ngOnInit(): void {
    console.log(this.loading());
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        if (product) {
          this.product = product;
          // Build gallery images array (main image + any extra images if present)
          const extraUrls = product.images?.map((img) => img.url) || [];
          this.productImages = [product.imageUrl, ...extraUrls].filter(Boolean);
        } else {
          this.product = null;
        }
        this.loading.update(() => false);
        console.log(this.loading());
      },
      error: () => {
        this.loading.set(false);
        console.log(this.loading());
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  addToCart(): void {
    if (!this.product) return;
    for (let i = 0; i < this.quantity; i++) {
      this.cartService.addToCart(this.product);
    }
    this.addedToCart = true;
    setTimeout(() => {
      this.addedToCart = false;
    }, 3000);
  }

  adjustQuantity(delta: number): void {
    this.quantity = Math.max(1, this.quantity + delta);
  }
}
