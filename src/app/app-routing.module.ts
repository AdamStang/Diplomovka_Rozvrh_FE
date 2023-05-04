import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { SchoolSubjectsComponent } from './components/school-subjects/school-subjects.component';
import { StudyProgrammesComponent } from './components/study-programmes/study-programmes.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { TeachersComponent } from './components/teachers/teachers.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "miestnosti",
    component: RoomsComponent
  },
  {
    path: "katedry",
    component: DepartmentsComponent
  },
  {
    path: "predmety",
    component: SchoolSubjectsComponent
  },
  {
    path: "ucitelia",
    component: TeachersComponent
  },
  {
    path: "paralelky",
    component: StudyProgrammesComponent
  },
  {
    path: "**",
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
