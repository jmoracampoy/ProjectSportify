import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SongService } from '../services/song.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Camera, CameraResultType } from '@capacitor/camera';
import { GeolocationService } from '../services/geocalitation.service';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { Song } from '../models/song.model'; // Import Song interface

@Component({
  selector: 'app-edit-song',
  templateUrl: './edit-song.page.html',
  styleUrls: ['./edit-song.page.scss'],
})
export class EditSongPage implements OnInit {
  songForm: FormGroup;
  photo: SafeResourceUrl | undefined;
  songId: string | undefined; // Variable to store song ID

  constructor(
    private fb: FormBuilder,
    private songService: SongService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private toastController: ToastController,
    private geolocationService: GeolocationService,
    private activatedRoute: ActivatedRoute
  ) {
    this.songForm = this.fb.group({
      name: ['', [Validators.required]],
      artist: ['', [Validators.required]],
      releaseDate: [''],
      imageUrl: [''],
      lat: [null],
      lng: [null],
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.songId = params['id'];
      if (this.songId) {
        this.getSongDetails(this.songId);
      }
    });
  }

  async getSongDetails(songId: string) {
    try {
       this.songService.getSongById(songId).subscribe(response=>{
        this.songForm.patchValue(response);
      });
    } catch (error) {
      this.presentToast('Error al editar la canción');
    }
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });

    if (image && image.webPath) {
      this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image.webPath);
      this.songForm.patchValue({ imageUrl: image.webPath });
    }
  }

  async getGeolocation() {
    try {
      const geolocation = await this.geolocationService.getLocation();
      this.songForm.patchValue({
        lat: geolocation.latitude,
        lng: geolocation.longitude,
      });
    } catch (error) {
      console.error('Error al obtener la geolocalización', error);
      this.presentToast('Error al obtener la geolocalización');
    }
  }

  async onSubmit() {
    if (this.songForm.valid) {
      await this.getGeolocation();
      const updatedSong = this.songForm.value;
      if (this.songId) {
        this.songService.updateSong(this.songId, updatedSong).subscribe(
          (response) => {
            this.presentToast('Canción actualizada correctamente');
            this.getSongDetails(this.songId!);
          },
          (error) => {
            console.error('Error updating song:', error);
            this.presentToast('Error al actualizar la canción');
          }
        );
      }
    } else {
      this.presentToast('Por favor, completa todos los campos requeridos');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color: message.includes('Error') ? 'danger' : 'success',
    });
    toast.present();
  }

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }
}
