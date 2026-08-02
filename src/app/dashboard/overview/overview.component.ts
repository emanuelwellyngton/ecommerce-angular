import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { Order } from '../../core/models/product.model';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  private adminService = inject(AdminService);
  
  orders: Order[] = [];
  loading = signal(true);
  totalRevenue = 0;
  pendingOrders = 0;
  totalOrders = 0;

  ngOnInit(): void {
    this.adminService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders.slice(0, 5); // Recent 5
        this.totalOrders = orders.length;
        this.pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'PAID').length;
        this.totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        this.loading.update(() => false);
      },
      error: () => { this.loading.update(() => false); }
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
}
