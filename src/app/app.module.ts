import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// ---------------------------- Components -------------------------------- //
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AddRoomDialogComponent } from './dialogs/add-room-dialog/add-room-dialog.component';
import { AddSubjectDialogComponent } from './dialogs/add-subject-dialog/add-subject-dialog.component';
import { AddTeacherDialogComponent } from './dialogs/add-teacher-dialog/add-teacher-dialog.component';
import { TeachersComponent } from './components/teachers/teachers.component';
import { HomeComponent } from './components/home/home.component';
import { TimeslotsDialogComponent } from './dialogs/timeslots-dialog/timeslots-dialog.component';
import { TimetableTemplateComponent } from './components/timetable-template/timetable-template.component';

// ------------------------- Material Modules ---------------------------- //
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { SharedModule } from './shared/shared.module';

// ------------------------- Testing components ------------------------- //
import { DepartmentsComponent } from './components/departments/departments.component';
import { SchoolSubjectsComponent } from './components/school-subjects/school-subjects.component';
import { StudyProgrammesComponent } from './components/study-programmes/study-programmes.component';
import { AssignRoomDialogComponent } from './dialogs/assign-room-dialog/assign-room-dialog.component';
import { MoveTeachersDialogComponent } from './dialogs/move-teachers-dialog/move-teachers-dialog.component';
import { AddLessonDialogComponent } from './dialogs/add-lesson-dialog/add-lesson-dialog.component';
import { EditLessonDialogComponent } from './dialogs/edit-lesson-dialog/edit-lesson-dialog.component';
import { AddTimeConstraintsDialogComponent } from './dialogs/add-time-constraints-dialog/add-time-constraints-dialog.component';
import { AddStudyProgrammeDialogComponent } from './dialogs/add-study-programme-dialog/add-study-programme-dialog.component';
import { AddDepartmentDialogComponent } from './dialogs/add-department-dialog/add-department-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        RoomsComponent,
        PageNotFoundComponent,
        AddRoomDialogComponent,
        AddDepartmentDialogComponent,
        AddSubjectDialogComponent,
        AddTeacherDialogComponent,
        TeachersComponent,
        HomeComponent,
        TimeslotsDialogComponent,
        TimetableTemplateComponent,
        AddStudyProgrammeDialogComponent,
        DepartmentsComponent,
        SchoolSubjectsComponent,
        StudyProgrammesComponent,
        AssignRoomDialogComponent,
        MoveTeachersDialogComponent,
        AddLessonDialogComponent,
        EditLessonDialogComponent,
        AddTimeConstraintsDialogComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SharedModule,
    ],
    providers: [
        {
            provide: MAT_RADIO_DEFAULT_OPTIONS,
            useValue: { color: 'primary' },
        },
        {
            provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
            useValue: { color: 'primary' },
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
