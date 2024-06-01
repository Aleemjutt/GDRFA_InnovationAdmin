import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TargetCompainAnswerService } from 'src/app/_services/_Ideas/target-compain-answer.service';
import { FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  TargetAnswerDetailsModel,
  TargetAnswerModel,
  TargetAttachmentModel,
  TargetCompainOptionAnswerDetailsModel,
  TargetCompainOptionAnswerModel,
} from 'src/app/_models/Ideas/ideaTargetModel';
import { data } from 'jquery';
import { ResponseResult } from 'src/app/_models/responseResult';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
@Component({
  selector: 'app-target-compain-answer-list',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './target-compain-answer-list.component.html',
  styleUrl: './target-compain-answer-list.component.css',
})
export class TargetCompainAnswerListComponent {
  @ViewChild('templateDetails') templateDetails: TemplateRef<any> | undefined;
  registerForm!: FormGroup;

  targetAnswerModel: TargetAnswerModel;
  targetCompainAnswerModelList: TargetAnswerDetailsModel[] = [];

  modalRef?: BsModalRef;
  targetCompainsAnswerDetailsModel: TargetAnswerDetailsModel;
  targetCompainsAnswerOptionModelDetails: TargetCompainOptionAnswerDetailsModel;
  targetCompainsAnswerOptionModelDetailsList: TargetCompainOptionAnswerDetailsModel[] =
    [];

  targetAnswerModelList: TargetAnswerModel[] = [];
  targetAttachmentModel: TargetAttachmentModel[] = [];
  constructor(
    private targetCopainAnswerService: TargetCompainAnswerService,
    private route: ActivatedRoute,
    private tosterService: ToastrService,
    private modalService: BsModalService,
    private globalService: GlobalServiceService
  ) {
    this.targetAnswerModel = {
      id: 0,
      challengeTitle: '',
      challengeDetails: '',
      targetCompanId: 0,
    };

    this.targetCompainsAnswerDetailsModel = {
      id: 0,
      challengeTitle: '',
      challengeDetails: '',
      targetCompanId: 0,
      targetCompainOptionAnswerModels:
        this.targetCompainsAnswerOptionModelDetailsList,
      targetAttachmentModel: this.targetAttachmentModel,
    };

    this.targetCompainsAnswerOptionModelDetails = {
      optionId: null,
      optiontextEn: null,
      optiontextAR: null,
      targetAnswerId: null,
      optionAnswer: null,
      displayValue: null,
    };

    this.targetAttachmentModel = [
      {
        url: '',
        targetAnswerId: 0,
        title: '',
        extension: '',
      },
    ];
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
    var id = this.route.snapshot.paramMap.get('id');
    console.log('catch Id', id);
    if (!id) return;
    this.targetCopainAnswerService
      ._getList(parseInt(id))

      .subscribe((response: ResponseResult) => {
        // ////console.log(response.data, 'Data Table values');
        ////console.log(response.data);
        console.log(response, 'response');
        this.targetAnswerModelList = response.data;

        // ////console.log(this.partnerList, 'List Data');

        setTimeout(() => {
          $('#targetCompainAnswerDataTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            data: this.targetAnswerModelList,
            language: languageConfig,
            columns: [
              { data: 'id' },
              {
                data: 'challengeTitle', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },
              {
                data: 'challengeDetails', //(row: any) => this.getDepartmentName(row.requestModel.sID),
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
                this.viewtargetCompainDetails(data.id, this.templateDetails);
              });

              return row;
            },

            lengthMenu: [5, 10, 25],
          });
        }, 1);
      });
  }

  viewtargetCompainDetails(
    id: number,
    templateDetails: TemplateRef<any> | undefined
  ) {
    this.targetCopainAnswerService.getTargetAnswerDetails(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (templateDetails) {
            this.targetCompainsAnswerDetailsModel = response.data;
            this.modalRef = this.modalService.show(templateDetails, {
              class: 'gray modal-lg',
            });
          } else {
            console.error('Template is undefined');
          }
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }
}
