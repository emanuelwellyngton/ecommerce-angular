import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserResponse, UserUpdateRequest, Address, AddressRequest, PaymentMethod, PaymentMethodRequest } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // Profile
  getMe(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/users/me`);
  }

  updateMe(data: UserUpdateRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.baseUrl}/users/me`, data);
  }

  // Addresses
  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.baseUrl}/users/me/addresses`);
  }

  addAddress(data: AddressRequest): Observable<Address> {
    return this.http.post<Address>(`${this.baseUrl}/users/me/addresses`, data);
  }

  updateAddress(id: number, data: AddressRequest): Observable<Address> {
    return this.http.put<Address>(`${this.baseUrl}/users/me/addresses/${id}`, data);
  }

  deleteAddress(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/me/addresses/${id}`);
  }

  // Payment Methods
  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.baseUrl}/users/me/payment-methods`);
  }

  addPaymentMethod(data: PaymentMethodRequest): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(`${this.baseUrl}/users/me/payment-methods`, data);
  }

  deletePaymentMethod(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/me/payment-methods/${id}`);
  }
}
