import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { AddDepartmentDialogComponent } from 'src/app/dialogs/add-department-dialog/add-department-dialog.component';
import { MoveTeachersDialogComponent } from 'src/app/dialogs/move-teachers-dialog/move-teachers-dialog.component';
import { Department } from 'src/app/models/Department';
import { Teacher } from 'src/app/models/Teacher';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { DeleteDialogComponent } from 'src/app/shared/dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit, OnDestroy {
  public departments: Department[] = [];
  public filteredDepartments: Department[] = [];
  public teachersForDepartment: Teacher[] = [];
  public selectedDepartment: Department;
  public teachersForDepartmentChange: string[] = [];

  public search = new UntypedFormControl('');
  public stream$ = new Subject<Department>();
  
  public loading = false;
  public loadingTeachers = false;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private loadingService: LoadingService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit() {
    this.getDepartments();
    this.searchValueChanges();

    this.stream$.pipe(
      switchMap(res => this.apiService.getTeachersByDepartment(res?.id)),
    ).subscribe(result => {
      this.teachersForDepartment = result;
      this.loadingTeachers = false;
    });
  }

  public searchValueChanges() {
    this.search.valueChanges.subscribe(result => {
      if (result.trim() == '') this.filteredDepartments = this.departments;
      else {
        this.filteredDepartments = this.departments.filter(x => x.name.toLowerCase().includes(result.toLowerCase()));
      }
    });
  }

  public getDepartments() {
    this.loading = true;
    this.apiService.getAllDepartments().pipe(
      finalize(() => this.loading = false)
    ).subscribe(result => {
      this.departments = result;
      this.filteredDepartments = result;
    });
  }

  public showTeachers(department: Department) {
    if (!department) return;
    this.selectedDepartment = department;
    this.loadingTeachers = true;
    this.stream$.next(department);
  }

  public toggleInList(id: string) {
    (this.teachersForDepartmentChange.includes(id)) ?
      this.teachersForDepartmentChange.splice(this.teachersForDepartmentChange.indexOf(id), 1) :
      this.teachersForDepartmentChange.push(id);
  }

  openCreateDepartmentDialog(): void {
    const dialogRef = this.dialog.open(AddDepartmentDialogComponent, {
      disableClose: true,
      minWidth: 300
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.loadingService.openDialog("Vytváram katedru");
      this.apiService.createDepartment(result).pipe(
        finalize(() => this.loadingService.closeDialog())
      ).subscribe(_ => {
        this.snackbarService.showSuccessSnackBar("Katedra bola úspešne vytvorená.");
        this.getDepartments();
      });
    });
  }

  openDeleteDialog(event: Event, department: Department = this.selectedDepartment): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      disableClose: true,
      width: '375px',
      data: { itemName: "Katedru" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == false) return;
      this.loadingService.openDialog("Odstraňujem katedru");
      this.apiService.deleteDepartment(department.id).pipe(
        finalize(() => this.loadingService.closeDialog())
      ).subscribe(_ => {
        this.snackbarService.showSuccessSnackBar("Katedra bola úspešne odstránená.");
        this.getDepartments();
        this.selectedDepartment = null;
      });
    });
  }

  public openMoveTeachersDialog() {
    const dialogRef = this.dialog.open(MoveTeachersDialogComponent, {
      disableClose: true,
      width: '375px',
      data: this.departments
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == false) return;
      this.loadingService.openDialog("Presúvam učiteľov");
      this.apiService.moveTeachersToNewDepartment(this.teachersForDepartmentChange, result.id, this.selectedDepartment.id).pipe(
        finalize(() => this.loadingService.closeDialog())
      ).subscribe(_ => {
        this.teachersForDepartmentChange = [];
        this.snackbarService.showSuccessSnackBar("Učitelia boli úspešne presunutý.");
        this.showTeachers(this.selectedDepartment);
      });
    });
  }

  ngOnDestroy(): void {
    this.stream$.next(null);
    this.stream$.complete();
  }
}
