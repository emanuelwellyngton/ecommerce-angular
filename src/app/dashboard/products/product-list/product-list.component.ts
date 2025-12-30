import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product';
import { Product } from '../../../core/models/product.model';

@Component({
    selector: 'app-product-manage-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './product-list.component.html',
    styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .btn-primary {
      background-color: #3b82f6;
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      text-decoration: none;
    }
    .product-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .product-table th, .product-table td {
      padding: 15px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    .product-table th {
      background-color: #f9fafb;
      font-weight: 600;
    }
    .actions {
      display: flex;
      gap: 10px;
    }
    .btn-sm {
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 0.875rem;
      cursor: pointer;
      border: none;
    }
    .btn-edit {
      background-color: #f59e0b;
      color: white;
      text-decoration: none;
    }
    .btn-delete {
      background-color: #ef4444;
      color: white;
    }
  `]
})
export class ProductManageListComponent implements OnInit {
    products: Product[] = [];

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.productService.getProducts().subscribe(products => {
            this.products = products;
        });
    }

    deleteProduct(id: number): void {
        if (confirm('Are you sure you want to delete this product?')) {
            this.productService.deleteProduct(id).subscribe(() => {
                this.loadProducts();
            });
        }
    }
}
