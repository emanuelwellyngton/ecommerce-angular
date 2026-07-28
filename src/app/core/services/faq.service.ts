import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Faq, FaqRequest } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class FaqService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getActiveFaqs(): Observable<Faq[]> {
    return this.http.get<Faq[]>(`${this.baseUrl}/faqs`);
  }

  // Admin
  getAllFaqs(): Observable<Faq[]> {
    return this.http.get<Faq[]>(`${this.baseUrl}/admin/faqs`);
  }

  createFaq(data: FaqRequest): Observable<Faq> {
    return this.http.post<Faq>(`${this.baseUrl}/admin/faqs`, data);
  }

  updateFaq(id: number, data: FaqRequest): Observable<Faq> {
    return this.http.put<Faq>(`${this.baseUrl}/admin/faqs/${id}`, data);
  }

  deleteFaq(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/faqs/${id}`);
  }
}
