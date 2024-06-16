// src/app/services/song.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = 'http://localhost:3000/api/songs';

  constructor(private http: HttpClient) {}

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

  addCommentToSong(songId: string, comment: any): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${songId}/comments`, comment);
  }
}
