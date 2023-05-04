import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  snackbar = new Subject<boolean>();
  snackbar$ = this.snackbar.asObservable();

  constructor(private snackbarS: MatSnackBar) { }

  public showErrorSnackBar(message: string, duration = 5000) {
    this.snackbarS.open(message, undefined, {
      panelClass: 'error-snackbar',
      duration: duration
    });
  }

  public showSuccessSnackBar(message: string, duration = 5000) {
    this.snackbarS.open(message, undefined, {
      panelClass: 'success-snackbar',
      duration: duration
    });
  }
}
