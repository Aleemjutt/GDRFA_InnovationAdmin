import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  registerMode = false;
  users: any;

  constructor(private http: HttpClient) {
    Object.assign(this, {});
  }
  ngOnInit(): void {
    //this.getDepartments();
    //this.getDashBoardCount(0);
    //this.getUsers();
  }
  departmentsList: any[] = [];

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
    domain: ['#08DDC1', '#FFDC1B', '#FF5E3A'],
  };

  single = [
    {
      name: 'Pending',
      value: 20,
    },
    {
      name: 'Completd',
      value: 10,
    },
    {
      name: 'Total',
      value: 100,
    },
    {
      name: 'Underprocess',
      value: 78,
    },
  ];
  view: [number, number] = [700, 400];

  // options
  legendPosition: LegendPosition = LegendPosition.Right;
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  onSelect(data: any): void {
    console.log('Item clicked', this.single);
  }

  onActivate(data: any): void {
    console.log('Activate', this.single);
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', this.single);
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
