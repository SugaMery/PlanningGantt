import { FullCalendarModule } from '@fullcalendar/angular';
import { GanttService } from './gantt.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../app.component';
import { GanttComponent } from './gantt/gantt.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [GanttComponent],
  imports: [CommonModule, FormsModule, FullCalendarModule,HttpClientModule],
  providers: [GanttService],
})
export class GanttModule {}
