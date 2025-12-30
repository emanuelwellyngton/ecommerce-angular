import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product';
import { Product } from '../../../core/models/product.model';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './product-form.component.html',
    styles: [`
    .form-container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      max-width: 600px;
      margin: 0 auto;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #374151;
    }
    input, textarea, select {
      width: 100%;
      padding: 10px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 1rem;
    }
    textarea {
      height: 100px;
      resize: vertical;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 30px;
    }
    .btn-secondary {
      background-color: #e5e7eb;
      color: #374151;
      padding: 10px 20px;
      border-radius: 6px;
      text-decoration: none;
      border: none;
      cursor: pointer;
    }
    .btn-primary {
      background-color: #3b82f6;
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
    }
    .btn-primary:disabled {
      background-color: #93c5fd;
      cursor: not-allowed;
    }
    .error-msg {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 5px;
    }
  `]
})
export class ProductFormComponent implements OnInit {
    productForm: FormGroup;
    isEditMode = false;
    productId: number | null = null;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.productForm = this.fb.group({
            name: ['', Validators.required],
            price: [0, [Validators.required, Validators.min(0)]],
            description: ['', Validators.required],
            imageUrl: ['', Validators.required],
            category: ['', Validators.required],
            isNew: [false]
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.productId = +params['id'];
                this.loadProduct(this.productId);
            }
        });
    }

    loadProduct(id: number): void {
        this.productService.getProductById(id).subscribe(product => {
            if (product) {
                this.productForm.patchValue(product);
            }
        });
    }

    onSubmit(): void {
        if (this.productForm.invalid) return;

        this.loading = true;
        const productData = this.productForm.value;

        if (this.isEditMode && this.productId) {
            this.productService.updateProduct(this.productId, productData).subscribe({
                next: () => {
                    this.router.navigate(['/dashboard/products']);
                },
                error: () => this.loading = false
            });
        } else {
            this.productService.createProduct(productData).subscribe({
                next: () => {
                    this.router.navigate(['/dashboard/products']);
                },
                error: () => this.loading = false
            });
        }
    }
}
