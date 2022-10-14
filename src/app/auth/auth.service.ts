import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";
import { User } from "./user.model";

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  registerUser(authData: AuthData) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((res) => {
        this.authSuccess();
      })
      .catch((err) => console.log(err));
  }

  login(authData: AuthData) {
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((res) => {
        this.authSuccess();
      })
      .catch((err) => console.log(err));
  }

  logout() {
    this.isAuthenticated = false;
    this.authChange.next(false);
    this.router.navigate(["/login"]);
  }

  isAuth() {
    return this.isAuthenticated;
  }

  authSuccess() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(["/training"]);
  }
}
