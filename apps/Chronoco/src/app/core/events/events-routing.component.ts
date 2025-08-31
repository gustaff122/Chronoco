import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventsService } from '../../services/events-service/events.service';

@Component({
  selector: 'app-events-routing',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './events-routing.component.html',
  styleUrl: './events-routing.component.css',
  providers: [
    EventsService,
  ],
})
export class EventsRoutingComponent {

}
