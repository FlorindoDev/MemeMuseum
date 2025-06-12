import { Component, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Output } from '@angular/core';

@Component({
  selector: 'login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class Login {

  @Output() logged = new EventEmitter<boolean>();

  constructor(
    private authservice: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  isSubmitted: boolean = false;

  loginForm = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.email]),
    pass: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50)])
  });

  addRedRing(element: HTMLElement, error: unknown | boolean): void {
    if (error) {
      element.classList.add("ring-2");
      element.classList.add("ring-red-400");
    } else {
      element.classList.remove("ring-2");
      element.classList.remove("ring-red-400");
    }
  }

  hendleTyping(event?: Event) {
    let element = event?.target as HTMLElement;
    if (this.isSubmitted) {

      if (element.getAttribute("type") === "email") {
        this.addRedRing(element, this.loginForm.controls.user.errors);
      } else {
        this.addRedRing(element, this.loginForm.controls.pass.errors);
      }

    }
  }

  //TODO sistemare
  handleLogin() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      this.toastr.error("I dati che hai inserito non sono validi!", "Oops! Dati invalidi!");
      let element = document.querySelectorAll("input[type]");
      element.forEach((val) => {
        this.addRedRing(val as HTMLElement, true);
      })
    } else {
      this.authservice.login({
        email: this.loginForm.value.user as string,
        password: this.loginForm.value.pass as string
      }).subscribe({
        next: (val) => {
          this.authservice.updateToken(val.token);
          this.toastr.success("Hai fatto l'accesso con successo", "Accesso Completato!");
          this.closeLogin();
          setTimeout(() => { this.logged.emit(true) }, 10);

        },
        error: (err) => {
          this.toastr.error(err.message, "Oops! c'è stato un errore");
          let element = document.querySelectorAll("input[type]");
          element.forEach((val) => {
            this.addRedRing(val as HTMLElement, true);
          })
        }
      });
    }
  }

  ngOnInit() {
    let element = document.getElementById("login");
    element?.classList.add("hidden");
  }

  closeLogin() {
    let element = document.getElementById("login");
    element?.classList.add("hidden");
  }



}
