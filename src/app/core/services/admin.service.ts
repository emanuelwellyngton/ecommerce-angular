import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserResponse, UserAdminUpdateRequest, UserAdminCreateRequest, Order, OrderStatusUpdateRequest } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // Users
  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.baseUrl}/admin/users`);
  }

  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/admin/users/${id}`);
  }

  createUser(data: UserAdminCreateRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.baseUrl}/admin/users`, data);
  }

  updateUser(id: number, data: UserAdminUpdateRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.baseUrl}/admin/users/${id}`, data);
  }

  // Orders
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/admin/orders`);
  }

  updateOrderStatus(id: number, data: OrderStatusUpdateRequest): Observable<Order> {
    return this.http.patch<Order>(`${this.baseUrl}/admin/orders/${id}/status`, data);
  }
}
