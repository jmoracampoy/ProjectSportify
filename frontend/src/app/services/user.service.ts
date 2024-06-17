import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://192.168.85.70:3000/api/users';
  constructor(private http: HttpClient, private authService: AuthService) {}
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getUserFavorites(userId: string): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/favorites`, {
      headers,
    });
  }

  addFavorite(userId: string, songId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      `${this.apiUrl}/${userId}/favorites/${songId}`,
      {},
      { headers }
    );
  }

  removeFavorite(userId: string, songId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      `${this.apiUrl}/${userId}/favorites/${songId}`,
      { headers }
    );
  }
}
