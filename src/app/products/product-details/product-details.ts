import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product';
import { Product } from '../../core/models/product.model';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './product-details.html',
    styleUrl: './product-details.css',
})
export class ProductDetailsComponent implements OnInit {
    product$!: Observable<Product | undefined>;

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService
    ) { }

    ngOnInit(): void {
        this.product$ = this.route.paramMap.pipe(
            switchMap(params => {
                const id = Number(params.get('id'));
                return this.productService.getProductById(id);
            })
        );
    }
}
