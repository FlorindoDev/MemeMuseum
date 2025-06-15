
import { Component, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Output } from '@angular/core';
import { UserService } from '../_services/user/user.service';
import { LoadingScreen } from '../loading-screeen/loading-screen.component';
import { environment } from '../environment.prod';

@Component({
  selector: 'sign-up',
  imports: [LoadingScreen, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUp {

  @Output() logged = new EventEmitter<boolean>();

  constructor(
    private authservice: AuthService,
    private UserService: UserService,
    private toastr: ToastrService,
  ) { }

  isSubmitted: boolean = false;

  signupForm = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.email]),
    pass: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(50)])
  });

  startLoading() {
    document.getElementById("text-accedi")?.classList.add("hidden");
    document.getElementById("loading")?.classList.remove("hidden");
  }

  stopLoading() {
    document.getElementById("text-accedi")?.classList.remove("hidden");
    document.getElementById("loading")?.classList.add("hidden");
  }

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
        this.addRedRing(element, this.signupForm.controls.user.errors);
      } else {
        this.addRedRing(element, this.signupForm.controls.pass.errors);
      }

    }
  }

  userLoggedSuccess(token: string) {
    this.authservice.updateToken(token);
    this.UserService.getUserFromId(this.authservice.getIdFromToken(token)).subscribe({
      next: (val) => {
        if (val.profilePic === null) val.profilePic = environment.noProfilePic;
        this.UserService.saveUser(val);
        this.closeLogin();
        this.toastr.success("Hai fatto l'accesso con successo", "Accesso Completato!");
        setTimeout(() => {
          this.logged.emit(true);
          this.stopLoading();
        }, 10);
      }
    });

  }


  handleLogin() {
    this.isSubmitted = true;
    if (this.signupForm.invalid) {

      this.toastr.error("I dati che hai inserito non sono validi!", "Oops! Dati invalidi!");
      let element = document.querySelectorAll("input[type]");
      element.forEach((val) => {
        this.addRedRing(val as HTMLElement, true);
      })

    } else {
      this.startLoading();
      this.authservice.login({
        email: this.signupForm.value.user as string,
        password: this.signupForm.value.pass as string
      }).subscribe({

        next: (val) => {
          this.userLoggedSuccess(val.token);
        },

        error: () => {
          this.stopLoading();
        }

      });
    }
  }

  ngOnInit() {
    let element = document.getElementById("login");
    element?.classList.add("hidden");
  }

  closeLogin() {
    let element = document.getElementById("signup");
    element?.classList.add("hidden");
  }



}
