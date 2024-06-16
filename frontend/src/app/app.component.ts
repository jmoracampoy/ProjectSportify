import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service'; // Ajusta la ruta según sea necesario
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router,  private toastController: ToastController) {}

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  logout() {
    this.presentToast('Sesión cerrada correctamente');
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
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

}
