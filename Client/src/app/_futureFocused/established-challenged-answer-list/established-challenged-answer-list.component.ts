import { CommonModule } from '@angular/common';
import { NotExpr } from '@angular/compiler';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { WorkFlowStatus } from 'src/app/_models/Common/workflowStatus';
import { EstablishedAsnswerdModel } from 'src/app/_models/FutureFocused/establishedAsnswerdModel';
import { ResponseResult, StatusCodes } from 'src/app/_models/responseResult';
import { EstablishedChallengedAnswerService } from 'src/app/_services/_futureFocused/established-challenged-answer.service';

@Component({
  selector: 'app-established-challenged-answer-list',
  standalone: true,
  imports: [CommonModule, AccordionModule, TranslateModule],
  templateUrl: './established-challenged-answer-list.component.html',
  styleUrl: './established-challenged-answer-list.component.css',
})
export class EstablishedChallengedAnswerListComponent implements OnInit {
  establishedAsnswerdModels: EstablishedAsnswerdModel[] = [];
  @ViewChild('templateDetails') templateDetails: TemplateRef<any> | undefined;
  modalRef: any;
  oneAtATime: any = true;
  establishingDubaiForTheFutureModel: any;
  establishingDubaiForTheFutureDetailModel: any;
  requirmentsHeadingPointModel: any;
  requirmentsPointsModel: any;

  establishedAsnswerdModel: any;

  enum: typeof WorkFlowStatus = WorkFlowStatus;

  constructor(
    private route: ActivatedRoute,
    private establisehdChallengedService: EstablishedChallengedAnswerService,
    private modalService: BsModalService,
    private tosterService: ToastrService,
    public globalService: GlobalServiceService
  ) {
    this.establishingDubaiForTheFutureModel = {
      id: 0,
      descriptionEn: '',
      descriptionAr: '',
      establishingDubaiForTheFutureDetailModels: [],
    };
    this.establishingDubaiForTheFutureDetailModel = {
      id: 0,
      descriptionEn: '',
      descriptionAr: '',
      establishingDubaiForTheFutureId: 0,
      requirmentsHeadingPointModels: [],
      requirmentsPointsModels: [],
    };
    this.requirmentsHeadingPointModel = {
      id: 0,
      textEn: '',
      textAr: '',
      establishingDubaiForTheFutureDetailId: 0,
    };
    this.requirmentsPointsModel = {
      id: 0,
      textEn: '',
      textAr: '',
      establishingDubaiForTheFutureDetailId: 0,
    };
  }
  ngOnInit(): void {
    this.initilizeDataTable();
  }
  initilizeDataTable(): void {
    const currentLang = this.globalService.getCurrentLanguage();
    const languageConfig =
      currentLang === 'ar'
        ? this.globalService.getArabicLanguageConfig()
        : this.globalService.getEnglishLanguageConfig();
    let id = this.route.snapshot.paramMap.get('id');

    console.log('catch Id', id);
    if (!id) return;
    this.establisehdChallengedService
      .getEstablishedAnsweredList(parseInt(id))
      .subscribe((response: ResponseResult) => {
        // ////console.log(response.data, 'Data Table values');
        ////console.log(response.data);
        console.log(response, 'response');
        this.establishedAsnswerdModels = response.data;

        // ////console.log(this.partnerList, 'List Data');

        setTimeout(() => {
          $('#establishedAnswerDataTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            data: this.establishedAsnswerdModels,
            language: languageConfig,
            columns: [
              { data: 'id' },
              {
                data: (row: any) =>
                  this.globalService.getWorkFlowStatusName(row.workFlowStatus),
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
            `,
              },
            ],
            rowCallback: (row: Node, data: any, index: number) => {
              const viewtargetCompainDetails = $('button:first', row);
              // const edittargetCompain = $('button:eq(1)', row);
              // const deletetargetCompain = $('button:eq(2)', row);
              // const showtargetCompainAnswer = $('button:last', row);
              // Attach click event handlers to the buttons
              viewtargetCompainDetails.on('click', () => {
                this.viewDetails(data.id, this.templateDetails);
              });

              return row;
            },

            lengthMenu: [5, 10, 25],
          });
        }, 1);
      });
  }

  viewDetails(id: number, template: TemplateRef<any> | undefined) {
    if (!template) {
      return;
    }

    this.establisehdChallengedService
      .getEstablishedAnsweredDetails(id)
      .subscribe({
        next: (response: ResponseResult) => {
          if (response.statusCode == StatusCodes.success) {
            this.establishedAsnswerdModel = response.data;
          } else {
            this.tosterService.error(response.message);
          }
        },
      });

    this.modalRef = this.modalService.show(template, {
      class: 'gray modal-lg',
    });
  }

  workFlowAction(workflowStatus: WorkFlowStatus, id: number) {
    this.establisehdChallengedService
      .updateWorkflowStatus(workflowStatus, id)
      .subscribe({
        next: (response: ResponseResult) => {
          if (response.statusCode == StatusCodes.success) {
            this.tosterService.success(response.message);
            this.modalRef?.hide();
            this.initilizeDataTable();
          } else {
            this.tosterService.error(response.message);
          }
        },
      });
  }
}
