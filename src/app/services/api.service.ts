import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Department } from '../models/Department';
import { StudyProgramme } from '../models/StudyProgramme';
import { SchoolSubject } from '../models/SchoolSubject';
import { Lesson } from '../models/Lesson';
import { Room } from '../models/Room';
import { Timeslot } from '../models/Timeslot';
import { Teacher } from '../models/Teacher';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URLS
  private roomsBaseUrl = `${environment.baseUrl}/Rooms`;
  private departmentsBaseUrl = `${environment.baseUrl}/Departments`;
  private schoolSubjectsBaseUrl = `${environment.baseUrl}/SchoolSubjects`;
  private teachersBaseUrl = `${environment.baseUrl}/Teachers`;
  private timeslotsBaseUrl = `${environment.baseUrl}/Timeslots`;
  private studyProgrammeBaseUrl = `${environment.baseUrl}/StudyProgrammes`;
  private lessonBaseUrl = `${environment.baseUrl}/Lessons`;

  constructor(private http: HttpClient) { }

  // ROOM 
  public getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.roomsBaseUrl}/getAllRooms`);
  }

  public getRoomsCount(): Observable<number> {
    return this.http.get<number>(`${this.roomsBaseUrl}/getRoomsCount`);
  }

  public createRoom(room: Room): Observable<any> {
    return this.http.post<void>(`${this.roomsBaseUrl}/createRoom`, room);
  }

  public deleteRoom(roomId: string): Observable<any> {
    return this.http.delete<void>(`${this.roomsBaseUrl}/deleteRoom?roomId=${roomId}`);
  }

  public getFreeRoomsForTimeslot(timeslotId: string, numberOfStudents: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.roomsBaseUrl}/getFreeRoomsForTimeslot?timeslotId=${timeslotId}&numberOfStudents=${numberOfStudents}`);
  }

  public checkRoomTimeCollision(roomId: string, timeslotId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.roomsBaseUrl}/checkRoomTimeCollision?roomId=${roomId}&timeslotId=${timeslotId}`);
  }

  // DEPARTMENT
  public getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.departmentsBaseUrl}/getAllDepartments`);
  }

  public getDepartmentsCount(): Observable<number> {
    return this.http.get<number>(`${this.departmentsBaseUrl}/getDepartmentsCount`);
  }

  public createDepartment(department: Department): Observable<any> {
    return this.http.post<void>(`${this.departmentsBaseUrl}/createDepartment`, department);
  }

  public deleteDepartment(departmentId: string): Observable<any> {
    return this.http.delete<void>(`${this.departmentsBaseUrl}/deleteDepartment?departmentId=${departmentId}`);
  }

  // TIMESLOT
  public getAllTimeslots(): Observable<Timeslot[]> {
    return this.http.get<Timeslot[]>(`${this.timeslotsBaseUrl}/getAllTimeslots`);
  }

  public createTimeslots(timeslots: Timeslot[]): Observable<any> {
    return this.http.post<void>(`${this.timeslotsBaseUrl}/createTimeslots`, timeslots);
  }

  // STUDY PROGRAMME
  public getAllStudyProgrammes(): Observable<StudyProgramme[]> {
    return this.http.get<StudyProgramme[]>(`${this.studyProgrammeBaseUrl}/getAllStudyProgrammes`);
  }

  public createStudyProgramme(studyProgramme: StudyProgramme): Observable<any> {
    return this.http.post<void>(`${this.studyProgrammeBaseUrl}/createStudyProgramme`, studyProgramme);
  }

  public deleteStudyProgramme(studyProgrammeId: string): Observable<any> {
    return this.http.delete(`${this.studyProgrammeBaseUrl}/deleteStudyProgramme?studyProgrammeId=${studyProgrammeId}`);
  }

  // TEACHER
  public getAllTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.teachersBaseUrl}/getAllTeachers`);
  }

  public getTeachersCount(): Observable<number> {
    return this.http.get<number>(`${this.teachersBaseUrl}/getTeachersCount`);
  }

  public createTeacher(teacher: Teacher): Observable<any> {
    return this.http.post<void>(`${this.teachersBaseUrl}/createTeacher`, teacher);
  } 

  public deleteTeacher(teacherId: string): Observable<any> {
    return this.http.delete<void>(`${this.teachersBaseUrl}/deleteTeacher?teacherId=${teacherId}`);
  }

  public checkTeacherTimeCollision(teacherId: string, timeslotId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.teachersBaseUrl}/checkTeacherTimeCollision?teacherId=${teacherId}&timeslotId=${timeslotId}`);
  }

  public getTeachersByDepartment(departmentId: string): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.teachersBaseUrl}/getTeachersByDepartment?departmentId=${departmentId}`);
  }

  public moveTeachersToNewDepartment(teachers: string[], newDepartmentId: string, previousDepartmentId): Observable<any> {
    return this.http.post<void>(`${this.teachersBaseUrl}/moveTeachersToNewDepartment`, { teacherIds: teachers, newDepartmentId: newDepartmentId, previousDepartmentId: previousDepartmentId });
  }

  public updateTimeConstraintsForTeacher(teacherId: string, timeslotIds: string[]): Observable<any> {
    return this.http.post<void>(`${this.teachersBaseUrl}/updateTimeConstraintsForTeacher`, { teacherId: teacherId, timeslotsIds: timeslotIds });
  }

  public getTimeslotConstraints(teacherId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.teachersBaseUrl}/getTimeslotConstraints?teacherId=${teacherId}`);
  }

  public checkTeacherTimeslotConstraint(teacherId:string, timeslotId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.teachersBaseUrl}/checkTeacherTimeslotConstraint?teacherId=${teacherId}&timeslotId=${timeslotId}`);
  }

  // SCHOOL SUBJECT
  public getAllSchoolSubjects(): Observable<SchoolSubject[]> {
    return this.http.get<SchoolSubject[]>(`${this.schoolSubjectsBaseUrl}/getAllSchoolSubjects`);
  }

  public getSchoolSubjectsCount(): Observable<number> {
    return this.http.get<number>(`${this.schoolSubjectsBaseUrl}/getSchoolSubjectsCount`);
  }

  public createSchoolSubject(schoolSubject: SchoolSubject): Observable<any> {
    return this.http.post<void>(`${this.schoolSubjectsBaseUrl}/createSchoolSubject`, schoolSubject);
  }

  public deleteSchoolSubject(schoolSubjectId: string): Observable<any> {
    return this.http.delete<void>(`${this.schoolSubjectsBaseUrl}/deleteSchoolSubject?schoolSubjectId=${schoolSubjectId}`);
  }

  public getSubjectsLessons(schoolSubjectId: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.schoolSubjectsBaseUrl}/getSubjectsLessons?subjectId=${schoolSubjectId}`);
  }

  public addLesson(schoolSubjectId: string, lesson: Lesson): Observable<any> {
    return this.http.post<void>(`${this.schoolSubjectsBaseUrl}/addLesson`, { schoolSubjectId: schoolSubjectId, newLesson: lesson });
  }

  // LESSONS
  public getLessonsInRoom(roomId: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.lessonBaseUrl}/getLessonsInRoom?roomId=${roomId}`);
  }

  public getLessonsForTeacher(teacherId: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.lessonBaseUrl}/getLessonsForTeacher?teacherId=${teacherId}`);
  }

  public getAssignedLessonsForStudyProgramme(studyProgrammeId: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.lessonBaseUrl}/getAssignedLessonsForStudyProgramme?studyProgrammeId=${studyProgrammeId}`);
  }

  public getUnassignedLessonsForStudyProgramme(studyProgrammeId: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.lessonBaseUrl}/getUnassignedLessonsForStudyProgramme?studyProgrammeId=${studyProgrammeId}`);
  }

  public assignTimeslotAndRoomToLesson(lessonId: string, timeslotId: string, roomId: string, constraint: boolean, teacherId: string): Observable<any> {
    return this.http.post<void>(`${this.lessonBaseUrl}/assignTimeslotAndRoomToLesson`, {lessonId, timeslotId, roomId, constraint, teacherId});
  }

  public deleteTimeslotAndRoom(lessonId: string): Observable<any> {
    return this.http.delete(`${this.lessonBaseUrl}/deleteTimeslotAndRoom?lessonId=${lessonId}`);
  }

  public editLesson(lesson: Lesson, timeslot: Timeslot, room: Room, teacher: Teacher): Observable<any> {
    return this.http.post<void>(`${this.lessonBaseUrl}/editLesson`, { lesson: lesson, newTeacher: teacher, newTimeslot: timeslot, newRoom: room });
  }
}
