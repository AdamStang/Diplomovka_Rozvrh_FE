import { Lesson } from "./Lesson";
import { StudyProgramme } from "./StudyProgramme";
import { Teacher } from "./Teacher";

export class SchoolSubject {
    id: string;
    name: string;
    abbr: string;
    lecturesPerWeek: number;
    practicePerWeek: number;
    numberOfStudents: number;
    numberOfGroups: number;
    teacher?: Teacher;
    studyProgramme?: StudyProgramme;
    lessons?: Lesson[];
}
