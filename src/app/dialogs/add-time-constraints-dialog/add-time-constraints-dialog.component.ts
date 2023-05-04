import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Timeslot } from 'src/app/models/Timeslot';

@Component({
  selector: 'app-add-time-constraints-dialog',
  templateUrl: './add-time-constraints-dialog.component.html',
  styleUrls: ['./add-time-constraints-dialog.component.scss']
})
export class AddTimeConstraintsDialogComponent implements OnInit {
  public timeslotIds: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddTimeConstraintsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { timeslots: Timeslot[], timeslotIds: string[] }
  ) { }

  ngOnInit() {
    this.timeslotIds = this.data.timeslotIds;
  }

  public itemSelected(timeslotId: string) {
    if (this.timeslotIds?.includes(timeslotId)) {
      this.timeslotIds = this.timeslotIds.filter(x => x != timeslotId);
    } else this.timeslotIds.push(timeslotId);
  }

  public submit() {
    this.dialogRef.close(this.timeslotIds);
  }
}
