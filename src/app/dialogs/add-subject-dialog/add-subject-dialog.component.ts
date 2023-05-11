import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
  public myForm: UntypedFormGroup | undefined;
  public lessonsForSubject: UntypedFormGroup;
  public lessons = false;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AddSubjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { teachers: Teacher[], studyProgrammes: StudyProgramme[] }
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      abbr: ['', [Validators.required]],
      numberOfStudents: [{value: null, disabled: true}, [Validators.required]],
      lecturesPerWeek: [null, [Validators.required]],
      practicePerWeek: [null, [Validators.required]],
      numberOfGroups: [{value: null, disabled: true}, [Validators.required]],
      studyProgramme: [null, [Validators.required]],
      teacher: [null]
    });
    this.myForm.get("studyProgramme").valueChanges.subscribe(result => {
      this.myForm.get("numberOfStudents").setValue(result.numberOfStudents);
      this.myForm.get("numberOfGroups").setValue(result.numberOfGroups);
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

  get practices(): UntypedFormArray {
    return this.lessonsForSubject.get("practices") as UntypedFormArray;
  }

  get lectures(): UntypedFormArray {
    return this.lessonsForSubject.get("lectures") as UntypedFormArray;
  }

  public createNumOfPractices() {
    for (let j = 0; j < this.myForm.get("numberOfGroups").value; j++) {
      for (let i = 0; i < this.myForm.get("practicePerWeek").value; i++) {
        this.practices.push(this.fb.group({
          id: [''],
          name: [`Cvičenie ${i + 1} Skupina ${j + 1}`, [Validators.required]],
          type: [LessonTypeEnum.Cvicenie],
          group: [j + 1], 
          numberOfStudents: [{ value: this.myForm.get('numberOfStudents').value / this.myForm.get("numberOfGroups").value, disabled: true }, [Validators.required]],
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
        numberOfStudents: [{ value: this.myForm.get('numberOfStudents').value, disabled: true }, [Validators.required]],
        teacher: [this.myForm.get('teacher').value],
        schoolSubject: [this.myForm?.getRawValue()],
      }));
    }
  }
}
