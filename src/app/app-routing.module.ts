import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GanttComponent } from './gantt/gantt/gantt.component';

const routes: Routes = [

  { path: '', component: GanttComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
