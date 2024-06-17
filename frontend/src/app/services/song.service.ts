// src/app/services/song.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from '../models/song.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = 'http://localhost:3000/api/songs';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(this.apiUrl);
  }

  searchSongs(name?: string, artist?: string, date?: string): Observable<Song[]> {
    let params = new HttpParams();
    if (name) params = params.append('name', name);
    if (artist) params = params.append('artist', artist);
    if (date) params = params.append('date', date);

    return this.http.get<Song[]>(`${this.apiUrl}`, { params });
  }

  getSongById(songId: string): Observable<Song> {
    return this.http.get<Song>(`${this.apiUrl}/${songId}`);
  }

  searchSpotify(query: string): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/get-tracks`, {
      params: { query }
    });
  }

  addCommentToSong(songId: string, comment: any): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${songId}/comments`, comment);
  }


  addSong(song: Song): Observable<Song> {
    const headers = this.getHeaders();
    return this.http.post<Song>(`${this.apiUrl}`, song, { headers });
  }

  updateSong(id: string, songData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/${id}`, songData, {headers});
  }
}
