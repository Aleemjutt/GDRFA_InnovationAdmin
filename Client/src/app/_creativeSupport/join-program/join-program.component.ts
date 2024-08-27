import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import {
  MQSOptionViewModel,
  ParticipationTestAnswerViewModel,
  ParticipationTestViewModel,
  QuestionViewModel,
} from 'src/app/_models/CreativeSupport/participatingTestViewModel';
import { ResponseResult, StatusCodes } from 'src/app/_models/responseResult';
import { JoinProgramService } from 'src/app/_services/_creativeSupport/join-program.service';

@Component({
  selector: 'app-join-program',
  standalone: true,
  imports: [FormsModule, CommonModule, AccordionModule, TranslateModule],
  templateUrl: './join-program.component.html',
  styleUrl: './join-program.component.css',
})
export class JoinProgramComponent implements OnInit {
  @ViewChild('template') template: TemplateRef<any> | undefined;
  @ViewChild('templateDetails') templateDetails: TemplateRef<any> | undefined;
  oneAtATime: any = true;
  modalRef?: BsModalRef;
  participationTestViewModel: any;
  questionViewModel: any;
  mQSOptionViewModel: any;
  participationTestViewModelList: ParticipationTestViewModel[] = [];
  questionViewModelList: QuestionViewModel[] = [];
  mQSOptionViewModelList: MQSOptionViewModel[] = [];
  headingText: string = '';
  participationTestAnswerViewModelList: ParticipationTestAnswerViewModel[] = [];
  private languageChangeSubscription!: Subscription;
  constructor(
    public globalService: GlobalServiceService,
    private tosterService: ToastrService,
    private joinProgramService: JoinProgramService,
    private modalService: BsModalService,
    private router: Router
  ) {
    this.questionViewModel = {
      id: 0,
      textAr: '',
      textEn: '',
      mqsOptionsViewModel: [],
    };
    this.mQSOptionViewModel = {
      id: 0,
      textAr: '',
      textEn: '',
      questionId: 0,
      isCorrect: false,
    };

    this.participationTestViewModel = {
      id: 0,
      questionViewModels: [],
      participationTestAnswersViewModels: [],
      status: false,
    };
  }
  ngOnInit(): void {
    this.languageChangeSubscription =
      this.globalService.languageChange$.subscribe((lang) => {
        // Update the ng-select label property when the language changes
        this.initilizeDataTable();
      });
  }

  initForm() {
    this.questionViewModel = {
      id: 0,
      textAr: '',
      textEn: '',
      mqsOptionsViewModel: [],
    };
    this.mQSOptionViewModel = {
      id: 0,
      textAr: '',
      textEn: '',
      questionId: 0,
      isCorrect: false,
    };
    this.participationTestViewModel = {
      id: 0,
      questionViewModels: [],
      participationTestAnswersViewModels: [],
      status: false,
    };
    this.languageChangeSubscription = new Subscription();

    this.mQSOptionViewModelList = [];
    this.questionViewModelList = [];
  }

  openModal(template: TemplateRef<void>) {
    this.initForm();
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg' })
    );
  }

  initilizeDataTable(): void {
    const currentLang = this.globalService.getCurrentLanguage();
    const languageConfig =
      currentLang === 'ar'
        ? this.globalService.getArabicLanguageConfig()
        : this.globalService.getEnglishLanguageConfig();
    const datatable: any = $('#awardsDataTable').DataTable();
    this.joinProgramService
      ._getParticipateTestList(0)
      .subscribe((response: ResponseResult) => {
        // ////console.log(response.data, 'Data Table values');
        console.log(response, 'response');
        this.participationTestViewModelList = response.data;
        // Datatable reloading
        datatable.destroy();

        setTimeout(() => {
          $('#awardsDataTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            data: this.participationTestViewModelList,
            language: languageConfig,
            columns: [
              { data: 'id' },

              {
                data: (row: any) =>
                  this.globalService.getStatusName(row.status),
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
              const btnView = $('button:first', row);
              const btnEdit = $('button:eq(1)', row);
              const btnDelete = $('button:eq(2)', row);
              const btnSubmitionDetails = $('button:last', row);
              // Attach click event handlers to the buttons
              btnView.on('click', () => {
                this.viewTestDetails(data.id, this.templateDetails);
              });

              btnEdit.on('click', () => {
                this.editTest(data.id, this.template);
              });

              btnDelete.on('click', () => {
                this.deleteTest(data.id);
              });

              btnSubmitionDetails.on('click', () => {
                this.router.navigateByUrl('/establisehdAnswerlist/' + data.id);
              });

              return row;
            },

            lengthMenu: [5, 10, 25],
          });
        }, 1);
      });
  }
  addTest() {
    this.participationTestViewModel.questionViewModels =
      this.questionViewModelList;
    this.joinProgramService
      ._addTest(this.participationTestViewModel)
      .subscribe({
        next: (response: ResponseResult) => {
          if (
            response.statusCode == StatusCodes.success ||
            response.statusCode == StatusCodes.update
          ) {
            this.tosterService.success(response.message);
            this.modalRef?.hide();
            this.initForm();
            this.initilizeDataTable();
          } else if (response.statusCode == StatusCodes.alreadyExists) {
            this.tosterService.info(response.message);
          } else {
            this.tosterService.error(response.message);
          }
        },
      });
  }
  updateTest() {
    this.participationTestViewModel.questionViewModels = this.questionViewModel;
    this.joinProgramService
      ._updateTest(this.participationTestViewModel)
      .subscribe({
        next: (response: ResponseResult) => {
          if (response.statusCode == StatusCodes.success) {
            this.tosterService.success(response.message);
            this.initForm();
            this.modalRef?.hide();
            this.initilizeDataTable();
          } else {
            this.tosterService.error(response.message);
          }
        },
      });
  }

  viewTestDetails(id: number, template: TemplateRef<any> | undefined) {
    if (!template) {
      return;
    }
    this.joinProgramService._getTestDetail(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success) {
          this.participationTestViewModel = response.data;
          this.questionViewModelList =
            this.participationTestViewModel.questionViewModels;

          this.modalRef = this.modalService.show(template, {
            class: 'gray modal-lg',
          });
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  editTest(id: number, template: TemplateRef<any> | undefined) {
    if (!template) {
      // Handle the case where template is undefined, perhaps by throwing an error or logging a message
      return;
    }
    this.questionViewModel = {
      id: 0,
      textEn: '',
      textAr: '',
      mQSOptionViewModel: [],
    };
    this.joinProgramService._getTestDetail(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success) {
          this.participationTestViewModel = response.data;
          this.questionViewModelList =
            this.participationTestViewModel.questionViewModels;

          this.modalRef = this.modalService.show(template, {
            class: 'gray modal-lg',
          });
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  deleteTest(id: any) {}

  addTestDetail(): void {
    if (
      this.questionViewModel?.textAr?.trim() !== '' ||
      (this.questionViewModel?.textEn?.trim() !== '' &&
        this.questionViewModel != null)
    ) {
      if (this.questionViewModelList != null)
        this.questionViewModelList?.push(this.questionViewModel);

      this.mQSOptionViewModelList = [];
      this.questionViewModel = {
        id: 0,
        textEn: '',
        textAr: '',
        mQSOptionViewModel: [],
      };
    }
  }

  removeQuestion(index: number): void {
    this?.questionViewModelList.splice(index, 1);
  }

  addQuestion(): void {
    if (
      this.questionViewModel?.textEn?.trim() !== '' ||
      (this.questionViewModel?.textAr?.trim() !== '' &&
        this.questionViewModelList != null)
    ) {
      if (this.questionViewModelList != null)
        this.questionViewModel.mqsOptionsViewModel =
          this.mQSOptionViewModelList;

      this.headingText = this.questionViewModel.textEn;

      this.questionViewModelList?.push(this.questionViewModel);
      this.mQSOptionViewModelList = [];
      this.questionViewModel = {
        textAr: '',
        textEn: '',
        id: 0,
      };
    }
  }

  addOption(): void {
    if (
      this.mQSOptionViewModel?.textEn?.trim() !== '' ||
      (this.mQSOptionViewModel?.textAr?.trim() !== '' &&
        this.mQSOptionViewModelList != null)
    ) {
      if (this.mQSOptionViewModelList != null)
        this.mQSOptionViewModelList?.push(this.mQSOptionViewModel);

      this.mQSOptionViewModel = {
        textAr: '',
        textEn: '',
        questionId: 0,
        id: 0,
        isCorrect: false,
      };
    }
  }

  editQuestion(index: number) {
    // Check if the array is valid and index is within bounds
    if (
      this.questionViewModelList &&
      index >= 0 &&
      index < this.questionViewModelList.length
    ) {
      // Access the item at the specified index
      this.questionViewModel = this.questionViewModelList[index];
      this.mQSOptionViewModelList = this.questionViewModel.mqsOptionsViewModel;
      this.questionViewModelList?.splice(index, 1);
    }
  }

  deleteQuestion(index: number) {
    this.questionViewModelList?.splice(index, 1);
  }
  deleteOption(index: number) {
    this.mQSOptionViewModelList?.splice(index, 1);
  }
}
