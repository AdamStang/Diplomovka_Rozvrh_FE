import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { LessonTypeEnum } from 'src/app/Enums/LessonTypeEnum.enum';
import { Timeslot } from 'src/app/models/Timeslot';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-timetable-template',
  templateUrl: './timetable-template.component.html',
  styleUrls: ['./timetable-template.component.scss']
})
export class TimetableTemplateComponent implements OnInit {
  public numberOfHoursStr = `repeat(0, 1fr)`
  public hours: string[] = [];
  public _timeslots: Timeslot[] = [];
  get timeslots(): Timeslot[] {
    return this._timeslots;
  }
  @Input() set timeslots(value: Timeslot[]) {
    this._timeslots = value;
    this.hours = this.commonService.getHours(value);
    this.numberOfHoursStr = `repeat(${value.length / 5}, 1fr)`;
  }

  @Input() isTemplate: boolean = true;
  public border: string;
  public gap: string;
  @Input() selectedTimeslots: string[] = [];

  @Input() allowSelect = false;
  @Output() selectedItem = new EventEmitter<string>();
  public lessonType = LessonTypeEnum;

  constructor(
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    if (this.isTemplate) {
      this.border = "2px dotted #AAAAAA";
      this.gap = "4px";
    } else {
      this.border = "2px solid #AAAAAA";
      this.gap = "2px";
    }
  }

  public selectItem(timeslot: Timeslot) {
    if (!this.allowSelect) return;
    if (timeslot.subjects?.length > 0) return;
    this.selectedItem.emit(timeslot.id);
  }
}
