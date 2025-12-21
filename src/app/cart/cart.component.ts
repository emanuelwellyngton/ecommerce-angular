import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../core/services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent {
    cartService = inject(CartService);
}
