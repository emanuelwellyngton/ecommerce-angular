import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem extends Product {
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItemsSignal = signal<CartItem[]>([]);

    readonly cartItems = this.cartItemsSignal.asReadonly();

    readonly totalItems = computed(() =>
        this.cartItemsSignal().reduce((acc, item) => acc + item.quantity, 0)
    );

    readonly totalPrice = computed(() =>
        this.cartItemsSignal().reduce((acc, item) => acc + (item.price * item.quantity), 0)
    );

    constructor() {
        this.loadCart();

        effect(() => {
            localStorage.setItem('cart', JSON.stringify(this.cartItemsSignal()));
        });
    }

    private loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                if (Array.isArray(parsedCart)) {
                    this.cartItemsSignal.set(parsedCart);
                }
            } catch (e) {
                console.error('Failed to load cart from local storage', e);
            }
        }
    }

    addToCart(product: Product) {
        this.cartItemsSignal.update(items => {
            const existingItem = items.find(item => item.id === product.id);
            if (existingItem) {
                return items.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...items, { ...product, quantity: 1 }];
        });
    }

    removeFromCart(productId: number) {
        this.cartItemsSignal.update(items => items.filter(item => item.id !== productId));
    }

    updateQuantity(productId: number, quantity: number) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        this.cartItemsSignal.update(items =>
            items.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    }

    clearCart() {
        this.cartItemsSignal.set([]);
    }
}
