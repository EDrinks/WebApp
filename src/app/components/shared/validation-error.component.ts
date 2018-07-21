import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-validation-error',
  templateUrl: './validation-error.component.html'
})
export class ValidationErrorComponent implements OnChanges {
  @Input() validationError: any;
  keys = [];

  ngOnChanges() {
    if (this.validationError) {
      this.keys = Object.keys(this.validationError);
    }
  }

}
