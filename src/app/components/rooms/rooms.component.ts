import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddRoomDialogComponent } from 'src/app/dialogs/add-room-dialog/add-room-dialog.component';
import { ApiService } from 'src/app/services/api.service';
import { finalize, switchMap } from 'rxjs/operators';
import { UntypedFormControl } from '@angular/forms';
import { DeleteDialogComponent } from 'src/app/shared/dialogs/delete-dialog/delete-dialog.component';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Room } from 'src/app/models/Room';
import { Lesson } from 'src/app/models/Lesson';
import { Subject } from 'rxjs';
import { Timeslot } from 'src/app/models/Timeslot';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit, OnDestroy {
  public rooms: Room[] = [];
  public filteredRooms: Room[] = [];
  public subjectsForRoom: Lesson[] = [];
  public selectedRoom: Room | null = null;
  public timeslots: Timeslot[] = [];

  public loading = false;
  public loadingTimetable = false;
  
  public filter = new UntypedFormControl("all");
  public search = new UntypedFormControl('');
  public stream$ = new Subject<Room>();

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private loadingService: LoadingService,
    private snackbarService: SnackbarService,
  ) { }


  ngOnInit() {
    this.getRooms();
    this.getTimeslots();
    this.searchValueChanges();

    this.stream$.pipe(
      switchMap(res => this.apiService.getLessonsInRoom(res?.id)),
    ).subscribe(result => {
      this.subjectsForRoom = result;
      result.map(res => {
        this.timeslots.filter(r => r.id == res.timeslot?.id).map(r => {
          r.subjects = [res];
        })
      });
      this.loadingTimetable = false;
    });
  }

  public roomSelected(room: Room) {
    if (!room) return;
    if (room.id == this.selectedRoom?.id) return;

    this.clearTimeslots();
    this.subjectsForRoom = [];
    this.selectedRoom = room;

    this.loadingTimetable = true;
    this.stream$.next(room);
  }

  public searchValueChanges() {
    this.search.valueChanges.subscribe(result => {
      if (result.trim() == '') this.filteredRooms = this.rooms;
      else this.filteredRooms = this.rooms.filter(x => x.name.toLowerCase().includes(result.toLowerCase())); 
    });
  }

  public getRooms() {
    this.loading = true;
    this.apiService.getAllRooms().pipe(
      finalize(() => this.loading = false)
    ).subscribe(result => {
      this.rooms = result;
      this.filteredRooms = result;
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

  openCreateRoomDialog(): void {
    const dialogRef = this.dialog.open(AddRoomDialogComponent, {
      disableClose: true,
      minWidth: 300,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.loadingService.openDialog("Vytváram miestnosť");
      this.apiService.createRoom(result).pipe(
        finalize(() => this.loadingService.closeDialog())
      ).subscribe(_ => {
        this.snackbarService.showSuccessSnackBar("Miestnosť bola úspešne vytvorená.");
        this.getRooms();
      });
    });
  }

  openDeleteDialog(event: Event, room: Room = this.selectedRoom): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      disableClose: true,
      width: '375px',
      data: { itemName: "Miestnosť" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == false) return;
      this.loadingService.openDialog("Odstraňujem miestnosť");
      this.apiService.deleteRoom(room.id).pipe(
        finalize(() => this.loadingService.closeDialog())
      ).subscribe(_ => {
        this.snackbarService.showSuccessSnackBar("Miestnosť bola úspešne odstránená.");
        this.getRooms();
        this.selectedRoom = null;
      });
    });
  }

  ngOnDestroy(): void {
    this.stream$.next(null);
    this.stream$.complete();
  }
}
