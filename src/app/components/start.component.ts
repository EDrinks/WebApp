import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { Tab } from '../services/model/Tab';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  tabs: Tab[] = [];
  tabsLoading = false;
  tabsError = '';

  constructor(private service: BackendService, private router: Router) {
  }

  ngOnInit() {
    this.loadTabs();
  }

  selectTab(tab: Tab) {
    this.router.navigate(['tab', tab.id]);
  }

  private loadTabs() {
    this.tabsLoading = true;
    this.tabsError = '';

    this.service.getTabs()
      .pipe(finalize(() => {
        this.tabsLoading = false;
      }))
      .subscribe((tabs: Tab[]) => {
        this.tabs = tabs;
      }, (error) => {
        this.tabsError = error;
      });
  }
}
