import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { SharedComponent } from './shared.component';
import { LoadingDialogComponent } from './dialogs/loading-dialog/loading-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { LoadingComponent } from './components/loading/loading.component';

import { LoadingService } from './services/loading.service';
import { SnackbarService } from './services/snackbar.service';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    DragDropModule,
    MatRadioModule,
    MatCheckboxModule,
  ],
  declarations: [
    SharedComponent,
    LoadingDialogComponent,
    DeleteDialogComponent,
    LoadingComponent,
  ],
  providers: [
    LoadingService,
    SnackbarService
  ],
  entryComponents: [
    LoadingDialogComponent,
    DeleteDialogComponent,
  ],
  exports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    DragDropModule,
    MatRadioModule,
    LoadingDialogComponent,
    DeleteDialogComponent,
    LoadingComponent,
    MatCheckboxModule,
  ],
})
export class SharedModule { }
