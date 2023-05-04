import { Department } from "./Department";
import { Lesson } from "./Lesson";
import { SchoolSubject } from "./SchoolSubject";

export class Teacher {
    id: string;
    name: string;
    degree: string;
    department?: Department;
    schoolSubjects?: SchoolSubject[];
    lessons?: Lesson[];
    timeConstraints?: string[];
}
