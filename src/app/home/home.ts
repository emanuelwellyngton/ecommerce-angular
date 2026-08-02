import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../core/services/product';
import { CartService } from '../core/services/cart.service';
import { FaqService } from '../core/services/faq.service';
import { Product, Faq } from '../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private faqService = inject(FaqService);

  featuredProducts: Product[] = [];
  faqs: Faq[] = [];
  loading = signal(true);
  openFaqId: number | null = null;

  categories = [
    { name: 'Vestuário', icon: 'checkroom', desc: 'Roupas modernas e atemporais', bg: '#f5f5f0' },
    { name: 'Acessórios', icon: 'watch', desc: 'Complementos para seu estilo', bg: '#f0f5f0' },
    { name: 'Calçados', icon: 'footprint', desc: 'Conforto com elegância', bg: '#f5f0f5' },
    { name: 'Bolsas', icon: 'shopping_bag', desc: 'Design funcional premium', bg: '#f5f5e8' },
  ];

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.featuredProducts = products.slice(0, 4);
        this.loading.update(() => false);
      },
      error: () => { this.loading.update(() => false); }
    });
    this.faqService.getActiveFaqs().subscribe({
      next: (faqs) => { this.faqs = faqs.slice(0, 4); },
      error: () => { this.loading.update(() => false); }
    });
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.cartService.addToCart(product);
  }

  toggleFaq(id: number): void {
    this.openFaqId = this.openFaqId === id ? null : id;
  }
}
