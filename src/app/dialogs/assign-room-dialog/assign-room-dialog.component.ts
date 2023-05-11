import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Room } from 'src/app/models/Room';

@Component({
  selector: 'app-assign-room-dialog',
  templateUrl: './assign-room-dialog.component.html',
  styleUrls: ['./assign-room-dialog.component.scss']
})
export class AssignRoomDialogComponent implements OnInit {
  public myForm: UntypedFormGroup;
  public overrideCollision = new UntypedFormControl(false);
  public next = false;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AssignRoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rooms: Room[], constraint: boolean }
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      room: [null, Validators.required]
    });
    if (this.data.constraint == true) this.next = false;
    else this.next = true;
  }

  public submit() {
    this.myForm?.markAllAsTouched();
    if (this.myForm?.valid) {
      this.dialogRef.close({ room: this.myForm?.get("room").value, constraint: this.overrideCollision.value });
    }
  }
}
