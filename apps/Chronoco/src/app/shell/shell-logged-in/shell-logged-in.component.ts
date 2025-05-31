import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellLoggedInSidebarComponent } from './components/shell-logged-in-sidebar/shell-logged-in-sidebar.component';
import { ShellLoggedInHeaderComponent } from './components/shell-logged-in-header/shell-logged-in-header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell-logged-in',
  imports: [ CommonModule, ShellLoggedInSidebarComponent, ShellLoggedInHeaderComponent, RouterOutlet ],
  templateUrl: './shell-logged-in.component.html',
  styleUrl: './shell-logged-in.component.css',
})
export class ShellLoggedInComponent {
}
