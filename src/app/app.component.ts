import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  readonly title = 'pin-ui';
  readonly year = new Date().getFullYear();
  readonly author = 'Sergiu Blaj';
}
