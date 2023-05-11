import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, forkJoin } from 'rxjs';
import { Lesson } from 'src/app/models/Lesson';
import { Room } from 'src/app/models/Room';
import { Teacher } from 'src/app/models/Teacher';
import { Timeslot } from 'src/app/models/Timeslot';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-edit-lesson-dialog',
  templateUrl: './edit-lesson-dialog.component.html',
  styleUrls: ['./edit-lesson-dialog.component.scss']
})
export class EditLessonDialogComponent implements OnInit {
  public myForm: UntypedFormGroup | undefined;
  public loading = false;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<EditLessonDialogComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: {
      lesson: Lesson,
      teachers: Teacher[],
      rooms: Room[],
      timeslots: Timeslot[]
    }
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      lesson: [this.data?.lesson ?? null],
      teacher: [this.data?.lesson?.teacher ?? null],
      room: [this.data?.lesson?.room ?? null],
      timeslot: [this.data?.lesson?.timeslot ?? null],
    });

    this.myForm.get("teacher").valueChanges.subscribe(result => {
      let timeslot = this.myForm.get("timeslot");
      if (!timeslot) return;

      this.loading = true;
      forkJoin(
        this.apiService.checkTeacherTimeCollision(result.id, timeslot.value.id),
        this.apiService.checkTeacherTimeslotConstraint(result.id, timeslot.value.id)
      ).subscribe(res => {
        if (res[0] == true) this.myForm.controls.timeslot.setErrors({timeslotCollision: true});
        else if (res[1] == true) this.myForm.controls.timeslot.setErrors({timeslotConstraints: true});
        else this.myForm.controls.timeslot.setErrors(null);
        this.myForm.markAllAsTouched();
        this.loading = false;
      });
    });

    this.myForm.get("room").valueChanges.subscribe(result => {
      let timeslot = this.myForm.get("timeslot");
      if (timeslot?.value == null) return;

      this.loading = true;
      this.apiService.checkRoomTimeCollision(result.id, timeslot.value.id).subscribe(res => {
        if (res == true) this.myForm.controls.timeslot.setErrors({timeslotCollision: true});
        else this.myForm.controls.timeslot.setErrors(null);
        this.myForm.markAllAsTouched();
        this.loading = false;
      });
    });

    this.myForm.get("timeslot").valueChanges.subscribe(result => {
      let room = this.myForm.get("room");
      let teacher = this.myForm.get("teacher");
      let endArray: [Observable<boolean> | null, Observable<boolean> | null, Observable<boolean> | null] = [null, null, null];

      if (room.value != null) {
        endArray[0] = this.apiService.checkRoomTimeCollision(room.value.id, result.id);
      }
      if (teacher.value != null) {
        endArray[1] = this.apiService.checkTeacherTimeCollision(teacher.value.id, result.id);
        endArray[2] = this.apiService.checkTeacherTimeslotConstraint(teacher.value.id, result.id);
      }

      if (endArray.length > 0) {
        this.loading = true;
        forkJoin(...endArray).subscribe(res => {
          console.log("Kolizie: ", res);
          if (res[0] != null) {
            if (res[0] == true) this.myForm.controls.room.setErrors({timeslotCollision: true});
            else this.myForm.controls.room.setErrors(null);
          }
          if (res[1] != null) {
            console.log("KOLIZIA");
            if (res[1] == true) this.myForm.controls.teacher.setErrors({timeslotCollision: true});
            // else this.myForm.controls.teacher.setErrors(null);
          }
          if (res[2] != null) {
            if (res[2] == true) this.myForm.controls.teacher.setErrors({timeslotConstraints: true});
            // else this.myForm.controls.teacher.setErrors(null);
          }
          if (res[1] != null && res[2] != null && res[1] == false && res[2] == false)
            this.myForm.controls.teacher.setErrors(null);
          this.myForm.markAllAsTouched();
          this.loading = false;
        });
      }
    });
  }

  public submit() {
    this.myForm?.markAllAsTouched();
    if (this.myForm?.valid) {
      this.dialogRef.close(this.myForm?.getRawValue());
    }
  }

  public compareObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }
}
