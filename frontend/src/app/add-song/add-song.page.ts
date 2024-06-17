// add-song.page.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SongService } from '../services/song.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Camera, CameraResultType } from '@capacitor/camera';
import { GeolocationService } from '../services/geocalitation.service';


@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.page.html',
  styleUrls: ['./add-song.page.scss'],
})
export class AddSongPage {
  songForm: FormGroup;
  photo: SafeResourceUrl | undefined;

  constructor(
    private fb: FormBuilder,
    private songService: SongService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private toastController: ToastController,
    private geolocationService: GeolocationService
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
      const songData = this.songForm.value;
      this.songService.addSong(songData).subscribe(
        (response) => {
          this.presentToast('Canción agregada correctamente');
          this.songForm.reset();
        },
        (error) => {
          console.error('Error al agregar la canción', error);
          this.presentToast('Error al agregar la canción');
        }
      );
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
