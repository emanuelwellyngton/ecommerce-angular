import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  loading = signal(false);
  submitting = false;
  isEditMode = false;
  userId: number | null = null;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!id;
    this.userId = id ? +id : null;

    this.form = this.fb.group({
      username: ['', this.isEditMode ? [] : [Validators.required]],
      email: ['', this.isEditMode ? [] : [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      firstName: [''],
      lastName: [''],
      phone: [''],
      document: [''],
      roles: [['ROLE_USER']],
      active: [true]
    });

    if (this.isEditMode && this.userId) {
      this.loading.update(() => true);
      this.adminService.getUserById(this.userId).subscribe({
        next: (user) => {
          this.form.patchValue({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phone: user.phone || '',
            document: user.document || '',
            roles: user.roles || ['ROLE_USER'],
            active: user.active
          });
          this.loading.update(() => false);
        },
        error: () => { this.loading.update(() => false); }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.errorMessage = '';
    const value = this.form.value;

    if (this.isEditMode && this.userId) {
      const updateData = {
        firstName: value.firstName,
        lastName: value.lastName,
        phone: value.phone,
        document: value.document,
        roles: value.roles,
        active: value.active
      };
      this.adminService.updateUser(this.userId, updateData).subscribe({
        next: () => this.router.navigate(['/dashboard/users']),
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erro ao atualizar usuário.';
          this.submitting = false;
        }
      });
    } else {
      this.adminService.createUser(value).subscribe({
        next: () => this.router.navigate(['/dashboard/users']),
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erro ao criar usuário.';
          this.submitting = false;
        }
      });
    }
  }
}
