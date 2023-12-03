import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GanttService {
  private storageKey = 'gantt_events';
  events: any[] = [];

  constructor() {
    this.loadEvents();
  }

  loadEvents(): void {
    console.log('Loading events...');
    const storedEvents = localStorage.getItem(this.storageKey);
    if (storedEvents) {
      this.events = JSON.parse(storedEvents);
      console.log('Events loaded:', this.events);
    }
  }

  saveEvents(): void {
    console.log('Saving events...', this.events);
    localStorage.setItem(this.storageKey, JSON.stringify(this.events));
    console.log('Events saved.');
  }

  addEvent(event: any): void {
    this.events.push(event);
    this.saveEvents();
  }

  removeEvent(eventId: number): void {
    this.events = this.events.filter((event) => event.id !== eventId);
    this.saveEvents();
  }
}
