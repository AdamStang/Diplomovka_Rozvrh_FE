import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { AddLessonDialogComponent } from 'src/app/dialogs/add-lesson-dialog/add-lesson-dialog.component';
import { AddSubjectDialogComponent } from 'src/app/dialogs/add-subject-dialog/add-subject-dialog.component';
import { EditLessonDialogComponent } from 'src/app/dialogs/edit-lesson-dialog/edit-lesson-dialog.component';
import { Lesson } from 'src/app/models/Lesson';
import { SchoolSubject } from 'src/app/models/SchoolSubject';
import { StudyProgramme } from 'src/app/models/StudyProgramme';
import { Room } from 'src/app/models/Room';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { DeleteDialogComponent } from 'src/app/shared/dialogs/delete-dialog/delete-dialog.component';
import { Teacher } from 'src/app/models/Teacher';
import { Timeslot } from 'src/app/models/Timeslot';

@Component({
  selector: 'app-school-subjects',
  templateUrl: './school-subjects.component.html',
  styleUrls: ['./school-subjects.component.scss']
})
export class SchoolSubjectsComponent implements OnInit, OnDestroy {
  public schoolSubjects: SchoolSubject[] = [];
  public filteredSchoolSubjects: SchoolSubject[] = []; 
  public selectedSchoolSubject: SchoolSubject;
  public teachers: Teacher[] = [];
  public rooms: Room[] = [];
  public timeslots: Timeslot[] = [];
  public studyProgrammes: StudyProgramme[] = [];
  public lessonsForSchoolSubject: Lesson[] = [];

  public search = new FormControl('');
  public stream$ = new Subject<SchoolSubject>();

  public loading = false;
  public loadingLessons = false;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private loadingService: LoadingService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit() {
    this.getSchoolSubjects();
    this.getStudyProgrammes();
    this.getTeachers();
    this.getRooms();
    this.getTimeslots();
    this.searchValueChanges();

    this.stream$.pipe(
      switchMap(res => this.apiService.getSubjectsLessons(res?.id)),
    ).subscribe(result => {
      this.lessonsForSchoolSubject = result;
      this.loadingLessons = false;
    });
  }

  public searchValueChanges() {
    console.log("BBBBB");
    this.search.valueChanges.subscribe(result => {
      if (result.trim() == '') this.filteredSchoolSubjects = this.schoolSubjects;
      else {
        this.filteredSchoolSubjects = this.schoolSubjects.filter(x => x.name.toLowerCase().includes(result.toLowerCase()));
      }
    });
  }

  public selectSubject(subject: SchoolSubject) {
    if (!subject) return;
    if (subject.id == this.selectedSchoolSubject?.id) return;
    this.selectedSchoolSubject = subject;
    this.loadingLessons = true;
    this.stream$.next(subject);
  }

  public getRooms() {
    this.apiService.getAllRooms().subscribe(result => {
      this.rooms = result;
    });
  }

  public getTimeslots() {
    this.apiService.getAllTimeslots().subscribe(result => {
      this.timeslots = result;
    });
  }

  public getSchoolSubjects() {
    this.loading = true;
    this.apiService.getAllSchoolSubjects().pipe(
      finalize(() => this.loading = false)
    ).subscribe(result => {
      this.schoolSubjects = result;
      this.filteredSchoolSubjects = result;
    });
  }

  public getStudyProgrammes() {
    this.apiService.getAllStudyProgrammes().subscribe(result => {
      this.studyProgrammes = result;
    });
  }

  public getTeachers() {
    this.apiService.getAllTeachers().subscribe(res => {
      this.teachers = res;
    });
  }

  openCreateSchoolSubjectDialog(): void {
    const dialogRef = this.dialog.open(AddSubjectDialogComponent, {
      disableClose: true,
      minWidth: 300,
      data: { teachers: this.teachers, studyProgrammes: this.studyProgrammes }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.loadingService.openDialog("Vytváram predmet");
      this.apiService.createSchoolSubject(result).pipe(
        finalize(() => this.loadingService.closeDialog())
      ).subscribe(_ => {
        this.snackbarService.showSuccessSnackBar("Predmet bol úspešne vytvorený.");
        this.getSchoolSubjects();
      });
    });
  }

  openDeleteDialog(event: Event, subject: SchoolSubject = this.selectedSchoolSubject): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      disableClose: true,
      width: '375px',
      data: { itemName: "Predmet" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == false) return;
      this.loadingService.openDialog("Odstraňujem predmet");
      this.apiService.deleteSchoolSubject(subject.id).pipe(
        finalize(() => this.loadingService.closeDialog())
      ).subscribe(_ => {
        this.snackbarService.showSuccessSnackBar("Predmet bol úspešne odstránený.");
        this.getSchoolSubjects();
        this.selectedSchoolSubject = null;
      });
    });
  }

  public openAddLessonDialog() {
    const dialogRef = this.dialog.open(AddLessonDialogComponent, {
      disableClose: true,
      width: '375px',
      data: this.teachers
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == false) return;
      this.loadingService.openDialog("Ukladám hodinu");
      result.schoolSubject = this.selectedSchoolSubject;
      this.apiService.addLesson(this.selectedSchoolSubject.id, result).pipe(
        finalize(() => this.loadingService.closeDialog())
      ).subscribe(_ => {
        this.snackbarService.showSuccessSnackBar("Hodina bola úspešne uložená.");
        this.selectSubject(this.selectedSchoolSubject);
      });
    });
  }

  public openEditLessonDialog(lesson: Lesson) {
    lesson.schoolSubject = this.selectedSchoolSubject;

    const dialogRef = this.dialog.open(EditLessonDialogComponent, {
      disableClose: true,
      width: '375px',
      data: {
        lesson: lesson,
        teachers: this.teachers,
        rooms: this.rooms,
        timeslots: this.timeslots
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == false) return;
      this.loadingService.openDialog("Ukladám hodinu");
      this.apiService.editLesson(lesson, result.timeslot, result.room, result.teacher).pipe(
        finalize(() => this.loadingService.closeDialog())
      ).subscribe(_ => {
        this.selectSubject(this.selectedSchoolSubject);
      });    
    });
  }

  ngOnDestroy(): void {
    this.stream$.next(null);
    this.stream$.complete();
  }
}
