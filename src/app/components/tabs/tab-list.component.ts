import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { finalize } from 'rxjs/operators';
import { Tab } from '../../services/model/Tab';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TabDeleteModalComponent } from './tab-delete-modal.component';

@Component({
  selector: 'app-tab-list',
  templateUrl: './tab-list.component.html'
})
export class TabListComponent implements OnInit {
  loading = false;
  tabs: Tab[] = [];

  constructor(private service: BackendService, private modalService: NgbModal) {

  }

  ngOnInit() {
    this.loadTabs();
  }

  confirmDeleteTab(tab: Tab) {
    const modal = this.modalService.open(TabDeleteModalComponent);
    modal.componentInstance.tab = tab;

    modal.result.then((deletedTab: Tab) => {
      this.tabs = this.tabs.filter((loadedTab) => {
        return loadedTab.id !== deletedTab.id;
      });
    }, () => undefined);
  }

  private loadTabs() {
    this.loading = true;

    this.service.getTabs()
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((tabs: Tab[]) => {
        this.tabs = tabs;
      });
  }
}
