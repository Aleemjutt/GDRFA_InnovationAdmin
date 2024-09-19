import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import {
  ParticipationTestAnswerViewModel,
  ParticipationTestViewModel,
} from 'src/app/_models/CreativeSupport/participatingTestViewModel';
import { ResponseResult, StatusCodes } from 'src/app/_models/responseResult';
import { JoinProgramService } from 'src/app/_services/_creativeSupport/join-program.service';

@Component({
  selector: 'app-join-program-list',
  standalone: true,
  imports: [FormsModule, CommonModule, AccordionModule, TranslateModule],
  templateUrl: './join-program-list.component.html',
  styleUrl: './join-program-list.component.css',
})
export class JoinProgramListComponent implements OnInit {
  participationTestAnswerViewModelList: ParticipationTestAnswerViewModel[] = [];
  participationTestViewModelList: ParticipationTestViewModel[] = [];
  private languageChangeSubscription!: Subscription;
  constructor(
    public globalService: GlobalServiceService,
    private tosterService: ToastrService,
    private joinProgramService: JoinProgramService,
    private modalService: BsModalService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.initilizeDataTable();
  }
  initilizeDataTable(): void {
    const currentLang = this.globalService.getCurrentLanguage();
    const languageConfig =
      currentLang === 'ar'
        ? this.globalService.getArabicLanguageConfig()
        : this.globalService.getEnglishLanguageConfig();
    const datatable: any = $('#joinProgramDataTable').DataTable();
    this.joinProgramService
      ._getProgramList()
      .subscribe((response: ResponseResult) => {
        // ////console.log(response.data, 'Data Table values');
        console.log(response, 'response');

        this.participationTestViewModelList = response.data;
        // Datatable reloading
        datatable.destroy();

        setTimeout(() => {
          $('#joinProgramDataTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            data: this.participationTestViewModelList,
            language: languageConfig,
            columns: [
              { data: 'id' },
              { data: 'descriptionEn' },
              { data: 'descriptionAr' },
              {
                data: (row: any) =>
                  this.globalService.ConvertDateTimeToDateOnly(row.startDate),
              },
              {
                data: (row: any) =>
                  this.globalService.ConvertDateTimeToDateOnly(row.endDate),
              },
              {
                data: (row: any) =>
                  this.globalService.getStatusNameOnCodeBased(row.statusCode),
              },
              {
                data: 'data',
                defaultContent: `
              <button
              type="button"
              class="btn btn-light mr-1"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
             
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
            `,
              },
            ],
            rowCallback: (row: Node, data: any, index: number) => {
              const btnViewDetail = $('button:first', row);
              const btnEdit = $('button:eq(1)', row);
              const btnDelete = $('button:last', row);

              // const btnSubmitionDetails = $('button:last', row);
              // Attach click event handlers to the buttons
              btnViewDetail.on('click', () => {
                this.router.navigateByUrl(
                  // '/creativeSupport/listProgram/' + data.id
                  `/creativeSupport/addProgram/${data.id}/1`
                );
              });
              btnEdit.on('click', () => {
                this.router.navigateByUrl(
                  `/creativeSupport/addProgram/${data.id}/2`
                );
              });
              btnDelete.on('click', () => {
                console.log(`Delete Button Clicked: ${data.id}`);
                this.joinProgramService._deleteProgram(data.id).subscribe({
                  next: (response: ResponseResult) => {
                    if (
                      response.statusCode == StatusCodes.success ||
                      response.statusCode == StatusCodes.deleted
                    ) {
                      this.tosterService.success(response.message);
                      this.initilizeDataTable();
                    } else {
                      this.tosterService.error(response.message);
                    }

                    // Optionally, you can remove the row or refresh the data table
                  },
                });
              });

              return row;
            },

            lengthMenu: [5, 10, 25],
          });
        }, 1);
      });
  }
  // viewProgramDetails(id: number) {
  //   this.router.Rou;
  // }
  // editProgram(id: number) {}
  // deleteProgram(id: number) {}
}
