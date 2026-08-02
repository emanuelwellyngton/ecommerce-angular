import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { Order, OrderStatus } from '../../core/models/product.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  private adminService = inject(AdminService);
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = signal(true);
  searchQuery = '';
  selectedStatus = '';
  updatingOrderId: number | null = null;
  
  statuses: OrderStatus[] = ['PENDING', 'PAID', 'DENIED', 'SHIPPED', 'DELIVERED', 'CANCELED'];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.update(() => true);
    this.adminService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilter();
        this.loading.update(() => false);
      },
      error: () => { this.loading.update(() => false); }
    });
  }

  applyFilter(): void {
    this.filteredOrders = this.orders.filter(o => {
      const matchesSearch = !this.searchQuery || 
        String(o.id).includes(this.searchQuery);
      const matchesStatus = !this.selectedStatus || o.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  updateStatus(order: Order, status: OrderStatus): void {
    this.updatingOrderId = order.id;
    this.adminService.updateOrderStatus(order.id, { status }).subscribe({
      next: (updated) => {
        const idx = this.orders.findIndex(o => o.id === order.id);
        if (idx !== -1) this.orders[idx] = updated;
        this.applyFilter();
        this.updatingOrderId = null;
      },
      error: () => { this.updatingOrderId = null; }
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PENDING': 'Pendente', 'PAID': 'Pago', 'DENIED': 'Negado',
      'SHIPPED': 'Enviado', 'DELIVERED': 'Entregue', 'CANCELED': 'Cancelado'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'PENDING': 'badge-warning', 'PAID': 'badge-success', 'DENIED': 'badge-error',
      'SHIPPED': 'badge-neutral', 'DELIVERED': 'badge-success', 'CANCELED': 'badge-error'
    };
    return classes[status] || 'badge-neutral';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  }
}
