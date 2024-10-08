import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '@lib/services';
import {UserType} from "@lib/enums/user-type";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {Notify} from "notiflix/build/notiflix-notify-aio";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginPage implements OnInit {
  loginMode: UserType = UserType.STUDENT;
  userType = UserType;
  loginForm!: FormGroup;
  private _callbackURL: string;

  isLoading = false;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private fb: FormBuilder,
    private title: Title
  ) {
    this._callbackURL = this._activatedRoute.snapshot.queryParamMap.get('callbackURL') || `/`;
  }

  ngOnInit() {
    this.title.setTitle('Login')
    this.loginForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]]
    })

    this._authService.isLoggedIn$.subscribe(() => {
      this.isLoading = false;
    })
  }

  setUserType(type: UserType): void {
    this.loginMode = type;
  }

  onClickSignIn(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      if (this.loginMode === this.userType.STAFF) {
        this._authService.loginStaff(this.loginForm.value);
      } else {
        this._authService.loginStudent(this.loginForm.value);
      }
    } else {
      Notify.failure('Some data is invalid')
    }
    // this._router.navigate([this._callbackURL]);
  }
}
