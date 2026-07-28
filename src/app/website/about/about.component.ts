import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="about-page">
      <section class="about-hero">
        <h1>Sobre a LUXE</h1>
        <p>Somos uma marca de moda minimalista e premium, comprometida com design atemporal e sustentabilidade.</p>
      </section>
      <section class="about-content">
        <div class="about-section">
          <h2>Nossa Missão</h2>
          <p>Oferecer peças de alta qualidade que transcendam tendências e durem para sempre.</p>
        </div>
        <div class="about-section">
          <h2>Nossa Visão</h2>
          <p>Ser referência global em moda minimalista, combinando estética e consciência ambiental.</p>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .about-page {
      min-height: calc(100vh - 80px);
      padding-top: 80px;
    }
    .about-hero {
      background: var(--color-primary-container);
      padding: 80px 40px;
      text-align: center;
    }
    .about-hero h1 {
      font-size: var(--font-size-headline-xl);
      font-weight: 700;
      color: var(--color-primary-fixed);
      margin-bottom: 16px;
    }
    .about-hero p {
      font-size: var(--font-size-body-lg);
      color: rgba(188,198,224,0.8);
      max-width: 600px;
      margin: 0 auto;
    }
    .about-content {
      max-width: 800px;
      margin: 64px auto;
      padding: 0 40px;
      display: flex;
      flex-direction: column;
      gap: 40px;
    }
    .about-section h2 {
      font-size: var(--font-size-headline-md);
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: 12px;
    }
    .about-section p {
      font-size: var(--font-size-body-lg);
      color: var(--color-on-surface-variant);
      line-height: 1.7;
    }
  `]
})
export class AboutComponent {}
