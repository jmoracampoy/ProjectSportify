import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Song, Comment } from '../models/song.model'; // Importar Comment desde el modelo
import { SongService } from '../services/song.service';

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
      stars: ['', [Validators.required, Validators.min(0), Validators.max(5)]]
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
      const newComment: Comment = {
        author: this.commentForm.value.author,
        text: this.commentForm.value.text,
        stars: this.commentForm.value.stars,
        createdAt: new Date()
      };

      this.songService.addCommentToSong(this.song._id, newComment).subscribe(
        (result) => {
          this.commentForm.reset();
          this.refreshSongDetails();
        },
        (error) => {
          console.error('Error al obtener los comentarios:', error);
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
          console.error('Error refreshing song details:', error);
        }
      );
    }
  }
}
