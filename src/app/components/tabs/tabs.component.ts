import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  template: `
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `
})
export class TabsComponent {

}
