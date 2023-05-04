import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LessonTypeEnum } from 'src/app/Enums/LessonTypeEnum.enum';
import { StudyProgramme } from 'src/app/models/StudyProgramme';
import { Teacher } from 'src/app/models/Teacher';

@Component({
  selector: 'app-add-subject-dialog',
  templateUrl: './add-subject-dialog.component.html',
  styleUrls: ['./add-subject-dialog.component.scss']
})
export class AddSubjectDialogComponent implements OnInit {
  public myForm: FormGroup | undefined;
  public lessonsForSubject: FormGroup;
  public lessons = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddSubjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { teachers: Teacher[], studyProgrammes: StudyProgramme[] }
  ) { }

  ngOnInit() {
    console.log(this.data.studyProgrammes);
    this.myForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      abbr: ['', [Validators.required]],
      numberOfStudents: [null, [Validators.required]],
      lecturesPerWeek: [null, [Validators.required]],
      practicePerWeek: [null, [Validators.required]],
      numberOfGroups: [null, [Validators.required]],
      studyProgramme: [null, [Validators.required]],
      teacher: [null]
    });
    this.lessonsForSubject = this.fb.group({
      practices: this.fb.array([]),
      lectures: this.fb.array([]),
    });
  }

  public submit() {
    this.lessonsForSubject?.markAllAsTouched();
    if (this.lessonsForSubject?.valid) {
      let subj = this.myForm.getRawValue();
      subj.lessons = [...this.lectures?.getRawValue(), ...this.practices?.getRawValue()];
      // console.log(this.myForm?.getRawValue());
      // console.log(this.lectures?.getRawValue());
      // console.log(this.practices?.getRawValue());
      console.log(subj);
      this.dialogRef.close(subj);
    }
  }

  public nextStep() {
    this.myForm?.markAllAsTouched();
    if (this.myForm?.valid) {
      this.createNumOfPractices();
      this.createNumOfLectures();
      this.lessons = true;
    }
  }

  get practices(): FormArray {
    return this.lessonsForSubject.get("practices") as FormArray;
  }

  get lectures(): FormArray {
    return this.lessonsForSubject.get("lectures") as FormArray;
  }

  public createNumOfPractices() {
    for (let j = 0; j < this.myForm.get("numberOfGroups").value; j++) {
      for (let i = 0; i < this.myForm.get("practicePerWeek").value; i++) {
        this.practices.push(this.fb.group({
          id: [''],
          name: [`Cvičenie ${i + 1} Skupina ${j + 1}`, [Validators.required]],
          type: [LessonTypeEnum.Cvicenie],
          group: [j + 1], 
          numberOfStudents: [this.myForm.get('numberOfStudents').value / this.myForm.get("numberOfGroups").value, [Validators.required]],
          teacher: [this.myForm.get('teacher').value],
          schoolSubject: [this.myForm?.getRawValue()],
        }));
      }
    } 
  }

  public createNumOfLectures() {
    for (let i = 0; i < this.myForm.get("lecturesPerWeek").value; i++) {
      this.lectures.push(this.fb.group({
        id: [''],
        name: [`Prednáška ${i + 1}`, [Validators.required]],
        type: [LessonTypeEnum.Prednaska],
        numberOfStudents: [this.myForm.get('numberOfStudents').value / this.myForm.get("lecturesPerWeek").value, [Validators.required]],
        teacher: [this.myForm.get('teacher').value],
        schoolSubject: [this.myForm?.getRawValue()],
      }));
    }
  }
}
