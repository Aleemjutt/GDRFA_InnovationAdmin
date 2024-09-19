import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FilePondModule } from 'ngx-filepond';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import {
  AttendanceStatus,
  WorkshopAttendanceViewModel,
} from 'src/app/_models/CreativeSupport/workshopViewModel';
import { ResponseResult, StatusCodes } from 'src/app/_models/responseResult';
import { JoinProgramService } from 'src/app/_services/_creativeSupport/join-program.service';
import { JoinProgramShareServiceService } from 'src/app/_services/SharedServices/join-program-share-service.service';

@Component({
  selector: 'app-list-workshop-attendance',
  standalone: true,
  imports: [FormsModule, FilePondModule, CommonModule, TranslateModule],
  templateUrl: './list-workshop-attendance.component.html',
  styleUrl: './list-workshop-attendance.component.css',
})
export class ListWorkshopAttendanceComponent implements OnInit {
  @Input()
  listWorkshopAttendanceViewModel: WorkshopAttendanceViewModel[] = [];
  @Input() workshopId: number = 0;
  constructor(
    private globalService: GlobalServiceService,
    private sharedService: JoinProgramShareServiceService,
    private joinProgramService: JoinProgramService
  ) {}

  ngOnInit(): void {
    this.initilizeDataTable();
    // Fetch the data and update the service
    this.joinProgramService
      ._listWorkshopAttendance(this.workshopId)
      .subscribe((response: ResponseResult) => {
        // ////console.log(response.data, 'Data Table values');
        if (response.statusCode == StatusCodes.success) {
          const workshopAttendanceViewModelList = response.data; // Replace with your actual fetching logic

          this.sharedService._setWorkshopList(workshopAttendanceViewModelList);
          this.initilizeDataTable();
        }
      });
  }

  initilizeDataTable(): void {
    const currentLang = this.globalService.getCurrentLanguage();
    const languageConfig =
      currentLang === 'ar'
        ? this.globalService.getArabicLanguageConfig()
        : this.globalService.getEnglishLanguageConfig();
    const datatable: any = $('#workshopAttendanceDataTable').DataTable();

    datatable.destroy();

    setTimeout(() => {
      $('#workshopAttendanceDataTable').DataTable({
        pagingType: 'full_numbers',
        pageLength: 5,
        processing: true,
        data: this.listWorkshopAttendanceViewModel,
        language: languageConfig,
        columns: [
          { data: 'id' },
          { data: 'empId' },
          { data: 'empName' },
          {
            data: (row: any) =>
              this.globalService.ConvertDateTimeToDateOnly(row.registerDate),
          },
          {
            data: (row: any) =>
              this.globalService.getAttendanceStatusName(row.attendanceStatus),
          },

          {
            data: (row: any) => `

<div class="form-check form-switch">
              <input
                type="checkbox"
                class="form-check-input"
               id="userStatusInput_${row.id}"
                [(ngModel)]="participationTestViewModel.statusCode"
                ${
                  row.attendanceStatus == AttendanceStatus.Present
                    ? 'checked'
                    : ''
                }
              />
              
            </div>

             
            `,
            orderable: false,
          },
        ],
        rowCallback: (row: Node, data: any, index: number) => {
          // const btnViewDetail = $('button:first', row);
          // const btnEdit = $('button:eq(1)', row);
          // const btnDelete = $('button:eq(2)', row);

          return row;
        },

        lengthMenu: [5, 10, 25],
      });
    }, 1);
    //});
  }

  submitAttendanceDataFromDataTable(): void {
    const datatable: any = $('#workshopAttendanceDataTable').DataTable();
    const data: any[] = datatable.rows().data().toArray(); // Get all rows data
    this.listWorkshopAttendanceViewModel = data.map((row: any) => {
      return {
        registerDate: row.registerDate,
        userId: row.userId,
        userName: row.userName,
        empId: row.empId,
        empName: row.empName,
        workshopId: row.workshopId,
        attendanceStatus: $(`#userStatusInput_${row.id}`).is(':checked')
          ? AttendanceStatus.Present
          : AttendanceStatus.Absent,
      } as WorkshopAttendanceViewModel;
    });

    // Do something with this.listWorkshopAttendanceViewModel, like sending it to the server
    console.log(this.listWorkshopAttendanceViewModel);
  }
}
