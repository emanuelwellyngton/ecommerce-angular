import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaqService } from '../../core/services/faq.service';
import { Faq } from '../../core/models/product.model';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  private faqService = inject(FaqService);
  faqs: Faq[] = [];
  filteredFaqs: Faq[] = [];
  loading = true;
  searchQuery = '';
  openId: number | null = null;

  ngOnInit(): void {
    this.faqService.getActiveFaqs().subscribe({
      next: (faqs) => {
        this.faqs = faqs;
        this.filteredFaqs = faqs;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilter(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredFaqs = this.faqs.filter(f =>
      f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
  }

  toggleFaq(id: number): void {
    this.openId = this.openId === id ? null : id;
  }
}
