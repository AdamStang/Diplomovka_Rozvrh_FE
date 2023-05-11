import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddSubjectDialogComponent } from '../add-subject-dialog/add-subject-dialog.component';
import { Department } from 'src/app/models/Department';

@Component({
  selector: 'app-move-teachers-dialog',
  templateUrl: './move-teachers-dialog.component.html',
  styleUrls: ['./move-teachers-dialog.component.scss']
})
export class MoveTeachersDialogComponent implements OnInit {
  public myForm: UntypedFormGroup | undefined;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AddSubjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Department[]
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  public submit() {
    this.myForm?.markAllAsTouched();
    if (this.myForm?.valid) {
      this.dialogRef.close(this.myForm?.get("name").value);
    }
  }
}
