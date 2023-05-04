import { Lesson } from "./Lesson";

export class Timeslot {
    id: string = "";
    day: string;
    startTime: string;
    endTime: string;
    subjects?: Lesson[] = [];

    constructor (day: string, startTime: string, endTime: string) {
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
