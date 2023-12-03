import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { GanttService } from '../gantt.service';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-gantt',
  template: `
    <form>
      <label for="title">Title:</label>
      <input type="text" id="title" ngModel name="title" required #title>

      <label for="start">Start Date:</label>
      <input type="datetime-local" id="start" ngModel name="start" required #start>

      <label for="end">End Date:</label>
      <input type="datetime-local" id="end" ngModel name="end" required #end>

      <button type="button" (click)="addEvent(title.value, start.value, end.value)">Add Event</button>
    </form>
    <div *ngIf="calendarOptions" style="height:100px">
      <full-calendar #fullcalendar [options]="calendarOptions"></full-calendar>
    </div>

  `,
  styles:`
  /* Add this CSS to your component's stylesheet or the global stylesheet */

form {
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 871px;
  margin: 0 auto;
}

label {
  flex-basis: 30%;
  margin-bottom: 8px;

}

input {
  flex-basis: calc(65% - 10px); /* Adjust the width as needed, considering margin */
  margin-right: 10px; /* Adjust the margin as needed */
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-left: 5px;
}

button {
  flex-basis: 100%;
  background-color: #4caf50;
  background-color: var(--fc-button-active-bg-color);
  border-color: var(--fc-button-active-border-color);
  color: var(--fc-button-text-color);
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

/* Optional: Add some spacing and style to the container holding all events */

h2 {
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

button.remove-btn {
  flex-basis: 100%;
  background-color: #d9534f;
  color: white;
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button.remove-btn:hover {
  background-color: #c9302c;
}

  `
})
export class GanttComponent implements OnInit {
  calendarOptions: CalendarOptions | undefined;

  // Use ViewChild to get a reference to the FullCalendar component
  @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent;

  constructor(public ganttService: GanttService) {}

  ngOnInit(): void {
    this.ganttService.loadEvents();

    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin], // Include timeGridPlugin and interactionPlugin
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right:'dayGridMonth,timeGridWeek,timeGridDay' // Include 'timeGridDay' for day view by hour
      },
      events: this.ganttService.events.map((event) => ({
        title: event.title,
        start: event.start,
        end: event.end,
        id: event.id, // Add the event id
      })),
      editable: true,
      eventClick: this.handleEventClick.bind(this), // Attach eventClick callback
    };
  }

  addEvent(title: string, start: string, end: string): void {
    // Validate and add the event
    this.ganttService.addEvent({ title, start, end, id: Date.now() });

    // Update the events in calendarOptions
    if (this.calendarOptions) {
      this.calendarOptions.events = this.ganttService.events.map((event) => ({
        title: event.title,
        start: event.start,
        end: event.end,
        id: event.id,
      }));
    }

    // Manually trigger a refresh of the FullCalendar view
    if (this.fullcalendar) {
      this.fullcalendar.getApi().refetchEvents();
    }
  }

  confirmRemoveEvent(event: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to remove the event "${event.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeEvent(event.id);
      }
    });
  }

  handleEventClick(arg: EventClickArg): void {
    // Handle event click (e.g., show a pop-up)
    const eventId = arg.event.id;
    this.confirmRemoveEvent(arg.event);
  }

  removeEvent(eventId: number | string): void {
    // Convert the event ID to a number if it's a string
    const numericId = typeof eventId === 'string' ? parseInt(eventId, 10) : eventId;
  
    this.ganttService.removeEvent(numericId);

    // Update the events in calendarOptions
    if (this.calendarOptions) {
      this.calendarOptions.events = this.ganttService.events.map((event) => ({
        title: event.title,
        start: event.start,
        end: event.end,
        id: event.id,
      }));
    }

    // Manually trigger a refresh of the FullCalendar view
    if (this.fullcalendar) {
      this.fullcalendar.getApi().refetchEvents();
    }
  }
}
