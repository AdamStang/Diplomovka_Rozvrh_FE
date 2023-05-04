import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-study-programme-dialog',
  templateUrl: './add-study-programme-dialog.component.html',
  styleUrls: ['./add-study-programme-dialog.component.scss']
})
export class AddStudyProgrammeDialogComponent implements OnInit {
  public myForm: FormGroup | undefined;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddStudyProgrammeDialogComponent>
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      abbr: ['', [Validators.required]],
      grade: ['', [Validators.required]],
      numberOfStudents: [null, [Validators.required]]
    });
  }

  public submit() {
    this.myForm?.markAllAsTouched();
    if (this.myForm?.valid) {
      this.dialogRef.close(this.myForm?.getRawValue());
    }
  }
}
