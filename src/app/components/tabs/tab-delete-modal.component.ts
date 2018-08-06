import { Component } from '@angular/core';
import { Tab } from '../../services/model/Tab';
import { BackendService } from '../../services/backend.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tab-delete-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{'tab.confirm-delete-tab' | translate}}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <h3>{{tab?.name}}</h3>
    </div>
    <div class="modal-footer">
      <div class="alert alert-danger" *ngIf="errorMessage">{{errorMessage}}</div>
      <button type="button" class="btn btn-danger" (click)="deleteTab()" [disabled]="deleting">
        <span *ngIf="deleting"><i class="fas fa-spinner"></i></span>
        {{'common.delete' | translate}}
      </button>
    </div>
  `
})
export class TabDeleteModalComponent {
  tab: Tab;
  errorMessage = '';
  deleting = false;

  constructor(public activeModal: NgbActiveModal, private service: BackendService) {
  }

  deleteTab() {
    this.deleting = true;

    this.service.deleteTab(this.tab.id)
      .pipe(finalize(() => {
        this.deleting = false;
      }))
      .subscribe(() => {
        this.activeModal.close(this.tab);
      }, (error) => {
        this.errorMessage = error;
      });
  }
}
