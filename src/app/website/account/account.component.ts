import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { UserResponse, Order, Address, PaymentMethod } from '../../core/models/product.model';

type AccountTab = 'orders' | 'addresses' | 'payment' | 'profile';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  private userService = inject(UserService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);

  activeTab: AccountTab = 'orders';
  user: UserResponse | null = null;
  orders: Order[] = [];
  addresses: Address[] = [];
  paymentMethods: PaymentMethod[] = [];
  loading = true;

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/site/login']);
      return;
    }
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.userService.getMe().subscribe({ next: (u) => { this.user = u; this.loading = false; }, error: () => { this.loading = false; } });
    this.orderService.getMyOrders().subscribe({ next: (o) => { this.orders = o; }, error: () => {} });
    this.userService.getAddresses().subscribe({ next: (a) => { this.addresses = a; }, error: () => {} });
    this.userService.getPaymentMethods().subscribe({ next: (p) => { this.paymentMethods = p; }, error: () => {} });
  }

  setTab(tab: AccountTab): void { this.activeTab = tab; }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = { 'PENDING': 'Pendente', 'PAID': 'Pago', 'DENIED': 'Negado', 'SHIPPED': 'Enviado', 'DELIVERED': 'Entregue', 'CANCELED': 'Cancelado' };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = { 'PENDING': 'badge-warning', 'PAID': 'badge-success', 'DENIED': 'badge-error', 'SHIPPED': 'badge-neutral', 'DELIVERED': 'badge-success', 'CANCELED': 'badge-error' };
    return classes[status] || 'badge-neutral';
  }

  getPaymentLabel(type: string): string {
    const labels: Record<string, string> = { 'CREDIT_CARD': 'Cartão de Crédito', 'DEBIT_CARD': 'Cartão de Débito', 'PIX': 'Pix', 'BOLETO': 'Boleto' };
    return labels[type] || type;
  }

  logout(): void { this.authService.logout(); }
}
