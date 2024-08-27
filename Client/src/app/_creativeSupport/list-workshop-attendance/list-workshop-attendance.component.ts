import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FilePondModule } from 'ngx-filepond';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { WorkshopAttendanceViewModel } from 'src/app/_models/CreativeSupport/workshopViewModel';
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
  @Input() programId: number = 0;
  constructor(
    private globalService: GlobalServiceService,
    private sharedService: JoinProgramShareServiceService,
    private joinProgramService: JoinProgramService
  ) {}

  ngOnInit(): void {
    // Fetch the data and update the service
    this.joinProgramService
      ._listInWorkshopAttendance(this.programId)
      .subscribe((response: ResponseResult) => {
        // ////console.log(response.data, 'Data Table values');
        if (response.statusCode == StatusCodes.success) {
          const workshopAttendanceViewModelList = response.data; // Replace with your actual fetching logic

          this.sharedService._setWorkshopList(workshopAttendanceViewModelList);
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
    // this.joinProgramService
    //   ._getProgramList()
    //   .subscribe((response: ResponseResult) => {
    //     // ////console.log(response.data, 'Data Table values');
    //     console.log(response, 'response');

    //     this.participationTestViewModelList = response.data;
    //     // Datatable reloading

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
            data: 'data',
            defaultContent: `
              <button
              type="button"
              class="btn btn-light mr-1"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              (click)="viewpartnerDetails()"
              data-backdrop="static"
              data-keyboard="false"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
            </svg>
            </button>
            <button
            type="button"
            class="btn btn-light mr-1"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            (click)="editpartner(id, template)"
            data-backdrop="static"
            data-keyboard="false"
          >
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              class="bi bi-pencil-square"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
              />
              <path
                fill-rule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
              />
            </svg>
          </button>
            <button
                type="button"
                class="btn btn-outline-danger  mr-1 "
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                (click)="deletepartner(id)"
                data-backdrop="static"
                data-keyboard="false"
              >
              <svg
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              class="bi bi-trash-fill"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"
              />
            </svg>
              </button>
              <button type="button" class="btn btn-light mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-in-up-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M6.364 13.5a.5.5 0 0 0 .5.5H13.5a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 13.5 1h-10A1.5 1.5 0 0 0 2 2.5v6.636a.5.5 0 1 0 1 0V2.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H6.864a.5.5 0 0 0-.5.5"/>
              <path fill-rule="evenodd" d="M11 5.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793l-8.147 8.146a.5.5 0 0 0 .708.708L10 6.707V10.5a.5.5 0 0 0 1 0z"/>
              </svg>
                   </button>
            `,
          },
        ],
        rowCallback: (row: Node, data: any, index: number) => {
          const btnViewDetail = $('button:first', row);
          const btnEdit = $('button:eq(1)', row);
          const btnDelete = $('button:eq(2)', row);
          // const btnSubmitionDetails = $('button:last', row);
          // Attach click event handlers to the buttons
          // btnViewDetail.on('click', () => {
          //   this.router.navigateByUrl(
          //     // '/creativeSupport/listProgram/' + data.id
          //     `/creativeSupport/addProgram/${data.id}/1`
          //   );
          // });
          // btnEdit.on('click', () => {
          //   this.router.navigateByUrl(`/creativeSupport/addProgram/${data.id}/2`);
          // });
          // btnDelete.on('click', () => {
          //   this.joinProgramService._deleteProgram(data.id);
          // });

          return row;
        },

        lengthMenu: [5, 10, 25],
      });
    }, 1);
    //});
  }
}
