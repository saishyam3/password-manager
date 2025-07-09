import { Component } from '@angular/core';
import { AddPasswordFormComponent } from '../components/add-password-form.component';
import { PasswordListComponent } from '../components/password-list.component';

/**
 * HomeComponent serves as the main container
 * It includes:
 * - Form to add new passwords
 * - List of saved passwords
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AddPasswordFormComponent,  // Component to add new encrypted passwords
    PasswordListComponent      // Component to list, edit, delete, and view passwords
  ],
  template: `
    <h1>Password Manager</h1>

    <!-- Add New Password Form -->
    <app-add-password-form />

    <!-- Password List -->
    <app-password-list />
  `
})
export class HomeComponent {}
