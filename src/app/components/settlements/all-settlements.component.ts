import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BackendService } from '../../services/backend.service';
import { Settlement } from '../../services/model/Settlement';
import { finalize } from 'rxjs/operators';

const dateFormat = 'YYYY-MM-DD';

@Component({
  selector: 'app-all-settlements',
  templateUrl: './all-settlements.component.html'
})
export class AllSettlementsComponent implements OnInit {

  loading = false;
  errorMessage = '';
  formData = {
    fromDate: '',
    toDate: ''
  };

  settlements: Settlement[] = [];
  offset = 0;

  constructor(private service: BackendService) {

  }

  ngOnInit() {
    this.formData.fromDate = moment().subtract(2, 'weeks').format(dateFormat);
    this.formData.toDate = moment().format(dateFormat);

    this.loadSettlements();
  }

  loadSettlements() {
    if (!this.formData.fromDate || !this.formData.toDate) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.service.getSettlements(this.offset)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((settlements: Settlement[]) => {
        this.settlements = this.settlements.concat(settlements);
      }, (error) => {
        this.errorMessage = error;
      });
  }

  loadNextPage() {
    this.offset += 1;
    this.loadSettlements();
  }
}
