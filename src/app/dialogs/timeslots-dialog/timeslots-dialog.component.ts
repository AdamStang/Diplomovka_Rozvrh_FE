import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Timeslot } from 'src/app/models/Timeslot';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-timeslots-dialog',
  templateUrl: './timeslots-dialog.component.html',
  styleUrls: ['./timeslots-dialog.component.scss']
})
export class TimeslotsDialogComponent implements OnInit {
  public myForm: UntypedFormGroup;
  public timeslots: Timeslot[] = [];
  public maxNumPerDay = 12;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<TimeslotsDialogComponent>,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      startingTime: ["07:00", [Validators.required]],
      numberOfHours: [8, [Validators.required, Validators.min(1), Validators.max(this.maxNumPerDay)]],
      lengthOfHour: [50, Validators.required],
      lengthOfRest: [10, [Validators.required, Validators.min(1), Validators.max(60)]]
    });

    this.myForm.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged()
    ).subscribe(res => {
      this.computeMaxNumOfHoursPerDay();
      this.checkRanges(res);
      this.timeslots = this.commonService.createTimeslots(res);
    });

    this.myForm.updateValueAndValidity();
  }

  public computeMaxNumOfHoursPerDay() {
    let [ hour, minute ] = this.myForm?.get('startingTime')?.value.split(":");
    this.maxNumPerDay = (1440 - ((+hour * 60) + (+minute))) / (this.myForm?.get('lengthOfHour')?.value + this.myForm?.get('lengthOfRest')?.value);
    this.myForm?.get("numberOfHours")?.setValidators([Validators.required, Validators.min(1), Validators.max(this.maxNumPerDay)]);
  }

  public submit() {
    this.myForm?.markAllAsTouched();
    if (this.myForm?.valid) this.dialogRef.close(this.timeslots);
  }

  public checkRange(value: number, min: number, max: number, name: string) {
    if (value < min) this.myForm?.get(name)?.patchValue(min);
    if (value > max) this.myForm?.get(name)?.patchValue(max);
  }

  public checkRanges(res) {
    this.checkRange(res.lengthOfHour, 1, 60, "lengthOfHour");
    this.checkRange(res.lengthOfRest, 1, 60, "lengthOfRest");
    this.checkRange(res.numberOfHours, 1, this.maxNumPerDay, "numberOfHours");
  }
}
