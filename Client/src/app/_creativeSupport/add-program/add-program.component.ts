import { CommonModule } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FilePond, FilePondOptions } from 'filepond';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FilePondModule } from 'ngx-filepond';
import { ToastrService } from 'ngx-toastr';
import { finalize, Observable, Subscription } from 'rxjs';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { ChallengeViewModel } from 'src/app/_models/CreativeSupport/challengeViewModel';
import { InterviewViewModel } from 'src/app/_models/CreativeSupport/interviewViewModel';
import { JoinProgramChallengeViewModel } from 'src/app/_models/CreativeSupport/joinProgramChallengeViewModel';
import {
  joinProgramViewModel,
  StautsCode,
} from 'src/app/_models/CreativeSupport/joinProgramViewModel';
import {
  MQSOptionViewModel,
  ParticipationTestAnswerViewModel,
  ParticipationTestViewModel,
  QuestionViewModel,
} from 'src/app/_models/CreativeSupport/participatingTestViewModel';
import { WrokshopViewModel } from 'src/app/_models/CreativeSupport/wrokshopViewModel';
import { ResponseResult, StatusCodes } from 'src/app/_models/responseResult';
import { JoinProgramService } from 'src/app/_services/_creativeSupport/join-program.service';
import { UploadServiceService } from 'src/app/_services/upload-service.service';

@Component({
  selector: 'app-add-program',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    AccordionModule,
    TranslateModule,
    TabsModule,
    FilePondModule,
  ],
  templateUrl: './add-program.component.html',
  styleUrl: './add-program.component.css',
})
export class AddProgramComponent implements OnInit {
  @ViewChild('addProgramForm') addProgramForm: NgForm | undefined;

  @ViewChild('wrokshopTemplate') wrokshopTemplate: TemplateRef<any> | undefined;

  @ViewChild('wrokshopTemplateDetails') wrokshopTemplateDetails:
    | TemplateRef<any>
    | undefined;

  @ViewChild('interviewTemplate') interviewTemplate:
    | TemplateRef<any>
    | undefined;
  @ViewChild('interviewTemplateDetails') interviewTemplateDetails:
    | TemplateRef<any>
    | undefined;

  @ViewChild('traningCourseTemplate') traningCourseTemplate:
    | TemplateRef<any>
    | undefined;
  @ViewChild('traningCourseTemplateDetails') traningCourseTemplateDetails:
    | TemplateRef<any>
    | undefined;

  @ViewChild('challengeTemplate') challengeTemplate:
    | TemplateRef<any>
    | undefined;
  @ViewChild('challengeTemplateDetails') challengeTemplateDetails:
    | TemplateRef<any>
    | undefined;
  modalRef?: BsModalRef;
  joinProgramModel: joinProgramViewModel;
  joinProgramChallengesViewModels = [] as JoinProgramChallengeViewModel[];
  interviewsViewModels = [] as InterviewViewModel[];
  wrokshopsViewModels = [] as WrokshopViewModel[];
  challengeViewModels = [] as ChallengeViewModel[];
  challengeViewModel: ChallengeViewModel;

  wrokshopsViewModel: WrokshopViewModel;
  interviewsViewModel: InterviewViewModel;
  joinProgramChallengesViewModel: JoinProgramChallengeViewModel;
  @ViewChild('template') template: TemplateRef<any> | undefined;
  @ViewChild('templateDetails') templateDetails: TemplateRef<any> | undefined;
  oneAtATime: any = true;

  participationTestViewModel: any;

  questionViewModel: any;
  mQSOptionViewModel: any;

  participationTestViewModelList = [] as ParticipationTestViewModel[];

  questionViewModelList = [] as QuestionViewModel[];
  mQSOptionViewModelList = [] as MQSOptionViewModel[];

  headingText: string = '';
  participationTestAnswerViewModelList: ParticipationTestAnswerViewModel[] = [];
  private languageChangeSubscription!: Subscription;
  pondFiles: FilePondOptions['files'] = [];
  fb: any;
  progress: number | undefined;
  currentFile: File | undefined;
  message: any;
  selectedFiles?: FileList;
  fileInfos?: Observable<any>;
  file: File | undefined;
  agendAttachmentFile: File | undefined;
  attachment: any;
  fileUrl: string = '';
  constructor(
    public globalService: GlobalServiceService,
    private tosterService: ToastrService,
    private joinProgramService: JoinProgramService,
    private modalService: BsModalService,
    private router: Router,
    private uploadService: UploadServiceService
  ) {
    this.joinProgramModel = {
      id: 0,
      startDate: '',
      endDate: '',
      statusCode: StautsCode.IActive,
      joinProgramChallengesViewModels: this.joinProgramChallengesViewModels,
      interviewsViewModels: this.interviewsViewModels,
      wrokshopsViewModels: this.wrokshopsViewModels,
    };

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

    this.joinProgramChallengesViewModel = {
      id: 0,
      titleEn: '',
      titleAr: '',
      descriptionEn: '',
      descriptionAr: '',
      link: '',
      programId: 0,
    };

    this.interviewsViewModel = {
      id: 0,
      nameEn: '',
      nameAr: '',
      location: '',
      latitude: '',
      longitude: '',
      locatoinDescription: '',
      interviewDate: '',
      interviewTime: '',
      programId: 0,
      imageUrl: '',
      urlBase64: '',
      venue: 1,
      file: null,
    };
    this.wrokshopsViewModel = {
      id: 0,
      nameEn: '',
      nameAr: '',
      location: '',
      latitude: '',
      longitude: '',
      locationDescription: '',
      workshopDate: '',
      wrokshopTime: '',
      programId: 0,
      venue: 1,
      imageUrl: '',
      urlBase64: '',
      file: null,
    };

    this.challengeViewModel = {
      id: 0,
      titleAr: '',
      titleEn: '',
      descriptionEn: '',
      descriptionAr: '',
      link: '',
      programId: 0,
    };
  }

  pondOptions: FilePondOptions = {
    allowMultiple: false,
    labelIdle: 'Drop files here...',
    //allo: ['image/jpeg, image/png'],
    //acceptedFileTypes: ['image/jpeg, image/png'],
    allowReorder: true,
  };

  pondHandleInit() {}

  pondHandleAddFile(event: any) {
    //const file: File | null = event.file;
    this.file = event.file.file;
  }

  pondHandleActivateFile(event: any) {}
  pondHandleRemoveFile(event: any) {
    const removedFile = event.file;
    // const index = this.imagesArray.findIndex(
    //   (item: { fileName: any }) => item.fileName === removedFile.file
    // );

    // if (index !== -1) {
    //   this.imagesArray.splice(index, 1);
    // }
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

  openModal(template: TemplateRef<void> | undefined) {
    this.initForm();
    if (template)
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
      ._getParticipateTestList()
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
    this.joinProgramService.add(this.participationTestViewModel).subscribe({
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
    this.joinProgramService.update(this.participationTestViewModel).subscribe({
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
    this.joinProgramService._getDetail(id).subscribe({
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
    this.joinProgramService._getDetail(id).subscribe({
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

  addWrokshop(wrokshopTemplate: TemplateRef<void> | undefined) {
    //this.initModel();
    if (wrokshopTemplate) {
      this.modalRef = this.modalService.show(
        wrokshopTemplate,
        Object.assign({}, { class: 'modal-lg' })
      );
    }
  }

  upload(file: File): void {
    this.progress = 0;

    if (file != null) {
      this.uploadService
        .upload(file, 'joinProgram')
        .pipe(
          finalize(() => {
            this.selectedFiles = undefined;

            this.wrokshopsViewModel.imageUrl = this.fileUrl;
          })
        )
        .subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;

              // Assuming the uploaded file's URL is returned in the response
              const fileUrl = event.body.fileUrl;
              this.fileInfos = this.uploadService.getFiles();

              // Set the URL here
              this.fileUrl = fileUrl;
            }
          },
          error: (err: any) => {
            this.progress = 0;
            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
            this.currentFile = undefined;
          },
        });
    }
  }

  removeImage() {}

  saveWorkshop() {
    if (this.joinProgramModel.id == 0) {
      if (this.file != null) {
        this.wrokshopsViewModel.file = this.file;
      }
      this.wrokshopsViewModels.push(this.wrokshopsViewModel);
    } else {
      if (this.file != null) {
        this.upload(this.file);
        this.wrokshopsViewModel.imageUrl = this.fileUrl;
        this.wrokshopsViewModel.programId = this.joinProgramModel.id;
      }
      this.joinProgramService._addWrokshop(this.wrokshopsViewModel).subscribe({
        next: (response: ResponseResult) => {
          if (response.statusCode == StatusCodes.success) {
            this.tosterService.success(response.message);
          } else {
            this.tosterService.error(response.message);
          }
        },
      });
    }
  }

  updateWrokShop() {
    if (this.file != null) {
      this.upload(this.file);

      this.wrokshopsViewModel.imageUrl = this.fileUrl;
      this.joinProgramService
        ._updateWrokshop(this.wrokshopsViewModel)
        .subscribe({
          next: (respone: ResponseResult) => {
            if (respone.statusCode == StatusCodes.success)
              this.tosterService.success(respone.message);
            else this.tosterService.error(respone.message);
          },
        });
    } else {
      this.joinProgramService
        ._updateWrokshop(this.wrokshopsViewModel)
        .subscribe({
          next: (respone: ResponseResult) => {
            if (respone.statusCode == StatusCodes.success)
              this.tosterService.success(respone.message);
            else this.tosterService.error(respone.message);
          },
        });
    }
  }

  addInterview(interviewTemplate: TemplateRef<void> | undefined) {
    //this.initModel();
    if (interviewTemplate)
      this.modalRef = this.modalService.show(
        interviewTemplate,
        Object.assign({}, { class: 'modal-lg' })
      );
  }

  addChallenge(challengeTemplate: TemplateRef<void> | undefined) {
    //this.initModel();
    if (challengeTemplate)
      this.modalRef = this.modalService.show(
        challengeTemplate,
        Object.assign({}, { class: 'modal-lg' })
      );
  }

  saveInterview() {
    if (this.interviewsViewModel != null) {
      if (this.interviewsViewModel.programId == 0) {
        if (this.file != null) {
          this.interviewsViewModel.file = this.file;
        }
        this.interviewsViewModels.push(this.interviewsViewModel);
      } else {
        if (this.file != null) {
          this.upload(this.file);
          this.joinProgramService
            ._addInterView(this.interviewsViewModel)
            .subscribe({
              next: (respone: ResponseResult) => {
                if (respone.statusCode == StatusCodes.success)
                  this.tosterService.success(respone.message);
                else this.tosterService.error(respone.message);
              },
            });
        }
      }
    }
  }
  updateInterview() {
    if (this.file != null) {
      this.upload(this.file);
      this.joinProgramService
        ._updateInterView(this.interviewsViewModel)
        .subscribe({
          next: (respone: ResponseResult) => {
            if (respone.statusCode == StatusCodes.success)
              this.tosterService.success(respone.message);
            else this.tosterService.error(respone.message);
          },
        });
    } else
      this.joinProgramService
        ._updateInterView(this.interviewsViewModel)
        .subscribe({
          next: (respone: ResponseResult) => {
            if (respone.statusCode == StatusCodes.success)
              this.tosterService.success(respone.message);
            else this.tosterService.error(respone.message);
          },
        });
  }

  deleteInterView(id: number) {
    this.joinProgramService._deleteInterView(id).subscribe({
      next: (respone: ResponseResult) => {
        if (respone.statusCode == StatusCodes.success)
          this.tosterService.success(respone.message);
        else this.tosterService.error(respone.message);
      },
    });
  }

  saveChallenge() {
    if (this.challengeViewModel != null) {
      if (this.joinProgramModel.id == 0) {
        this.challengeViewModels.push(this.challengeViewModel);
      }
    } else {
      this.joinProgramService._addChallenge(this.challengeViewModel).subscribe({
        next: (respone: ResponseResult) => {
          if (respone.statusCode == StatusCodes.success)
            this.tosterService.success(respone.message);
          else this.tosterService.error(respone.message);
        },
      });
    }
  }

  updateChallenge() {
    if (this.challengeViewModel != null) {
      if (this.challengeViewModels.length > 0) {
        // Find the item by its ID
        const index = this.challengeViewModels.findIndex(
          (item) => item.id === this.challengeViewModel.id
        );
        // If the item is found, remove it from the list
        if (index !== -1) {
          this.challengeViewModels.splice(index, 1);
        }
      }
      // Push the challengeViewModel back to the list
      this.challengeViewModels.push(this.challengeViewModel);
    } else
      this.joinProgramService
        ._updateInterView(this.interviewsViewModel)
        .subscribe({
          next: (respone: ResponseResult) => {
            if (respone.statusCode == StatusCodes.success)
              this.tosterService.success(respone.message);
            else this.tosterService.error(respone.message);
          },
        });
  }

  addProgram() {
    if (this.joinProgramModel.id == 0)
      if (this.wrokshopsViewModels.length > 0) {
        //this.upload();
      }

    this.joinProgramService._addProgram(this.joinProgramModel).subscribe({
      next: (respone: ResponseResult) => {
        if (respone.statusCode == StatusCodes.success)
          this.tosterService.success(respone.message);
        else this.tosterService.error(respone.message);
      },
    });
  }

  getTabValue(value: string): string {
    switch (value) {
      case 'Program':
        return this.globalService.getCurrentLanguage() == 'en' ? 'Program' : '';
      case 'CreateTest':
        return this.globalService.getCurrentLanguage() == 'en'
          ? 'Create Test'
          : '';
      case 'Wrokshop':
        return this.globalService.getCurrentLanguage() == 'en'
          ? 'Wrokshop'
          : '';
      case 'Interview':
        return this.globalService.getCurrentLanguage() == 'en'
          ? 'Interview'
          : '';
      case 'TranningCourse':
        return this.globalService.getCurrentLanguage() == 'en'
          ? 'Tranning Course'
          : '';
      case 'Challenges':
        return this.globalService.getCurrentLanguage() == 'en'
          ? 'Challenges'
          : '';
      default:
        return '';
    }
  }
}