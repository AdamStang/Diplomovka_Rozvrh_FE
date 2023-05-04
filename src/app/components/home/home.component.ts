import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Timeslot } from 'src/app/models/Timeslot';
import { TimeslotsDialogComponent } from 'src/app/dialogs/timeslots-dialog/timeslots-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public roomsCount = 0;
  public departmentsCount = 0;
  public schoolSubjectsCount = 0;
  public teachersCount = 0;

  public loadingStats = false;
  public loadingTimetable = false;

  public timeslots: Timeslot[] = [];
  public hours: string[] = [];

  public numberOfHoursStr = "repeat(0, 1fr)";

  constructor(
    private apiServices: ApiService,
    private loadingService: LoadingService,
    private snackbarService: SnackbarService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getCountsOfEntities();
    this.getTimeslots();
  }

  public openDialog() {
    const dialogRef = this.dialog.open(TimeslotsDialogComponent, {
      disableClose: true,
      minWidth: 300,
      maxHeight: '90vh'
    });
  
    dialogRef.afterClosed().subscribe((result: Timeslot[]) => { 
      if (result) {
        this.loadingService.openDialog("Vytváram časové úseky pre rozvrh");
        let timeslots: Timeslot[] = result;
        this.apiServices.createTimeslots(timeslots).pipe(
          finalize(() => this.loadingService.closeDialog())
        ).subscribe(_ => {
          this.snackbarService.showSuccessSnackBar("Časové úseky pre rozvrh boli úspešne vytvorené.");
        });
      } 
    });
  }

  private getCountsOfEntities() {
    this.loadingStats = true;
    forkJoin([
      this.apiServices.getRoomsCount(),
      this.apiServices.getDepartmentsCount(),
      this.apiServices.getSchoolSubjectsCount(),
      this.apiServices.getTeachersCount()
    ]).pipe(
      finalize(() => this.loadingStats = false)
    ).subscribe(res => {
      this.roomsCount = res[0];
      this.departmentsCount = res[1];
      this.schoolSubjectsCount = res[2];
      this.teachersCount = res[3];
    });
  }

  private getTimeslots() {
    this.loadingTimetable = true;
    this.apiServices.getAllTimeslots().pipe(
      finalize(() => this.loadingTimetable = false)
    ).subscribe(res => {
      this.timeslots = res;
    });
  }
}
