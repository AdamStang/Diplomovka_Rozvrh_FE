import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RoomTypeEnum } from 'src/app/Enums/RoomTypeEnum.enum';

@Component({
  selector: 'app-add-room-dialog',
  templateUrl: './add-room-dialog.component.html',
  styleUrls: ['./add-room-dialog.component.scss']
})
export class AddRoomDialogComponent implements OnInit {
  public roomTypes = RoomTypeEnum;
  public myForm: FormGroup | undefined;
  public update: boolean = false;
  public title: string = "Vytvoriť";

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddRoomDialogComponent>,
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      capacity: [null, [Validators.required]],
      type: [null, [Validators.required]]
    });
  }

  public submit() {
    this.myForm?.markAllAsTouched();
    if (this.myForm?.valid) {
      this.dialogRef.close(this.myForm?.getRawValue());
    }
  }
}
