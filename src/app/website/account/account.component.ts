import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import {
  UserResponse,
  UserUpdateRequest,
  Order,
  Address,
  AddressRequest,
  PaymentMethod,
  PaymentMethodRequest,
} from '../../core/models/product.model';

type AccountTab = 'orders' | 'profile' | 'addresses' | 'payment';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
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

  // Profile form
  profileForm = {
    firstName: '',
    lastName: '',
    phone: '',
    document: '',
  };
  profileSaving = false;
  profileSaved = false;

  // Password form
  passwordForm = {
    currentPassword: '',
    newPassword: '',
  };
  showCurrentPassword = false;
  showNewPassword = false;

  // Address modal
  showAddressModal = false;
  editingAddress: Address | null = null;
  addressForm: AddressRequest = {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
  };
  addressSaving = false;

  // Payment modal
  showPaymentModal = false;
  paymentForm: PaymentMethodRequest = {
    type: 'CREDIT_CARD',
    cardLast4: '',
    cardBrand: '',
    isDefault: false,
  };
  paymentSaving = false;

  // Delete confirmation modal
  showDeleteConfirm = false;
  deleteTarget: { type: 'address' | 'payment'; id: number } | null = null;

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/site/login']);
      return;
    }
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.userService.getMe().subscribe({
      next: (u) => {
        this.user = u;
        this.profileForm = {
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          phone: u.phone || '',
          document: u.document || '',
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
    this.orderService.getMyOrders().subscribe({
      next: (o) => (this.orders = o),
      error: () => {},
    });
    this.userService.getAddresses().subscribe({
      next: (a) => (this.addresses = a),
      error: () => {},
    });
    this.userService.getPaymentMethods().subscribe({
      next: (p) => (this.paymentMethods = p),
      error: () => {},
    });
  }

  setTab(tab: AccountTab): void {
    this.activeTab = tab;
  }

  // ─── Orders ───
  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Pagamento Pendente',
      PAID: 'Pago',
      DENIED: 'Negado',
      SHIPPED: 'Em Trânsito',
      DELIVERED: 'Entregue',
      CANCELED: 'Cancelado',
    };
    return labels[status] || status;
  }

  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      PENDING: 'credit_card',
      PAID: 'check_circle',
      DENIED: 'cancel',
      SHIPPED: 'local_shipping',
      DELIVERED: 'package_2',
      CANCELED: 'cancel',
    };
    return icons[status] || 'package_2';
  }

  getStatusColorClass(status: string): string {
    const classes: Record<string, string> = {
      PENDING: 'status-pending',
      PAID: 'status-success',
      DENIED: 'status-error',
      SHIPPED: 'status-transit',
      DELIVERED: 'status-success',
      CANCELED: 'status-error',
    };
    return classes[status] || 'status-neutral';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // ─── Profile ───
  saveProfile(): void {
    this.profileSaving = true;
    this.profileSaved = false;
    const data: UserUpdateRequest = {
      firstName: this.profileForm.firstName,
      lastName: this.profileForm.lastName,
      phone: this.profileForm.phone,
      document: this.profileForm.document,
    };
    this.userService.updateMe(data).subscribe({
      next: (u) => {
        this.user = u;
        this.profileSaving = false;
        this.profileSaved = true;
        setTimeout(() => (this.profileSaved = false), 3000);
      },
      error: () => {
        this.profileSaving = false;
      },
    });
  }

  // ─── Addresses ───
  openAddressModal(address?: Address): void {
    if (address) {
      this.editingAddress = address;
      this.addressForm = {
        street: address.street,
        number: address.number,
        complement: address.complement || '',
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        isDefault: address.isDefault,
      };
    } else {
      this.editingAddress = null;
      this.addressForm = {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: false,
      };
    }
    this.showAddressModal = true;
  }

  closeAddressModal(): void {
    this.showAddressModal = false;
    this.editingAddress = null;
  }

  saveAddress(): void {
    this.addressSaving = true;
    const obs = this.editingAddress
      ? this.userService.updateAddress(this.editingAddress.id, this.addressForm)
      : this.userService.addAddress(this.addressForm);

    obs.subscribe({
      next: () => {
        this.addressSaving = false;
        this.closeAddressModal();
        this.userService.getAddresses().subscribe({ next: (a) => (this.addresses = a) });
      },
      error: () => {
        this.addressSaving = false;
      },
    });
  }

  confirmDeleteAddress(id: number): void {
    this.deleteTarget = { type: 'address', id };
    this.showDeleteConfirm = true;
  }

  // ─── Payment Methods ───
  openPaymentModal(): void {
    this.paymentForm = { type: 'CREDIT_CARD', cardLast4: '', cardBrand: '', isDefault: false };
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
  }

  savePaymentMethod(): void {
    this.paymentSaving = true;
    this.userService.addPaymentMethod(this.paymentForm).subscribe({
      next: () => {
        this.paymentSaving = false;
        this.closePaymentModal();
        this.userService.getPaymentMethods().subscribe({ next: (p) => (this.paymentMethods = p) });
      },
      error: () => {
        this.paymentSaving = false;
      },
    });
  }

  confirmDeletePayment(id: number): void {
    this.deleteTarget = { type: 'payment', id };
    this.showDeleteConfirm = true;
  }

  getPaymentLabel(type: string): string {
    const labels: Record<string, string> = {
      CREDIT_CARD: 'Cartão de Crédito',
      DEBIT_CARD: 'Cartão de Débito',
      PIX: 'Pix',
      BOLETO: 'Boleto',
    };
    return labels[type] || type;
  }

  // ─── Delete Confirmation ───
  executeDelete(): void {
    if (!this.deleteTarget) return;
    const { type, id } = this.deleteTarget;
    if (type === 'address') {
      this.userService.deleteAddress(id).subscribe({
        next: () => {
          this.addresses = this.addresses.filter((a) => a.id !== id);
          this.closeDeleteConfirm();
        },
      });
    } else {
      this.userService.deletePaymentMethod(id).subscribe({
        next: () => {
          this.paymentMethods = this.paymentMethods.filter((p) => p.id !== id);
          this.closeDeleteConfirm();
        },
      });
    }
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.deleteTarget = null;
  }

  logout(): void {
    this.authService.logout();
  }
}
