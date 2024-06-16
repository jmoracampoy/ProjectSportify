import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        const response = await this.authService
          .login(email, password)
          .toPromise();
        if (response && response.token) {
          this.presentToast('Inicio de sesión realizado correctamente');
          this.router.navigate(['/home']);
        } else {
          this.presentToast(
            'Error: No se recibió un token después del inicio de sesión.'
          );
        }
      } catch (error) {
        console.error('Error en inicio de sesión:', error);
        this.presentToast(
          'Error: No se pudo completar el inicio de sesión. Por favor, intenta nuevamente.'
        );
      }
    } else {
      this.presentToast('Por favor completa el formulario correctamente.');
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
}
