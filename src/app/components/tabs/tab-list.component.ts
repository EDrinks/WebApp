import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { finalize } from 'rxjs/operators';
import { Tab } from '../../services/model/Tab';

@Component({
  selector: 'app-tab-list',
  templateUrl: './tab-list.component.html'
})
export class TabListComponent implements OnInit {
  loading = false;
  tabs: Tab[] = [];

  constructor(private service: BackendService) {

  }

  ngOnInit() {
    this.loadTabs();
  }

  confirmDeleteTab(tab: Tab) {
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
