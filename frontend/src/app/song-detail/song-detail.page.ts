// song-detail.page.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SongService } from '../services/song.service';
import { Song, Comment, Geolocation } from '../models/song.model'; // Importa las interfaces adecuadamente

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.page.html',
  styleUrls: ['./song-detail.page.scss'],
})
export class SongDetailPage implements OnInit {
  song: Song | undefined;
  commentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      author: ['', Validators.required],
      text: ['', [Validators.required, Validators.maxLength(1000)]],
      stars: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      lat: [null, Validators.required],
      lng: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const songId = this.route.snapshot.paramMap.get('id');
    if (songId) {
      this.songService.getSongById(songId).subscribe(
        (song: Song) => {
          this.song = song;
        },
        (error) => {
          console.error('Error al obtener las canciones:', error);
        }
      );
    }
  }

  onSubmitComment(): void {
    if (this.commentForm.valid && this.song) {
      this.commentForm.value.lng = '';
      this.commentForm.value.lat = '';

      const newComment: Comment = {
        author: this.commentForm.value.author,
        text: this.commentForm.value.text,
        stars: this.commentForm.value.stars,
        createdAt: new Date(),
        geolocation: {
          type: 'Point',
          coordinates: [this.commentForm.value.lng, this.commentForm.value.lat]
        }
      };

      this.songService.addCommentToSong(this.song._id, newComment).subscribe(
        (result) => {
          this.commentForm.reset();
          this.refreshSongDetails();
        },
        (error) => {
          console.error('Error al agregar comentario:', error);
        }
      );
    }
  }

  private refreshSongDetails(): void {
    if (this.song && this.song._id) {
      this.songService.getSongById(this.song._id).subscribe(
        (song: Song) => {
          this.song = song;
        },
        (error) => {
          console.error('Error al actualizar detalles de la canción:', error);
        }
      );
    }
  }
}
