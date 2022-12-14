import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";

import { AppComponent } from "./app.component";
import { MaterialModule } from "./material.module";
import { WelcomeComponent } from "./welcome/welcome.component";
import { AppRoutingModule } from "./app-routing.module";
import { HeaderComponent } from "./navigation/header/header.component";
import { SidenavListComponent } from "./navigation/sidenav-list/sidenav-list.component";
import { AuthService } from "./auth/auth.service";
import { environment } from "../environments/environment";
import { AngularFireModule } from "angularfire2";
import { AuthModule } from "./auth/auth.module";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { StoreModule } from "@ngrx/store";
import { reducers } from "./app.reducer";

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AuthModule,
    AngularFirestoreModule,
    StoreModule.forRoot(reducers),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
