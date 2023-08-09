import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-header #myComponent></app-header>
    <div>
      <router-outlet></router-outlet>
    </div>
    <div>
      <app-footer></app-footer>
    </div>
    <ngx-spinner size="medium" type="ball-spin-clockwise-fade">Loading...</ngx-spinner>
  `,
})
export class AppComponent {}
