import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LessonTypeEnum } from 'src/app/Enums/LessonTypeEnum.enum';
import { AddStudyProgrammeDialogComponent } from 'src/app/dialogs/add-study-programme-dialog/add-study-programme-dialog.component';
import { AssignRoomDialogComponent } from 'src/app/dialogs/assign-room-dialog/assign-room-dialog.component';
import { Lesson } from 'src/app/models/Lesson';
import { StudyProgramme } from 'src/app/models/StudyProgramme';
import { Timeslot } from 'src/app/models/Timeslot';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { DeleteDialogComponent } from 'src/app/shared/dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-study-programmes',
  templateUrl: './study-programmes.component.html',
  styleUrls: ['./study-programmes.component.scss']
})
export class StudyProgrammesComponent implements OnInit {
  public studyProgrammes: StudyProgramme[] = [];
  public filteredStudyProgrammes: StudyProgramme[] = [];
  public selectedStudyProgramme: StudyProgramme | null = null;
  public timeslots: Timeslot[] = [];
  public hours: string[] = [];
  public groups: number[] = [];

  public studyProgramme = new UntypedFormControl();
  public switchAction = new UntypedFormControl("paralelky");
  public group = new UntypedFormControl();
  public search = new UntypedFormControl('');

  public loading = false;
  public loadingTimetable = false;
  public loadingSubjects = false;

  public gridNum = `repeat(0, 1fr)`;
  public lessonType = LessonTypeEnum;

  public assignedLessons: Lesson[] = [];
  public unassignedLessons: Lesson[] = [];
  public filteredAssignedLessons: Lesson[] = [];
  public filteredUnassignedLessons: Lesson[] = [];

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private loadingService: LoadingService,
    private snackbarService: SnackbarService,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.getStudyProgrammes();

    this.group.valueChanges.subscribe(res => {
      if (res == "prednasky") {
        this.filteredAssignedLessons = this.assignedLessons.filter(x => x.type == LessonTypeEnum.Prednaska);
        this.filteredUnassignedLessons = this.unassignedLessons.filter(x => x.type == LessonTypeEnum.Prednaska);
        this.updateAssignedLessons(this.filteredAssignedLessons);
      } else {
        this.filteredAssignedLessons = this.assignedLessons.filter(x => x?.group == res || x.type == LessonTypeEnum.Prednaska);
        this.filteredUnassignedLessons = this.unassignedLessons.filter(x => x?.group == res);
        this.updateAssignedLessons(this.filteredAssignedLessons);
      }
    });

    this.studyProgramme.valueChanges.subscribe(result => {
      this.selectedStudyProgramme = result;
      this.groups = Array.from({length: this.selectedStudyProgramme?.numberOfGroups}, (v, i) => i)
      this.clearTimeslots();

      let id = this.selectedStudyProgramme?.id.split("/").pop();
      if (!id) return;

      this.loadingTimetable = true;
      this.apiService.getAssignedLessonsForStudyProgramme(id).pipe(
        finalize(() => this.loadingTimetable = false)
      ).subscribe(result => {
        this.assignedLessons = result;
      });

      this.loadingSubjects = true;
      this.apiService.getUnassignedLessonsForStudyProgramme(id).pipe(
        finalize(() => this.loadingSubjects = false)
      ).subscribe(result => {
        this.unassignedLessons = result;
        this.group.patchValue("prednasky");
      });
    });

    this.getTimeslots();
    this.searchValueChanges();
  }

  public searchValueChanges() {
    this.search.valueChanges.subscribe(result => {
      if (result.trim() == '') this.filteredStudyProgrammes = this.studyProgrammes;
      else {
        this.filteredStudyProgrammes = this.studyProgrammes.filter(x => x.name.toLowerCase().includes(result.toLowerCase()));
      }
    });
  }

  public getStudyProgrammes() {
    this.loading = true;
    this.apiService.getAllStudyProgrammes().pipe(
      finalize(() => this.loading = false)
    ).subscribe(result => {
      this.studyProgrammes = result;
      this.filteredStudyProgrammes = result;
    });
  }

  public getTimeslots() {
    this.apiService.getAllTimeslots().subscribe(result => {
      this.timeslots = result;
      this.gridNum = `repeat(${this.timeslots.length / 5 ?? 0}, 1fr)`;
      this.hours = this.commonService.getHours(result);
    });
  }

  public clearTimeslots() {
    this.timeslots.forEach(slot => {
      slot.subjects = [];
    });
  }

  public SomeClick() {
    this.group.patchValue("prednasky");
  }

  public updateAssignedLessons(result: Lesson[]) {
    this.clearTimeslots();
    result.map(res => {
      this.timeslots.filter(r => r.id == res.timeslot?.id).map(r => {
        r.subjects = [res];
      })
    });
  }

  public updateAssignedLesson(lessonId: string, res: any, timeslotId: string) {
    if (!this.assignedLessons.find(x => x.id == lessonId)) {
      let lesson = this.unassignedLessons.find(x => x.id == lessonId);
      lesson.room = res.room;
      lesson.timeslot = this.timeslots.find(x => x.id == timeslotId);
      this.assignedLessons.push(lesson);
      this.filteredAssignedLessons.push(lesson);
      this.unassignedLessons = this.unassignedLessons.filter(x => x.id != lessonId);
    } else {
      this.assignedLessons.find(x => x.id == lessonId).timeslot = this.timeslots.find(x => x.id == timeslotId);
      this.filteredAssignedLessons.find(x => x.id == lessonId).timeslot = this.timeslots.find(x => x.id == timeslotId);
    }
    this.updateAssignedLessons(this.filteredAssignedLessons);
  }

  public updateUnassignedLesson(lessonId: string) {
    let lesson = this.assignedLessons.find(x => x.id == lessonId);
    this.assignedLessons = this.assignedLessons.filter(x => x.id != lessonId);
    this.filteredAssignedLessons = this.filteredAssignedLessons.filter(x => x.id != lessonId);
    lesson.timeslot = null;
    lesson.room = null;
    this.unassignedLessons.push(lesson);
    // this.filteredUnassignedLessons.push(lesson);
    this.updateAssignedLessons(this.filteredAssignedLessons);
  }

  public openAssignRoomDialog(lessonId: string, timeslotId: string, event: CdkDragDrop<any>, constraint: boolean, teacherId: string): void {
    this.loadingService.openDialog("Načítavam voľné miestnosti");
    let lesson: Lesson = this.unassignedLessons.find(x => x.id == lessonId);
    if (!lesson) lesson = this.assignedLessons.find(x => x.id == lessonId);

    this.apiService.getFreeRoomsForTimeslot(timeslotId, lesson.numberOfStudents).subscribe(result => {
      this.loadingService.closeDialog()
      const dialogRef = this.dialog.open(AssignRoomDialogComponent, {
        disableClose: true,
        minWidth: 300,
        data: { rooms: result, constraint: constraint }
      });

      dialogRef.afterClosed().pipe(
      ).subscribe(res => {
        if(!res || !res.room) return;
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        this.loadingService.openDialog("Priraďujem hodine miesto a čas");
        this.apiService.assignTimeslotAndRoomToLesson(lessonId, timeslotId, res.room.id, res.constraint, teacherId).pipe(
          
        ).subscribe(_ => {
          this.updateAssignedLesson(lessonId, res, timeslotId);
          this.loadingService.closeDialog();
          this.snackbarService.showSuccessSnackBar("Hodina bola úspešne vložená do rozvrhu.");
        });
      });
    });
  }

  openCreateStudyProgrammeDialog(): void {
    const dialogRef = this.dialog.open(AddStudyProgrammeDialogComponent, {
      disableClose: true,
      minWidth: 300
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.loadingService.openDialog("Vytváram paralelku");
      this.apiService.createStudyProgramme(result).pipe(
        finalize(() => this.loadingService.closeDialog())
      ).subscribe(_ => {
        this.snackbarService.showSuccessSnackBar("Paralelka bola úspešne vytvorená.");
        this.getStudyProgrammes();
      });
    });
  }

  openDeleteDialog(parallelBlock: StudyProgramme): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      disableClose: true,
      width: '375px',
      data: { itemName: "Paralelku" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == false) return;
      this.loadingService.openDialog("Odstraňujem paralelku");
      this.apiService.deleteStudyProgramme(parallelBlock.id).pipe(
        finalize(() => this.loadingService.closeDialog())
      ).subscribe(_ => {
        this.snackbarService.showSuccessSnackBar("Paralelka bola úspešne odstránená.");
        this.selectedStudyProgramme = null;
        this.getStudyProgrammes();
      });
    });
  }

  drop(event: CdkDragDrop<any>) {
    let timeslotId = event.container.id;
    let teacherId = event.previousContainer.data[event.previousIndex].teacher.id;
    let lessonId = event.previousContainer.data[event.previousIndex].id;

    if (event.previousContainer === event.container) {
      if(event.container.id == "unassigned")
        this.changePositionInUnassigned(event);
    } else {
      (event.container.id != "unassigned") ?
        this.moveToTimeslot(event, teacherId, timeslotId, lessonId) :
        this.moveToUnassigned(event, lessonId);
    }
  }

  public moveToUnassigned(event: CdkDragDrop<any>, lessonId: string) {
    this.loadingService.openDialog("Odstraňujem referencie");
    this.apiService.deleteTimeslotAndRoom(lessonId).pipe(
      finalize(() => this.loadingService.closeDialog())
    ).subscribe(_ => {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updateUnassignedLesson(lessonId);
    });
  }

  public changePositionInUnassigned(event: CdkDragDrop<any>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  public moveToTimeslot(event: CdkDragDrop<any>, teacherId: string, timeslotId: string, lessonId: string) {
    this.loadingService.openDialog("Kontrolujem kolízie");
    forkJoin(
      this.apiService.checkTeacherTimeCollision(teacherId, timeslotId ?? ""),
      this.apiService.checkTeacherTimeslotConstraint(teacherId, timeslotId)
    ).subscribe(result => {
      if (!result || result[0] == true) {
        this.snackbarService.showErrorSnackBar("Vyskytla sa kolízia.");
        return;
      }
      this.loadingService.closeDialog();
      this.openAssignRoomDialog(lessonId, timeslotId, event, result[1], teacherId);
    });
  }
}
