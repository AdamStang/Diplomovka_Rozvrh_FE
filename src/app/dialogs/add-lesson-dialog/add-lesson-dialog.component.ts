import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LessonTypeEnum } from 'src/app/Enums/LessonTypeEnum.enum';
import { Teacher } from 'src/app/models/Teacher';

@Component({
  selector: 'app-add-lesson-dialog',
  templateUrl: './add-lesson-dialog.component.html',
  styleUrls: ['./add-lesson-dialog.component.scss']
})
export class AddLessonDialogComponent implements OnInit {
  public myForm: UntypedFormGroup | undefined;
  public lessonTypes = LessonTypeEnum;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AddLessonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Teacher[]
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      teacher: ['', [Validators.required]]
    });
  }

  public submit() {
    this.myForm?.markAllAsTouched();
    if (this.myForm?.valid) {
      this.dialogRef.close(this.myForm?.getRawValue());
    }
  }
}
