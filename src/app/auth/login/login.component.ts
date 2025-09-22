import { Component, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { LoginCredentials } from '../../core/interfaces/auth.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public readonly credentials = signal<LoginCredentials>({
    username: '',
    password: ''
  });

  public readonly isLoading = signal<boolean>(false);

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    // Redirect if already authenticated
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  public updateUsername(username: string): void {
    this.credentials.update(prev => ({ ...prev, username }));
    this.authService.clearError();
  }

  public updatePassword(password: string): void {
    this.credentials.update(prev => ({ ...prev, password }));
    this.authService.clearError();
  }

  public onSubmit(): void {
    console.log('🔐 Login attempt:', {
      username: this.credentials().username,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });

    this.isLoading.set(true);

    this.authService.login(this.credentials()).subscribe({
      next: (success) => {
        if (success) {
          console.log('✅ Login successful for user:', this.credentials().username);
          this.router.navigate(['/dashboard']);
        } else {
          console.log('❌ Login failed for user:', this.credentials().username);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('❌ Login error:', error);
        this.isLoading.set(false);
      }
    });
  }
}
