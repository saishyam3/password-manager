import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordService } from '../services/password.service';
import { PasswordEntry } from '../models/password.model';

/**
 * Component to list all password entries with options to:
 * - Toggle password view (encrypted/decrypted)
 * - View single password details
 * - Edit a password entry (with re-encryption)
 * - Delete a password entry
 */
@Component({
  selector: 'app-password-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ul>
      <li *ngFor="let item of service.passwordList()">
        <strong>{{ item.category }} - {{ item.app }}</strong><br />
        Username: {{ item.userName }}<br />
        
        <!-- Show either encrypted or decrypted password -->
        Password:
        {{
          showDecrypted
            ? service.decode(item.encryptedPassword)
            : item.encryptedPassword
        }}
        <br />

        <!-- Actions -->
        <button (click)="toggle()">Toggle</button>
        <button (click)="view(item.id)">View</button>
        <button (click)="edit(item)">Edit</button>
        <button (click)="delete(item.id)">Delete</button>
      </li>
    </ul>

    <!-- Selected item display -->
    <div *ngIf="selected()">
      <h3>Selected Entry</h3>
      <p>App: {{ selected()?.app }}</p>
      <p>User: {{ selected()?.userName }}</p>
      <p>Password (decrypted): {{ service.decode(selected()?.encryptedPassword || '') }}</p>
    </div>
  `,
})
export class PasswordListComponent {
  // Controls if all passwords should be shown decrypted
  showDecrypted = false;

  // Holds the currently selected item for 'view' mode
  selected = signal<PasswordEntry | null>(null);

  constructor(public service: PasswordService) {}

  /**
   * Toggle password visibility for all items
   */
  toggle() {
    this.showDecrypted = !this.showDecrypted;
  }

  /**
   * Fetch a single password entry by ID
   * and set it as selected
   */
  view(id: number) {
    this.service.getOne(id).subscribe((data) => {
      this.selected.set(data);
    });
  }

  /**
   * Edit a password after decrypting it first.
   * Prompts user to edit and re-encrypts before saving.
   */
  edit(item: PasswordEntry) {
    const decrypted = this.service.decode(item.encryptedPassword);
    const newPass = prompt('Edit Password (decrypted):', decrypted);
    if (newPass !== null) {
      const updated: PasswordEntry = {
        ...item,
        encryptedPassword: this.service.encode(newPass) // re-encrypt password before saving
      };
      this.service.update(item.id, updated).subscribe();
    }
  }

  /**
   * Delete a password entry by ID
   */
  delete(id: number) {
    this.service.delete(id).subscribe(() => {
      if (this.selected()?.id === id) this.selected.set(null);
    });
  }
}
