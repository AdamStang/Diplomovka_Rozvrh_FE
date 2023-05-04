import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DaysEnum } from '../Enums/DaysEnum.enum';
import { Timeslot } from '../models/Timeslot';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public days = Object.values(DaysEnum);
  public today = moment();

  constructor() { }

  public toTime(time: string): string {
    let [ hours, minutes ] = time.split(":");
    return `${hours}:${minutes}`;
  }

  public toTimeslot(startTime: string, endTime: string): string {
    return `${this.toTime(startTime)} - ${this.toTime(endTime)}`;
  }

  public getHours(timeslots: Timeslot[]): string[] {
    let hours = [];
    for (let i = 0; i < timeslots.length / 5; i++)
      hours.push(this.toTimeslot(timeslots[i].startTime, timeslots[i].endTime));
    
    return hours;
  }

  public createTimeslots(res): Timeslot[] {
    let timeslots = [];
    let [hour, minute] = (res.startingTime as string).split(":");
    this.today.minutes(+minute);
    this.today.hours(+hour);

    for (let i = 0; i < 5; i++) {
      this.today.minutes(+minute);
      this.today.hours(+hour);

      for (let j = 0; j < res.numberOfHours; j++) {
        let start = this.today.clone().format("HH:mm");
        let end = this.today.add(res.lengthOfHour, "minutes").clone().format("HH:mm");

        timeslots.push(new Timeslot(this.days[i], start, end));
        this.today.add(res.lengthOfRest, "minutes");
      } 
    }
    return timeslots;
  }
}
