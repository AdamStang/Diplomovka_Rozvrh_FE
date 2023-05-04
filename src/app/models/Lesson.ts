import { SchoolSubject } from "./SchoolSubject";
import { Room } from "./Room";
import { Teacher } from "./Teacher";
import { Timeslot } from "./Timeslot";

export class Lesson {
    id: string;
    name: string;
    type: string;
    group: number;
    teacher: Teacher;
    room?: Room;
    timeslot?: Timeslot;
    schoolSubject: SchoolSubject;
    numberOfStudents?: number;
}
