import { Component, OnInit, Signal, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { Address, PaymentMethod } from '../../core/models/product.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  cartItems$ = this.cartService.cartItems$;
  cartTotal$ = this.cartService.cartTotal$;
  
  addresses: WritableSignal<Address[]> = signal([]);
  paymentMethods: PaymentMethod[] = [];
  
  selectedAddressId: number | null = null;
  selectedPaymentId: number | null = null;
  
  step: 'delivery' | 'payment' | 'review' | 'confirmed' | 'denied' = 'delivery';
  loading = signal(false);
  orderId: number | null = null;

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/site/login']);
      return;
    }
    this.userService.getAddresses().subscribe({ next: (a) => {this.addresses.update(() => a); if (a.length) this.selectedAddressId = a.find(x => x.isDefault)?.id || a[0].id; } });
    this.userService.getPaymentMethods().subscribe({ next: (p) => { this.paymentMethods = p; if (p.length) this.selectedPaymentId = p.find(x => x.isDefault)?.id || p[0].id; } });
  }

  nextStep(): void {
    if (this.step === 'delivery') this.step = 'payment';
    else if (this.step === 'payment') this.step = 'review';
  }

  placeOrder(): void {
    console.log("teste");
    this.loading.update(() => true);
    let cartItems: any[] = [];
    console.log(cartItems);
    this.cartService.cartItems$.subscribe(items => {
      cartItems = items.map(i => ({ productId: i.id, quantity: i.quantity }));
    }).unsubscribe();

    this.orderService.createOrder({
      shippingAddressId: this.selectedAddressId!,
      paymentMethodId: this.selectedPaymentId!,
      items: cartItems
    }).subscribe({
      next: (order) => {
        this.orderId = order.id;
        this.cartService.clearCart();
        this.step = order.status === 'DENIED' ? 'denied' : 'confirmed';
        this.loading.update(() => false);
      },
      error: () => {
        this.step = 'denied';
        this.loading.update(() => false);
      }
    });
  }

  getPaymentLabel(type: string): string {
    const labels: Record<string, string> = { 'CREDIT_CARD': 'Cartão de Crédito', 'DEBIT_CARD': 'Cartão de Débito', 'PIX': 'Pix', 'BOLETO': 'Boleto' };
    return labels[type] || type;
  }
}
