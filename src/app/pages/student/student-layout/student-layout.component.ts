import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {AuthService} from "@lib/services";

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-layout.component.html',
  styleUrls: ['./student-layout.component.css']
})
export class StudentLayoutComponent {
  routes: Array<IStudentRoute> = [
    {
      name: 'Dashboard',
      routes: ['/student', 'dashboard'],
      icon: this.domSanitizer.bypassSecurityTrustHtml(` <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
              stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          </svg>`)
    }
  ]

  otherRoutes: Array<IStudentRoute> = []

  fullName = this.authService.loggedInUser?.fullName || 'NA'

  constructor(private domSanitizer: DomSanitizer, private authService: AuthService) {
  }

}

export interface IStudentRoute {
  name: string;
  routes: Array<string>;
  icon: SafeHtml;
}
