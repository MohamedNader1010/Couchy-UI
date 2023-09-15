import { GenericService } from 'src/core/services/generic.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription, catchError } from 'rxjs';
import { LayoutService } from 'src/modules/layout/layout-service.service';
import { DashboardStatistics } from './intefaces/dashboard.interface';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';
import { AlertService } from 'src/core/services/alert.service';
@Component({
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  items!: MenuItem[];
  defaulImagePath= "assets/layout/images/defaultProfile.jpeg"
  dashboardData: DashboardStatistics = {} as DashboardStatistics;
  chartData: any;

  chartOptions: any;

  subscription!: Subscription;

  constructor(public layoutService: LayoutService,private _alertService: AlertService, private _dashboardService: GenericService<DashboardStatistics>) {}

  ngOnInit() {
    this.getData();
  }
  private getData() {
    this._dashboardService.setControllerName('Dashboard');
    this._dashboardService.getAll()
    .pipe(catchError((error) => {
      this._alertService.fail(error.message);
      return [];
    }))
    .subscribe((result) => {
      if (result.code == ResponseCode.Success) {
        this.dashboardData = result.body;
      }
    });
  }
}
