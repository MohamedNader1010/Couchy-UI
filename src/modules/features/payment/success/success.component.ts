import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
})
export class SuccessComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  trackId: any;
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.trackId = params['TrackID'];
    });
  }
}
