import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";

@Injectable({ providedIn: "root" })
export class UIService {
  constructor(private snackBar: MatSnackBar) {}

  showSnackbar(message: string, action?: string, duration?: number) {
    this.snackBar.open(message, action, { duration: duration });
  }
}
