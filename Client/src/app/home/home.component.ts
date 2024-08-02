import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { GlobalServiceService } from '../_global/-global-service.service';
import { DashBoardService } from '../_services/dash-board.service';
import { ResponseResult, StatusCodes } from '../_models/responseResult';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  registerMode = false;
  users: any;
  showBarChart = true;
  private languageChangeSubscription!: Subscription;
  private currentUserSubscription: Subscription;
  constructor(
    private http: HttpClient,
    public globalService: GlobalServiceService,
    private dashBoardService: DashBoardService
  ) {
    Object.assign(this, {});
    this.languageChangeSubscription = new Subscription();
    this.currentUserSubscription = new Subscription();
  }
  ngOnInit(): void {
    //this.getDepartments();
    //this.getDashBoardCount(0);
    //this.getUsers();

    this.languageChangeSubscription =
      this.globalService.languageChange$.subscribe((lang) => {
        // Update the ng-select label property when the language changes
        this.updateBindLabel(lang);
      });
  }

  private updateBindLabel(lang: string): void {
    // You might need to recreate or refresh the ng-select component here
    // Use a timeout to allow Angular to detect changes and refresh the ng-select component
    setTimeout(() => {
      // Refresh the ng-select component

      this.getIdeasList(lang);
    });
  }

  // data = [
  //   { name: '> 95', value: 765 },
  //   { name: '90 - 94', value: 123 },
  //   { name: '< 90', value: 84 },
  // ];

  // getDepartments() {
  //   this.orchChart.getDepartmentsOnly().subscribe({
  //     next: (response) => {
  //       this.departmentsList = response.result;
  //     },
  //   });
  // }

  colorScheme = {
    domain: ['#08DDC1', '#FFDC1B', '#FF5E3A', '#DAA520'],
  };

  arrayValue = [{ name: '', value: 0 }];
  view: [number, number] = [700, 400];

  // options
  legendPosition: LegendPosition = LegendPosition.Right;
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  //Barchart

  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;

  onSelect(data: any): void {
    console.log('Item clicked', this.arrayValue);
  }

  onActivate(data: any): void {
    console.log('Activate', this.arrayValue);
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', this.arrayValue);
  }

  registerToggle(data: any) {
    this.registerMode = !this.registerMode;
  }

  // getUsers() {
  //   this.http.get('https://localhost:5051/api/users').subscribe({
  //     next: (reponse) => (this.users = reponse),
  //     error: (error) => console.log(error),
  //     complete: () => console.log('Request has been Completed'),
  //   });
  // }

  getIdeasList(lang: string) {
    this.dashBoardService.getDashboardCount().subscribe({
      next: (response: ResponseResult) => {
        if (lang === 'en') {
          console.log('lang', lang);

          $('.legend-title-text').text('Ideas Status');
        } else {
          $('.legend-title-text').text('حالة الأفكار');
        }
        if (response.statusCode == StatusCodes.success) {
          this.arrayValue = response.data;
          //const lang = this.globalService.getCurrentLanguage();
        }
      },
    });
  }

  cancelRegisterMode(Event: boolean) {
    this.registerMode = Event;
  }

  // getDashBoardCount(depetId: number) {
  //   console.log('DeptId', depetId);
  //   this.dashboardService
  //     .getDashboardCount(depetId)
  //     .subscribe((response: any) => {
  //       if (response.statusCode == 0) {
  //         console.log(response.data);
  //         this.single = response.data;
  //       }
  //     });
  // }
}
