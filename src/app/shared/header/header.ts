import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  cartCount = 0;
  isAuthenticated = false;
  mobileMenuOpen = false;
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions.push(
      this.cartService.cartItems$.subscribe(items => {
        this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
      }),
      this.authService.authStatus$.subscribe(status => {
        this.isAuthenticated = status;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  goToAccount(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/site/account']);
    } else {
      this.router.navigate(['/site/login']);
    }
  }
}
