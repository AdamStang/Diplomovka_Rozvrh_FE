import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { LoadingDialogComponent } from '../dialogs/loading-dialog/loading-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading = new Subject<boolean>();
  loading$ = this.loading.asObservable();
  dialogRef: MatDialogRef<LoadingDialogComponent, any> | undefined;

  constructor(private dialog: MatDialog) { }

  openDialog(title: string) {
    this.loading.next(true);
    this.dialogRef = this.dialog.open(LoadingDialogComponent, {
      data: title,
      disableClose: true,
    });
  }

  closeDialog() {
    this.loading.next(false);
    this.dialogRef?.close();
  }
}
