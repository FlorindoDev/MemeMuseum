import { Component, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Output } from '@angular/core';
import { UserService } from '../_services/user/user.service';
import { environment } from '../environment.prod';

@Component({
  selector: 'login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class Login {

  @Output() logged = new EventEmitter<boolean>();
  @Output() gotoSignup = new EventEmitter<string>();

  constructor(
    private authservice: AuthService,
    private UserService: UserService,
    private toastr: ToastrService,
  ) { }

  isSubmitted: boolean = false;

  loginForm = new FormGroup({
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

      this.addRedRing(element, this.isFieldInError(element));

    }
  }

  clearInput() {
    this.loginForm.get('pass')?.setValue('');
    this.loginForm.get('user')?.setValue('');
    this.isSubmitted = false;
  }

  userLoggedSuccess(token: string) {
    this.authservice.updateToken(token);
    this.UserService.getUserFromId(this.authservice.getIdFromToken(token)).subscribe({
      next: (val) => {
        if (val.profilePic === null) val.profilePic = environment.noProfilePic;

        this.UserService.saveUser(val);
        this.closeLogin();
        this.clearInput();

        this.toastr.success("Hai fatto l'accesso con successo", "Accesso Completato!");
        setTimeout(() => {
          this.logged.emit(true);
          this.stopLoading();
        }, 10);
      }
    });

  }

  isFieldInError(element: HTMLElement) {
    let attr: string = element.getAttribute("formControlName") as string;
    const control = this.loginForm.get(attr);
    return control?.errors !== null;

  }


  handleLogin() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {

      let element = document.querySelectorAll("#form-login input[type]");
      element.forEach((val) => {
        this.addRedRing(val as HTMLElement, this.isFieldInError(val as HTMLElement));
      });

    } else {
      this.startLoading();
      this.authservice.login({
        email: this.loginForm.value.user as string,
        password: this.loginForm.value.pass as string
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
    let element = document.getElementById("login");
    element?.classList.add("hidden");
  }



}
