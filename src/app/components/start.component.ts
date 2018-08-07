import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { Tab } from '../services/model/Tab';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  tabs: Tab[] = [];
  tabsLoading = false;
  tabsError = '';
  selectedTab: Tab = null;

  constructor(private service: BackendService) {
  }

  ngOnInit() {
    this.loadTabs();
  }

  selectTab(tab: Tab) {
    this.selectedTab = tab;
  }

  private loadTabs() {
    this.tabsLoading = true;
    this.tabsError = '';

    this.service.getTabs()
      .pipe(finalize(() => {
        this.tabsLoading = false;
      }))
      .subscribe((tabs: Tab[]) => {
        this.tabs = tabs.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          return 1;
        });
      }, (error) => {
        this.tabsError = error;
      });
  }
}
