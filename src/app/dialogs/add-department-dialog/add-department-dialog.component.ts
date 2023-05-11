import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-department-dialog',
  templateUrl: './add-department-dialog.component.html',
  styleUrls: ['./add-department-dialog.component.scss']
})
export class AddDepartmentDialogComponent implements OnInit {
  public myForm: UntypedFormGroup | undefined;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AddDepartmentDialogComponent>
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      abbr: ['', [Validators.required]]
    });
  }

  public submit() {
    this.myForm?.markAllAsTouched();
    if (this.myForm?.valid) {
      this.dialogRef.close(this.myForm?.getRawValue());
    }
  }
}
