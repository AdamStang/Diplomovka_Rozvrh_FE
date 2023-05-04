import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Department } from 'src/app/models/Department';

@Component({
  selector: 'app-add-teacher-dialog',
  templateUrl: './add-teacher-dialog.component.html',
  styleUrls: ['./add-teacher-dialog.component.scss']
})
export class AddTeacherDialogComponent implements OnInit {
  public myForm: FormGroup | undefined;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddTeacherDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Department[]
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      degree: ['', [Validators.required]],
      department: [null],
    });
  }

  public submit() {
    this.myForm?.markAllAsTouched();
    if (this.myForm?.valid) {
      this.dialogRef.close(this.myForm?.getRawValue());
    }
  }
}
