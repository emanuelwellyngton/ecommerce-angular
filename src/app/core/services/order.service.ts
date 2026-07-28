import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, OrderRequest } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders/me`);
  }

  getMyOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/orders/me/${id}`);
  }

  createOrder(data: OrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders`, data);
  }
}
