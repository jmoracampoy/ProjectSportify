import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      this.authService.register(username, email, password).subscribe(
        (response: any) => {
          if (!!response.message) {
            localStorage.setItem('username', username);
            this.presentToast(response.message);
            this.router.navigate(['/login']);
          } else {
            this.presentToast('Error: No se recibió un token después del registro.');
          }
        },
        (error) => {
          console.error('Error en registro:', error);
          this.presentToast('Error: No se pudo completar el registro. Por favor, intenta nuevamente.');
        }
      );
    } else {
      this.presentToast('Por favor completa el formulario correctamente.');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color: message.includes('Error') ? 'danger' : 'success', // Color rojo para errores, verde para éxito
    });
    toast.present();
  }
}
