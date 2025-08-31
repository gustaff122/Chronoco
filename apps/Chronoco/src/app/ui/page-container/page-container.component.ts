import { Component, input, InputSignal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowUturnLeft } from '@ng-icons/heroicons/outline';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-container',
  imports: [
    NgIcon,
    RouterLink,
  ],
  templateUrl: './page-container.component.html',
  styleUrl: './page-container.component.css',
  viewProviders: [
    provideIcons({ heroArrowUturnLeft }),
  ],
})
export class PageContainerComponent {
  public caption: InputSignal<string> = input.required();
  public previousPage: InputSignal<string | string[]> = input();
}
