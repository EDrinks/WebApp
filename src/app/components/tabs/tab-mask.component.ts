import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Tab } from '../../services/model/Tab';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tab-mask',
  templateUrl: './tab-mask.component.html'
})
export class TabMaskComponent implements OnInit {
  loading = false;
  submitting = false;
  tab: Tab;
  createMode = true;
  error: any;

  constructor(private service: BackendService, private activatedRoute: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.loadTab(params['id']);
        this.createMode = false;
      } else {
        this.tab = new Tab();
      }
    });
  }

  saveTab() {
    this.submitting = true;

    const observable = this.createMode ? this.service.createTab(this.tab) : this.service.updateTab(this.tab);

    observable
      .pipe(finalize(() => {
        this.submitting = false;
      }))
      .subscribe(() => {
        this.router.navigate(['/tabs', 'list']);
      }, (error) => {
        this.error = error;
      });
  }

  private loadTab(tabId: string) {
    this.loading = true;

    this.service.getTab(tabId)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((tab: Tab) => {
        this.tab = tab;
      });
  }
}
