import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PasswordEntry } from '../models/password.model';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private apiUrl = 'http://localhost:3000/passwords';

  // Signal to hold current password list for reactive UI updates
  public passwordList = signal<PasswordEntry[]>([]);

  constructor(private http: HttpClient) {
    // Load all passwords initially on service instantiation
    this.loadAll();
  }

  // Fetch all password entries from backend and update signal
  loadAll() {
    this.http.get<PasswordEntry[]>(this.apiUrl).subscribe(list => {
      this.passwordList.set(list);
    });
  }

  /**
   * Encode (encrypt) the password.
   * Here, Base64 encoding is used, which is not secure for real applications,
   * but works for demonstration.
   */
  encode(password: string): string {
    return btoa(password);
  }

  /**
   * Decode (decrypt) the password from Base64
   */
  decode(encoded: string): string {
    return atob(encoded);
  }

  /**
   * Add a new password entry.
   * Encrypts password before sending to backend.
   * Updates local passwordList signal on success.
   */
  add(entry: Omit<PasswordEntry, 'id'>) {
    // Ensure password is encrypted here again (defense in depth)
    const payload = { ...entry, encryptedPassword: this.encode(entry.encryptedPassword) };
    return this.http.post<PasswordEntry>(this.apiUrl, payload).pipe(
      tap(newEntry => {
        // Update local state by adding new password entry
        this.passwordList.update(list => [...list, newEntry]);
      })
    );
  }

  /**
   * Update an existing password entry by ID.
   * Encrypts password again before sending.
   * Updates local signal state accordingly.
   */
  update(id: number, updatedEntry: PasswordEntry) {
    const payload = { ...updatedEntry, encryptedPassword: this.encode(updatedEntry.encryptedPassword) };
    return this.http.put<PasswordEntry>(`${this.apiUrl}/${id}`, payload).pipe(
      tap(() => {
        this.passwordList.update(list =>
          list.map(item => (item.id === id ? updatedEntry : item))
        );
      })
    );
  }

  /**
   * Delete a password entry by ID.
   * Updates local passwordList signal by removing the entry.
   */
  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.passwordList.update(list => list.filter(item => item.id !== id));
      })
    );
  }

  /**
   * Get a single password entry by ID.
   * Used for view or edit operations.
   */
  getOne(id: number) {
    return this.http.get<PasswordEntry>(`${this.apiUrl}/${id}`);
  }
}
