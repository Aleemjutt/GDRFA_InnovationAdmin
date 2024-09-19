import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { JoinProgramChallengeSubmitViewModel } from 'src/app/_models/CreativeSupport/joinProgramChallengeViewModel';
import { ResponseResult } from 'src/app/_models/responseResult';
import { JoinProgramService } from 'src/app/_services/_creativeSupport/join-program.service';
import { FiledownloaderService } from 'src/app/_services/filedownloader.service';
import { JoinProgramShareServiceService } from 'src/app/_services/SharedServices/join-program-share-service.service';

@Component({
  selector: 'app-list-challenged-submited',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './list-challenged-submited.component.html',
  styleUrl: './list-challenged-submited.component.css',
})
export class ListChallengedSubmitedComponent implements OnInit {
  @Input()
  listChallengeSubmitedViewModel: JoinProgramChallengeSubmitViewModel[] = [];
  @Input() programId: number = 0;
  constructor(
    private globalService: GlobalServiceService,
    private sharedService: JoinProgramShareServiceService,
    private joinProgramService: JoinProgramService,
    private downloadService: FiledownloaderService
  ) {}

  ngOnInit(): void {
    // Fetch the data and update the service
    this.joinProgramService
      ._listChallengeSubmited(this.programId)
      .subscribe((response: ResponseResult) => {
        // ////console.log(response.data, 'Data Table values');
        console.log(response, 'response');

        const interViewModelList = response.data; // Replace with your actual fetching logic

        this.sharedService._setChallengeList(interViewModelList);

        this.initilizeDataTable();
      });
  }

  initilizeDataTable(): void {
    const currentLang = this.globalService.getCurrentLanguage();
    const languageConfig =
      currentLang === 'ar'
        ? this.globalService.getArabicLanguageConfig()
        : this.globalService.getEnglishLanguageConfig();

    const datatable: any = $('#challengeSubmitedDataTable').DataTable();

    // Destroy existing DataTable instance
    datatable.destroy();

    setTimeout(() => {
      $('#challengeSubmitedDataTable').DataTable({
        pagingType: 'full_numbers',
        pageLength: 5,
        processing: true,
        data: this.listChallengeSubmitedViewModel,
        language: languageConfig,
        columns: [
          { data: 'id' },
          { data: 'empId' },
          { data: 'empName' },
          {
            data: (row: any) =>
              row.attachmentViewModel && row.attachmentViewMode != null
                ? true
                : false
                ? this.globalService.ConvertDateTimeToDateOnly(
                    row.attachmentViewModel[0].date
                  )
                : '',
          },
          {
            data: (row: any) => {
              const hasAttachment =
                row.attachmentViewModel && row.attachmentViewModel != null
                  ? true
                  : false;
              const badgeText =
                currentLang === 'en'
                  ? hasAttachment
                    ? 'Submitted'
                    : 'Not Submitted'
                  : hasAttachment
                  ? 'ناجح'
                  : 'لم يُقدّم';
              return `<span class="badge ${
                hasAttachment ? 'badge-success' : 'badge-secondary'
              }">${badgeText}</span>`;
            },
          },
          {
            // data: 'data',
            // defaultContent: `
            //       <button
            //       type="button"
            //       class="btn btn-light mr-1 "
            //     >
            //       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
            //         <path d="M8 0a.5.5 0 0 1 .5.5v7.793l2.146-2.147a.5.5 0 0 1 .708.707l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.707L7.5 8.293V.5A.5.5 0 0 1 8 0zm4.5 9a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h11z"/>
            //       </svg>
            //     </button>
            //   `,
            data: (row: any) => {
              const isAttachmentAvailable =
                row.attachmentViewModel && row.attachmentViewModel != null
                  ? true
                  : false;
              const buttonState = isAttachmentAvailable ? '' : 'disabled';
              return `
                <button
                  type="button"
                  (click)="downloadFile(row)"
                  class="btn btn-light mr-1 ${buttonState}"
                  ${buttonState === 'disabled' ? 'disabled' : ''}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                    <path d="M8 0a.5.5 0 0 1 .5.5v7.793l2.146-2.147a.5.5 0 0 1 .708.707l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.707L7.5 8.293V.5A.5.5 0 0 1 8 0zm4.5 9a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h11z"/>
                  </svg>
                </button>
              `;
            },
          },
        ],
        rowCallback: (row: Node, data: any, index: number) => {
          const btnDownloadFile = $(row).find('button');
          // const btnDownloadFile = $('button:first', row);

          // Attach click event handlers to the buttons
          btnDownloadFile.on('click', () => {
            if (
              data.attachmentViewModel &&
              data.attachmentViewModel.length > 0
            ) {
              this.downloadService.downloadBase64File(
                data.attachmentViewModel[0].base64String,
                data.attachmentViewModel[0].fileName,
                data.attachmentViewModel[0].extension
              );
            }
          });

          return row;
        },
        lengthMenu: [5, 10, 25],
      });
    }, 1);
  }

  downloadFile(row: any) {
    console.log(row);
  }
}
