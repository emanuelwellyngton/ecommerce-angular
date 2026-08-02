import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  loading = signal(false);
  submitting = false;
  isEditMode = false;
  productId: number | null = null;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!id;
    this.productId = id ? +id : null;
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      discountPrice: [null],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      category: [''],
      active: [true],
      isNew: [false]
    });
    if (this.isEditMode && this.productId) {
      this.loading.update(() => true);
      this.productService.getProductById(this.productId).subscribe({
        next: (product) => {
          if (product) {
            this.form.patchValue({ name: product.name, description: product.description, price: product.price, discountPrice: product.discountPrice, stock: product.stock, imageUrl: product.imageUrl, category: product.category, active: product.active !== false, isNew: product['new'] || false });
          }
          this.loading.update(() => false);
        },
        error: () => { this.loading.update(() => false); }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    this.errorMessage = '';
    const value = this.form.value;
    const obs = this.isEditMode && this.productId ? this.productService.updateProduct(this.productId, value) : this.productService.createProduct(value as Product);
    obs.subscribe({
      next: () => { this.successMessage = this.isEditMode ? 'Produto atualizado!' : 'Produto criado!'; setTimeout(() => this.router.navigate(['/dashboard/products']), 1500); this.submitting = false; },
      error: (err) => { this.errorMessage = err.error?.message || 'Erro ao salvar produto.'; this.submitting = false; }
    });
  }
}
