import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  loading = signal(true);

  // Sort
  sortBy = 'recommended';

  // Filters
  categories: { name: string; count: number; checked: boolean }[] = [];
  selectedCategory = '';
  priceMin: number | null = null;
  priceMax: number | null = null;
  showMobileFilters = false;

  // Pagination
  currentPage = 1;
  pageSize = 9;
  totalPages = 1;

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.buildCategories();
        this.applyFilters();
        this.loading.update(() => false);
      },
      error: () => {
        this.loading.update(() => false);
      }
    });
  }

  private buildCategories(): void {
    const catMap = new Map<string, number>();
    this.allProducts.forEach(p => {
      const cat = p.category || 'Outros';
      catMap.set(cat, (catMap.get(cat) || 0) + 1);
    });
    this.categories = [
      { name: 'Tudo', count: this.allProducts.length, checked: true },
      ...Array.from(catMap.entries()).map(([name, count]) => ({
        name,
        count,
        checked: false,
      })),
    ];
  }

  selectCategory(catName: string): void {
    this.categories.forEach(c => {
      c.checked = c.name === catName;
    });
    this.selectedCategory = catName === 'Tudo' ? '' : catName;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let results = [...this.allProducts];

    // Category filter
    if (this.selectedCategory) {
      results = results.filter(p => p.category === this.selectedCategory);
    }

    // Price filter
    if (this.priceMin !== null && this.priceMin > 0) {
      results = results.filter(p => (p.discountPrice || p.price) >= this.priceMin!);
    }
    if (this.priceMax !== null && this.priceMax > 0) {
      results = results.filter(p => (p.discountPrice || p.price) <= this.priceMax!);
    }

    // Sort
    this.sortProducts(results);

    this.filteredProducts = results;
    this.totalPages = Math.max(1, Math.ceil(results.length / this.pageSize));
    if (this.currentPage > this.totalPages) this.currentPage = 1;
  }

  private sortProducts(products: Product[]): void {
    switch (this.sortBy) {
      case 'price-asc':
        products.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-desc':
        products.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'newest':
        products.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  get pagedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.cartService.addToCart(product);
  }

  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.priceMin = null;
    this.priceMax = null;
    this.categories.forEach(c => c.checked = c.name === 'Tudo');
    this.currentPage = 1;
    this.applyFilters();
  }

  getDiscountPercent(product: Product): number {
    if (!product.discountPrice || product.discountPrice >= product.price) return 0;
    return Math.round(((product.price - product.discountPrice) / product.price) * 100);
  }
}
