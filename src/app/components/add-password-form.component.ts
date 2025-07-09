import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordService } from '../services/password.service';

/**
 * Form component to add new password entries.
 * Encrypts password before saving via PasswordService.
 */
@Component({
  selector: 'app-add-password-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" #form="ngForm">
      <input [(ngModel)]="category" name="category" placeholder="Category" required />
      <input [(ngModel)]="app" name="app" placeholder="App Name" required />
      <input [(ngModel)]="userName" name="userName" placeholder="Username" required />
      <input [(ngModel)]="password" name="password" placeholder="Password" required />
      <button type="submit">Add</button>
    </form>
  `
})
export class AddPasswordFormComponent {
  category = '';
  app = '';
  userName = '';
  password = '';

  constructor(private service: PasswordService) {}

  onSubmit() {
    if (this.category && this.app && this.userName && this.password) {
      // Encrypt password before sending
      const encrypted = this.service.encode(this.password);

      const entry = {
        category: this.category,
        app: this.app,
        userName: this.userName,
        encryptedPassword: encrypted,
      };

      this.service.add(entry).subscribe(() => {
        // Clear form after successful add
        this.category = '';
        this.app = '';
        this.userName = '';
        this.password = '';
      });
    }
  }
}
