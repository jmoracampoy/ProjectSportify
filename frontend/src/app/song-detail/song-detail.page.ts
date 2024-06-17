// song-detail.page.ts
import { Component, OnInit } from '@angular/core';
import { SongService } from '../services/song.service';
import { Song, Comment} from '../models/song.model'; // Importa las interfaces adecuadamente
import { GeolocationModel } from '../models/geolocation.model';
import { GeolocationService } from '../services/geocalitation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.page.html',
  styleUrls: ['./song-detail.page.scss'],
})
export class SongDetailPage implements OnInit {
  geolocation?: GeolocationModel = undefined;
  song: Song | undefined;
  commentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private geolocationService: GeolocationService,
    private toastController: ToastController,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      author: ['', Validators.required],
      text: ['', [Validators.required, Validators.maxLength(1000)]],
      stars: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      lat: [null],
      lng: [null],
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

  async onSubmitComment(): Promise<void> {
    if (this.commentForm.valid && this.song) {
      this.geolocationService.getLocation().then((response) => {
        this.geolocation = response;

        this.commentForm.value.lng = this.geolocation?.longitude;
        this.commentForm.value.lat = this.geolocation?.latitude;

        const newComment: Comment = {
          author: this.commentForm.value.author,
          text: this.commentForm.value.text,
          stars: this.commentForm.value.stars,
          createdAt: new Date(),
          geolocation: {
            type: 'Point',
            coordinates: [
              this.commentForm.value.lng,
              this.commentForm.value.lat,
            ],
          },
        };

        this.songService.addCommentToSong(this.song!._id, newComment).subscribe(
          async (result) => {
            this.commentForm.reset();
            this.refreshSongDetails();
            const toast = await this.toastController.create({
              message: 'Comentario agregado correctamente',
              duration: 3000, // Duración del mensaje en milisegundos
              position: 'bottom', // Posición del toast
              color: 'success' // Color del toast (opcional)
            });
            toast.present();
          },
          (error) => {
            console.error('Error al agregar comentario:', error);
          }
        );
      });
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
