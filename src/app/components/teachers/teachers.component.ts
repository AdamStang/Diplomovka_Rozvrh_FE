import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, forkJoin } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { AddTeacherDialogComponent } from 'src/app/dialogs/add-teacher-dialog/add-teacher-dialog.component';
import { AddTimeConstraintsDialogComponent } from 'src/app/dialogs/add-time-constraints-dialog/add-time-constraints-dialog.component';
import { MoveTeachersDialogComponent } from 'src/app/dialogs/move-teachers-dialog/move-teachers-dialog.component';
import { Department } from 'src/app/models/Department';
import { Lesson } from 'src/app/models/Lesson';
import { Teacher } from 'src/app/models/Teacher';
import { Timeslot } from 'src/app/models/Timeslot';
import { ApiService } from 'src/app/services/api.service';
import { DeleteDialogComponent } from 'src/app/shared/dialogs/delete-dialog/delete-dialog.component';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit, OnDestroy {
  public teachers: Teacher[] = [];
  public filteredTeachers: Teacher[] = [];
  public subjectsForTeacher: Lesson[] = [];
  public departments: Department[] = [];
  public selectedTeacher: Teacher | null = null;
  public timeslots: Timeslot[] = [];

  public search = new UntypedFormControl('');
  public stream$ = new Subject<Teacher>();

  public loading = false;
  public loadingTimetable = false;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private loadingService: LoadingService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit() {
    this.getTeachers();
    this.getTimeslots();
    this.getDepartments();
    this.searchValueChanges();

    this.stream$.pipe(
      switchMap(res => forkJoin(
        this.apiService.getLessonsForTeacher(res?.id),
        this.apiService.getTimeslotConstraints(res?.id)
      )),
    ).subscribe(result => {
      this.subjectsForTeacher = result[0];
      this.selectedTeacher.timeConstraints = result[1];
      result[0].map(res => {
        this.timeslots.filter(r => r.id == res.timeslot?.id).map(r => {
          r.subjects = [res];
        })
      });
      this.loadingTimetable = false;
    });
  }

  public teacherSelected(teacher: Teacher) {
    if (!teacher) return;
    if (teacher.id == this.selectedTeacher?.id) return;
    
    this.clearTimeslots();
    this.subjectsForTeacher = [];
    this.selectedTeacher = teacher;
    this.selectedTeacher.timeConstraints = [];

    this.loadingTimetable = true;
    this.stream$.next(teacher);
  }

  public searchValueChanges() {
    this.search.valueChanges.subscribe(result => {
      if (result.trim() == "") this.filteredTeachers = this.teachers;
      else this.filteredTeachers = this.teachers.filter(x => x.name.toLowerCase().includes(result.toLowerCase()));
    });
  }

  public getTeachers() {
    this.loading = true;
    this.apiService.getAllTeachers().pipe(
      finalize(() => this.loading = false)
    ).subscribe(result => {
      this.teachers = result;
      this.filteredTeachers = result;
    });
  }

  public getDepartments() {
    this.apiService.getAllDepartments().subscribe(result => {
      this.departments = result;
    });
  }

  public getTimeslots() {
    this.apiService.getAllTimeslots().subscribe(result => {
      this.timeslots = result;
    });
  }

  public clearTimeslots() {
    this.timeslots.forEach(slot => {
      slot.subjects = [];
    });
  }

  public openCreateTeacherDialog(): void {
    const dialogRef = this.dialog.open(AddTeacherDialogComponent, {
      disableClose: true,
      minWidth: 300,
      data: this.departments
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.loadingService.openDialog("Vytváram učiteľa");
      this.apiService.createTeacher(result).pipe(
        finalize(() => this.loadingService.closeDialog())
      ).subscribe(_ => {
        this.snackbarService.showSuccessSnackBar("Učiteľ bol úspešne vytvorený.");
        this.getTeachers();
      });
    });
  }

  public openDeleteDialog(event: Event, teacher: Teacher = this.selectedTeacher): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      disableClose: true,
      width: '375px',
      data: { itemName: "Učiteľa" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == false) return;
      this.loadingService.openDialog("Odstraňujem učiteľa");
      this.apiService.deleteTeacher(teacher.id).pipe(
        finalize(() => this.loadingService.closeDialog())
      ).subscribe(_ => {
        this.snackbarService.showSuccessSnackBar("Učiteľ bol úspešne odstránený.");
        this.getTeachers();
        this.selectedTeacher = null;
      });
    });
  }

  public openChangeDepartmentDialog(event: Event) {
    const dialogRef = this.dialog.open(MoveTeachersDialogComponent, {
      disableClose: true,
      width: '375px',
      data: this.departments
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == false) return;
      this.loadingService.openDialog("Mením katedru učiteľa");
      this.apiService.moveTeachersToNewDepartment([this.selectedTeacher.id], result.id, this.selectedTeacher.department).pipe(
        finalize(() => this.loadingService.closeDialog())
      ).subscribe(_ => {
        this.snackbarService.showSuccessSnackBar("Katedra bola úspešne zmenená.");
        this.getTeachers();
      });
    });
  }

  public openEditConstraintsDialog(event: Event) {
    const dialogRef = this.dialog.open(AddTimeConstraintsDialogComponent, {
      disableClose: true,
      data: {
        timeslots: this.timeslots,
        timeslotIds: this.selectedTeacher.timeConstraints
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == false) return;
      this.loadingService.openDialog("Ukladám obmedzenia času.");
      this.apiService.updateTimeConstraintsForTeacher(this.selectedTeacher.id, result).pipe(
        finalize(() => this.loadingService.closeDialog())
      ).subscribe(_ => {
        this.selectedTeacher.timeConstraints = result;
        this.snackbarService.showSuccessSnackBar("Obmedzenia času boli úspešne vytvorené.");
      });
    });
  }

  ngOnDestroy(): void {
    this.stream$.next(null);
    this.stream$.complete();
  }
}
