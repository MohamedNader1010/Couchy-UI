import { GenericService } from 'src/core/services/generic.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/modules/layout/layout-service.service';
import { DashboardStatistics } from './intefaces/dashboard.interface';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';
@Component({
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  items!: MenuItem[];

  dashboardData: DashboardStatistics = {} as DashboardStatistics;
  chartData: any;

  chartOptions: any;

  subscription!: Subscription;

  constructor(public layoutService: LayoutService, private _dashboardService: GenericService<DashboardStatistics>) {}

  ngOnInit() {
    this.getData();
  }
  private getData() {
    this._dashboardService.setControllerName('Dashboard');
    this._dashboardService.getAll().subscribe((result) => {
      if (result.code == ResponseCode.Success) {
        this.dashboardData = result.body;
      }
    });
  }
}
