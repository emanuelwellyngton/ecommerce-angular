import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-manage-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductManageListComponent implements OnInit {
  private productService = inject(ProductService);
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = signal(true);
  searchQuery = '';
  deletingId: number | null = null;

  ngOnInit(): void { this.loadProducts(); }

  loadProducts(): void {
    this.loading.update(() => true);
    this.productService.getProducts().subscribe({
      next: (products) => { this.products = products; this.filteredProducts = products; this.loading.update(() => false); },
      error: () => { this.loading.update(() => false); }
    });
  }

  applyFilter(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter(p => p.name.toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q));
  }

  deleteProduct(id: number): void {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    this.deletingId = id;
    this.productService.deleteProduct(id).subscribe({
      next: () => { this.products = this.products.filter(p => p.id !== id); this.filteredProducts = this.filteredProducts.filter(p => p.id !== id); this.deletingId = null; },
      error: () => { this.deletingId = null; }
    });
  }
}
