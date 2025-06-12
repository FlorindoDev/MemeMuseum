import { Component } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class Login {

  constructor(private authservice: AuthService, private toastr: ToastrService) { }

  isSubmitted: boolean = false;

  loginForm = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.email]),
    pass: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(16)])
  });


  hendleTyping(event: Event) {
    /*let element = event.target as HTMLElement;
    if (this.isSubmitted && this.loginForm.invalid) {
      console.log(event);
      element.classList.add("ring-2");
    } else if (this.isSubmitted) {
      element.classList.remove("ring-2");
    }*/
  }

  handleLogin() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      this.toastr.error("I dati che hai inserito non sono validi!", "Oops! Dati invalidi!");
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
