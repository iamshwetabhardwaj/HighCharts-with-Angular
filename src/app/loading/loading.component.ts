import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from './loader.service';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  loadingSubscription: Subscription;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loadingSubscription = this.loaderService.loadingStatus.subscribe((value: boolean) => {
      this.loading = value;
    });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

}
