import { Component, OnInit } from '@angular/core';
import { SongService } from '../services/song.service';
import { Song } from '../models/song.model';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  songs: Song[] = [];
  filteredSongs: Song[] = [];
  paginatedSongs: Song[] = [];
  userFavorites: Song[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  page: number = 1;
  limit: number = 20;
  userId: string = '666f1da477ffb6c730f4dc60';
  isLoggedIn: boolean = false;

  constructor(private songService: SongService, private router: Router, private userService: UserService,private authService: AuthService) {}

  ngOnInit() {
    this.getSongs();
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.authService.isLoggedIn()) {
      this.loadUserFavorites();
    }
  }

  viewSongDetails(songId: string) {
    this.router.navigate(['/song-detail', songId]); // Navega al detalle de la canción utilizando el router
  }

  getSongs() {
    this.loading = true;
    this.songService.getSongs().subscribe((songs) => {
      this.songs = songs;
      this.filteredSongs = songs;
      this.updatePagination();
      this.loading = false;
    });
  }

  searchSongs() {
    if (this.searchTerm.trim() === '') {
      this.filteredSongs = this.songs;
    } else {
      this.loading = true;
      this.songService.searchSongs(this.searchTerm, this.searchTerm, this.searchTerm).subscribe((songs) => {
        this.filteredSongs = songs;
        this.updatePagination();
        this.loading = false;
      });
    }
    this.page = 1;
  }

  onInput(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredSongs = this.songs.filter(song =>
      song.name.toLowerCase().includes(searchTerm) ||
      song.artist.toLowerCase().includes(searchTerm)
    );
    this.page = 1;
    this.updatePagination();
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredSongs = this.songs;
    this.page = 1;
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.page - 1) * this.limit;
    const end = this.page * this.limit;
    this.paginatedSongs = this.filteredSongs.slice(start, end);
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePagination();
    }
  }

  nextPage() {
    if ((this.page * this.limit) < this.filteredSongs.length) {
      this.page++;
      this.updatePagination();
    }
  }

  loadUserFavorites() {
    this.userService.getUserFavorites(this.userId).subscribe(favorites => {
      this.userFavorites = favorites;
    });
  }

  isFavorite(songId: string): boolean {
    return this.userFavorites.some(fav => fav._id === songId);
  }

  toggleFavorite(songId: string) {
    if (this.isFavorite(songId)) {
      this.userService.removeFavorite(this.userId, songId).subscribe(() => {
        this.userFavorites = this.userFavorites.filter(fav => fav._id !== songId);
        this.loadUserFavorites();
      });
    } else {
      this.userService.addFavorite(this.userId, songId).subscribe(favorite => {
        this.userFavorites.push(favorite);
        this.loadUserFavorites();
      });
    }
  }
}
