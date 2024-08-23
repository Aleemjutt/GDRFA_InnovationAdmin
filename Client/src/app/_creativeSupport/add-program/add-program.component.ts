import { CommonModule } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FilePondOptions } from 'filepond';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FilePondModule } from 'ngx-filepond';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, finalize, Observable, Subscription } from 'rxjs';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
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
import { WorkshopViewModel } from 'src/app/_models/CreativeSupport/workshopViewModel';
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
  joinProgramChallengeViewModels = [] as JoinProgramChallengeViewModel[];

  interviewViewModels = [] as InterviewViewModel[];
  workshopViewModels = [] as WorkshopViewModel[];

  _workshopViewModelsUpload = [] as WorkshopViewModel[];
  _interviewViewModelsUpload = [] as InterviewViewModel[];
  _challengesViewModelsUpload = [] as JoinProgramChallengeViewModel[];

  joinProgramChallengeViewModel: JoinProgramChallengeViewModel;

  workshopViewModel: WorkshopViewModel;
  interviewViewModel: InterviewViewModel;

  @ViewChild('template') template: TemplateRef<any> | undefined;
  @ViewChild('templateDetails') templateDetails: TemplateRef<any> | undefined;
  oneAtATime: any = true;
  @ViewChild('myPond') myPond: any;
  pond: any;
  participationTestViewModel: ParticipationTestViewModel;

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
  isView: boolean = true;

  _id: number = 0;
  constructor(
    public globalService: GlobalServiceService,
    private tosterService: ToastrService,
    private joinProgramService: JoinProgramService,
    private modalService: BsModalService,
    private router: Router,
    private uploadService: UploadServiceService,
    private route: ActivatedRoute
  ) {
    this.joinProgramModel = {
      id: 0,
      startDate: '',
      endDate: '',
      statusCode: StautsCode.IActive,
      joinProgramChallengeViewModels: this.joinProgramChallengeViewModels,
      interviewViewModels: this.interviewViewModels,
      workshopViewModels: this.workshopViewModels,
      participationTestViewModels: this.participationTestViewModelList,
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
      programId: 0,
    };

    this.joinProgramChallengeViewModel = {
      id: -1,
      titleEn: '',
      titleAr: '',
      descriptionEn: '',
      descriptionAr: '',
      link: '',
      programId: 0,
    };

    this.interviewViewModel = {
      id: -1,
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
    this.workshopViewModel = {
      id: -1,
      nameEn: '',
      nameAr: '',
      location: '',
      latitude: '',
      longitude: '',
      locationDescription: '',
      workshopDate: '',
      workshopTime: '',
      programId: 0,
      venue: 1,
      imageUrl: '',
      urlBase64: '',
      file: null,
    };
  }

  pondOptions: FilePondOptions = {
    allowMultiple: false,
    labelIdle: 'Drop files here...',
    //allo: ['image/jpeg, image/png'],
    //acceptedFileTypes: ['image/jpeg, image/png'],
    allowReorder: true,
  };

  initWrokshopModel() {
    this.workshopViewModel = {
      id: -1,
      nameEn: '',
      nameAr: '',
      location: '',
      latitude: '',
      longitude: '',
      locationDescription: '',
      workshopDate: '',
      workshopTime: '',
      programId: 0,
      venue: 1,
      imageUrl: '',
      urlBase64: '',
      file: null,
    };
    this._id = 0;
  }

  initInterviewModel() {
    this.interviewViewModel = {
      id: -1,
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
  }

  initChallengedViewModel() {
    this.joinProgramChallengeViewModel = {
      id: -1,
      titleAr: '',
      titleEn: '',
      descriptionEn: '',
      descriptionAr: '',
      link: '',
      programId: 0,
    };
    this._id = 0;
  }

  initJoinJoinProgramChallengeViewModel() {
    this.joinProgramChallengeViewModel = {
      id: -1,
      titleAr: '',
      titleEn: '',
      descriptionEn: '',
      descriptionAr: '',
      link: '',
      programId: 0,
    };
  }
  pondHandleInit() {}

  pondHandleAddFile(event: { file: { file: File } }) {
    this.file = event.file.file;

    if (this.file) {
      this.fileUrl = this.file.name;
    } else {
      this.fileUrl = ''; // or handle the null case appropriately
    }
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
        //this.initilizeDataTable();
      });

    this.route.snapshot.paramMap.get('id');
    this.route.snapshot.paramMap.get('type');

    this.route.paramMap.subscribe((params) => {
      let id = params.get('id');
      let type = params.get('type');
      // Use the id and type parameters as needed

      console.log('id', id);
      console.log('type', type);

      if (id != null && type != null) {
        this.editProgram(parseInt(id, 10));

        this.isView = type === '1' ? true : false;
      }
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
      id: -1,
      questionViewModels: [],
      participationTestAnswersViewModels: [],
      status: false,
      programId: 0,
    };
    this.languageChangeSubscription = new Subscription();

    this.mQSOptionViewModelList = [];
    this.questionViewModelList = [];
    this.initWrokshopModel();
    this.initInterviewModel();
    this.initJoinJoinProgramChallengeViewModel();
    this.initChallengedViewModel();

    this._id = 0;
  }
  ngAfterViewInit() {
    // Ensure the FilePond instance is correctly assigned after the view is initialized
    this.pond = this.myPond.filePond;
  }
  openModal(template: TemplateRef<void> | undefined) {
    this.initForm();
    if (template)
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: 'modal-lg' })
      );
  }

  editProgram(id: number) {
    this.joinProgramService._getProgramDetail(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success) {
          this.joinProgramModel = response.data;

          this.joinProgramModel.startDate = this.globalService.ISODateFromate(
            this.joinProgramModel.startDate
          );
          this.joinProgramModel.endDate = this.globalService.ISODateFromate(
            this.joinProgramModel.endDate
          );

          if (this.joinProgramModel.participationTestViewModels != null) {
            this.participationTestViewModelList =
              this.joinProgramModel.participationTestViewModels;

            if (this.participationTestViewModel.questionViewModels != null) {
              this.questionViewModelList =
                this.participationTestViewModel.questionViewModels;
            }
          }
          if (this.joinProgramModel.interviewViewModels != null) {
            this.interviewViewModels =
              this.joinProgramModel.interviewViewModels;
          }
          if (this.joinProgramModel.workshopViewModels != null) {
            this.workshopViewModels = this.joinProgramModel.workshopViewModels;
          }
          if (this.joinProgramModel.joinProgramChallengeViewModels != null) {
            this.joinProgramChallengeViewModels =
              this.joinProgramModel.joinProgramChallengeViewModels;
          }
        }
      },
    });
  }
  checekIsActiveTest() {
    if (this.participationTestViewModel.status) {
      var isExist = this.participationTestViewModelList.find(
        (a) => a.status == true
      );

      if (isExist == null) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  addTest() {
    if (!this.checekIsActiveTest()) {
      if (this.joinProgramModel.id == 0) {
        this.participationTestViewModel.questionViewModels =
          this.questionViewModelList;
        const index = this.participationTestViewModelList.findIndex(
          (item) => item.id === this.participationTestViewModel.id
        );
        if (index !== -1 && this.participationTestViewModel.id !== -1) {
          // Remove the existing item at the specific index and insert the updated item at the same index
          this.participationTestViewModelList.splice(
            index,
            1,
            this.participationTestViewModel
          );
        } else {
          // If the item is not found, simply push the new item
          this.participationTestViewModelList.push(
            this.participationTestViewModel
          );
        }

        this.initForm();
        this.modalRef?.hide();
      } else {
        //this.participationTestViewModel.id = this._id;
        this.participationTestViewModel.programId = this.joinProgramModel.id;
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
                this.listTest();
                this.initForm();
              } else if (response.statusCode == StatusCodes.alreadyExists) {
                this.tosterService.info(response.message);
              } else {
                this.tosterService.error(response.message);
              }
            },
          });
      }
    } else {
      let message =
        this.globalService.getCurrentLanguage() == 'en'
          ? 'Only one test can be active at a time!'
          : 'لا يمكن أن يكون هناك سوى اختبار واحد نشط في كل مرة!';
      this.tosterService.error(message);
    }
  }
  updateTest() {
    if (this.joinProgramModel.id == 0) {
      this.participationTestViewModel.questionViewModels =
        this.questionViewModelList;
      const index = this.participationTestViewModelList.findIndex(
        (item) => item.id === this.participationTestViewModel.id
      );
      if (index !== -1 && this.participationTestViewModel.id !== -1) {
        // Remove the existing item at the specific index and insert the updated item at the same index
        this.participationTestViewModelList.splice(
          index,
          1,
          this.participationTestViewModel
        );
      }
    } else {
      this.participationTestViewModel.id = this._id;
      this.participationTestViewModel.questionViewModels =
        this.questionViewModel;
      this.joinProgramService
        ._updateTest(this.participationTestViewModel)
        .subscribe({
          next: (response: ResponseResult) => {
            if (response.statusCode == StatusCodes.update) {
              this.tosterService.success(response.message);
              this.listTest();
              this.initForm();
              this.modalRef?.hide();
            } else {
              this.tosterService.error(response.message);
            }
          },
        });
    }
  }

  viewTestDetail(id: number, template: TemplateRef<any> | undefined) {
    if (!template) {
      return;
    }

    if (this.joinProgramModel.id == 0) {
      this.participationTestViewModel = this.participationTestViewModelList[id];
      this.participationTestViewModel.id = id;

      if (this.participationTestViewModel.questionViewModels != null) {
        this.questionViewModelList =
          this.participationTestViewModel.questionViewModels;
      }
    } else {
      this.participationTestViewModel = this.participationTestViewModelList[id];
      if (this.workshopViewModel != null) {
        this.joinProgramService
          ._getTestDetail(this.participationTestViewModel.id)
          .subscribe({
            next: (response: ResponseResult) => {
              if (response.statusCode == StatusCodes.success) {
                this.participationTestViewModel = response.data;
                if (
                  this.participationTestViewModel.questionViewModels != null
                ) {
                  this.questionViewModelList =
                    this.participationTestViewModel.questionViewModels;
                }
              } else {
                this.tosterService.error(response.message);
              }
            },
          });
      }
    }

    if (this.participationTestViewModel != null) {
      this.modalRef = this.modalService.show(template, {
        class: 'gray modal-lg',
      });
    }
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

    if (this.joinProgramModel.id == 0) {
      this.participationTestViewModel = this.participationTestViewModelList[id];
      this._id = id;
      this.participationTestViewModel.id = id;

      if (this.participationTestViewModel.questionViewModels != null) {
        this.questionViewModelList =
          this.participationTestViewModel.questionViewModels;
      }
    } else {
      this.participationTestViewModel = this.participationTestViewModelList[id];
      this._id = this.participationTestViewModel.id;
      this.joinProgramService._getTestDetail(this._id).subscribe({
        next: (response: ResponseResult) => {
          if (response.statusCode == StatusCodes.success) {
            this.participationTestViewModel = response.data;
            if (this.participationTestViewModel.questionViewModels != null) {
              this.questionViewModelList =
                this.participationTestViewModel.questionViewModels;
            }
          } else {
            this.tosterService.error(response.message);
          }
        },
      });
    }

    if (this.participationTestViewModel != null) {
      this.modalRef = this.modalService.show(template, {
        class: 'gray modal-lg',
      });
    }
  }

  deleteTest(id: any) {
    if (this.joinProgramModel.id == 0) {
      this.participationTestViewModelList.splice(id, 1);
    } else {
      let _id = this.participationTestViewModelList[id].id;
      this.joinProgramService._deleteTest(_id).subscribe({
        next: (respone: ResponseResult) => {
          if (respone.statusCode == StatusCodes.deleted) {
            this.tosterService.success(respone.message);
            this.listTest();
          } else {
            this.tosterService.error(respone.message);
          }
        },
      });
    }
  }

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

  listTest() {
    this.joinProgramService._getParticipateTestList().subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success) {
          this.participationTestViewModelList = response.data;
        }
      },
    });
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
  // Wrokshop **********/// Start ////************ */
  addWrokshop(wrokshopTemplate: TemplateRef<void> | undefined) {
    //this.initModel();
    this.initWrokshopModel();
    if (wrokshopTemplate) {
      this.modalRef = this.modalService.show(
        wrokshopTemplate,
        Object.assign({}, { class: 'modal-lg' })
      );
    }
  }

  saveWorkshop() {
    if (this.joinProgramModel.id == 0) {
      if (this.file != null) {
        this.workshopViewModel.file = this.file;
        this.workshopViewModel.imageUrl = this.file.name;
      }
      const index = this.workshopViewModels.findIndex(
        (item) => item.id === this.workshopViewModel.id
      );
      if (index !== -1 && this.workshopViewModel.id !== -1) {
        this.workshopViewModels.splice(index, 1, this.workshopViewModel);
      } else {
        this._workshopViewModelsUpload.push(this.workshopViewModel);
      }
      this.initWrokshopModel();
      this.file as File;
      this.modalRef?.hide();
    } else {
      if (this.file != null) {
        // First, upload the file and then proceed to add the workshop
        this.upload(this.file).subscribe({
          next: (event: any) => {
            if (event instanceof HttpResponse && event.status === 200) {
              if (event.body.data && event.body.data.length > 0) {
                this.workshopViewModel.imageUrl = event.body.data[0].url;
                this.workshopViewModel.programId = this.joinProgramModel.id;
                this.addWorkshop(); // Call the function that adds the workshop after upload completes
              }
            }
          },
          error: (error) => {
            this.tosterService.error('File upload failed. Please try again.');
          },
        });
      } else {
        // If there's no file to upload, directly add the workshop
        this.workshopViewModel.programId = this.joinProgramModel.id;
        this.addWorkshop();
      }
    }
  }

  addWorkshop() {
    if (this.workshopViewModel.id == -1) {
      this.workshopViewModel.id = 0;
    }

    this.joinProgramService._addWorkshop(this.workshopViewModel).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success) {
          this.tosterService.success(response.message);
          this.modalRef?.hide();
          this.listWorkshop();
          const index = this.workshopViewModels.findIndex(
            (item) => item.id === this.workshopViewModel.id
          );
          if (index !== -1 && this.workshopViewModel.id !== -1) {
            this.workshopViewModels.splice(index, 1, this.workshopViewModel);
          } else {
            this._workshopViewModelsUpload.push(this.workshopViewModel);
          }
        } else {
          this.tosterService.error(response.message);
        }
      },
      error: (error) => {
        this.tosterService.error('Failed to add workshop. Please try again.');
      },
    });
  }

  editWorkshop(id: number, template: TemplateRef<any> | undefined) {
    if (!template) {
      // Handle the case where template is undefined, perhaps by throwing an error or logging a message
      return;
    }
    this.initWrokshopModel();
    this.workshopViewModel = this.workshopViewModels[id];
    if (this.joinProgramModel.id != 0) {
      this._id = this.workshopViewModel.id;
    }
    if (this.workshopViewModel.workshopDate) {
      this.workshopViewModel.workshopDate = this.globalService.ISODateFromate(
        this.workshopViewModel.workshopDate
      );
    }
    this.workshopViewModel.id = id;
    if (this.workshopViewModel != null && this.workshopViewModel != undefined) {
      if (template) {
        this.modalRef = this.modalService.show(
          template,
          Object.assign({}, { class: 'modal-lg' })
        );
      }
    }
  }

  viewWrokshopDetails(id: number, template: TemplateRef<any> | undefined) {
    if (!template) {
      // Handle the case where template is undefined, perhaps by throwing an error or logging a message
      return;
    }
    this.initWrokshopModel();
    this.workshopViewModel = this.workshopViewModels[id];
    // this.wrokshopsViewModels?.splice(id, 1);

    if (template) {
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: 'modal-lg' })
      );
    }
  }

  deleteWrokshop(id: number) {
    if (this.joinProgramModel.id == 0) {
      this.workshopViewModels.splice(id, 1);
    } else {
      let _id = this.workshopViewModels[id].id;
      this.joinProgramService._deleteWorkshop(_id).subscribe({
        next: (respone: ResponseResult) => {
          if (respone.statusCode == StatusCodes.success) {
            this.tosterService.success(respone.message);
            this.listWorkshop();
          } else {
            this.tosterService.error(respone.message);
          }
        },
      });
    }
  }

  removeImageWrokshop() {
    this.workshopViewModel.imageUrl = '';
    this.workshopViewModel.file = null;
    this.workshopViewModel.urlBase64 = '';
  }

  updateWrokShop() {
    if (this.joinProgramModel.id == 0) {
      if (this.file != null) {
        this.workshopViewModel.file = this.file;
        this.workshopViewModel.imageUrl = this.file.name;
      }
      const index = this.workshopViewModels.findIndex(
        (item) => item.id === this.workshopViewModel.id
      );

      // const existingInterview = this.interviewViewModels.find(
      //   (item) => item.id === this.interviewViewModel.id
      // );

      if (index !== -1 && this.workshopViewModel.id !== -1) {
        // Remove the existing item at the specific index and insert the updated item at the same index
        this.workshopViewModel.id = this._id;

        this.workshopViewModels.splice(index, 1, this.workshopViewModel);
      } else {
        // If the item is not found, simply push the new item
        this.workshopViewModels.push(this.workshopViewModel);
      }

      this.initWrokshopModel();
      this.file as File;
      this.modalRef?.hide();
    } else {
      if (this.file != null) {
        this.upload(this.file).subscribe({
          next: (event: any) => {
            if (event instanceof HttpResponse && event.status === 200) {
              if (event.body.data && event.body.data.length > 0) {
                this.workshopViewModel.imageUrl = event.body.data[0].url;
                this.workshopViewModel.programId = this.joinProgramModel.id;
                this.workshopViewModel.id = 0;
                this.updateWorkshop(); // Call the function that adds the workshop after upload completes
              }
            }
          },
          error: (error) => {
            this.tosterService.error('File upload failed. Please try again.');
          },
        });
        // this.upload(this.file);
        // this.workshopViewModel.imageUrl = this.fileUrl;
        //this.updateWorkshop();
      } else {
        this.updateWorkshop();
      }
    }
  }

  updateWorkshop() {
    this.workshopViewModel.id = this._id;
    this.joinProgramService._updateWorkshop(this.workshopViewModel).subscribe({
      next: (respone: ResponseResult) => {
        if (respone.statusCode == StatusCodes.success) {
          this.tosterService.success(respone.message);
          this.modalRef?.hide();
          this.listWorkshop();
          this.initWrokshopModel();
        } else {
          this.tosterService.error(respone.message);
        }
      },
    });
  }

  listWorkshop() {
    this.joinProgramService._listWorkshop().subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success) {
          this.workshopViewModels = response.data;
        }
      },
    });
  }

  // Wrokshop **********/// End ////************ */

  // InterView **********/// Start ////************ */

  addInterview(interviewTemplate: TemplateRef<void> | undefined) {
    //this.initModel();
    this.initInterviewModel();
    if (interviewTemplate) {
      this.modalRef = this.modalService.show(
        interviewTemplate,
        Object.assign({}, { class: 'modal-lg' })
      );
    }
  }

  saveInterview() {
    if (this.joinProgramModel.id == 0) {
      if (this.file != null) {
        this.interviewViewModel.file = this.file;
        this.interviewViewModel.imageUrl = this.file.name;
      }
      const index = this.interviewViewModels.findIndex(
        (item) => item.id === this.interviewViewModel.id
      );
      if (index !== -1 && this.interviewViewModel.id !== -1) {
        this.interviewViewModels.splice(index, 1, this.interviewViewModel);
      } else {
        this._interviewViewModelsUpload.push(this.interviewViewModel);
      }
      this.initInterviewModel();
      this.file as File;
      this.modalRef?.hide();
    } else {
      this.interviewViewModel.programId = this.joinProgramModel.id;
      this.interviewViewModel.id = 0;
      if (this.file != null) {
        // First, upload the file and then proceed to add the workshop
        this.upload(this.file).subscribe({
          next: (event: any) => {
            if (event instanceof HttpResponse && event.status === 200) {
              if (event.body.data && event.body.data.length > 0) {
                this.interviewViewModel.imageUrl = event.body.data[0].url;

                this._addInterview(); // Call the function that adds the workshop after upload completes
              }
            }
          },
          error: (error) => {
            this.tosterService.error('File upload failed. Please try again.');
          },
        });
      } else {
        // If there's no file to upload, directly add the workshop

        this._addInterview();
      }
    }
  }

  _addInterview() {
    if (this.interviewViewModel.id >= -1) {
      this.interviewViewModel.id = 0;
    }

    this.joinProgramService._addInterView(this.interviewViewModel).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success) {
          this.tosterService.success(response.message);
          this.modalRef?.hide();
          this.listInterview();
          const index = this.interviewViewModels.findIndex(
            (item) => item.id === this.interviewViewModel.id
          );
          if (index !== -1 && this.interviewViewModel.id !== -1) {
            this.interviewViewModels.splice(index, 1, this.interviewViewModel);
          } else {
            this._interviewViewModelsUpload.push(this.interviewViewModel);
          }
        } else {
          this.tosterService.error(response.message);
        }
      },
      error: (error) => {
        this.tosterService.error('Failed to add Interview. Please try again.');
      },
    });
  }

  editInterview(id: number, template: TemplateRef<any> | undefined) {
    if (!template) {
      // Handle the case where template is undefined, perhaps by throwing an error or logging a message
      return;
    }
    this.initInterviewModel();
    this.interviewViewModel = this.interviewViewModels[id];
    if (this.joinProgramModel.id == 1) {
      this._id = this.interviewViewModel.id;
    }

    this.interviewViewModel.interviewDate = this.globalService.ISODateFromate(
      this.interviewViewModel.interviewDate
    );

    this.interviewViewModel.id = id;
    if (
      this.interviewViewModel != null &&
      this.interviewViewModel != undefined
    ) {
      if (template) {
        this.modalRef = this.modalService.show(
          template,
          Object.assign({}, { class: 'modal-lg' })
        );
      }
    }
  }

  viewInterviewDetails(id: number, template: TemplateRef<any> | undefined) {
    if (!template) {
      // Handle the case where template is undefined, perhaps by throwing an error or logging a message
      return;
    }
    this.initInterviewModel();
    this.interviewViewModel = this.interviewViewModels[id];
    // this.wrokshopsViewModels?.splice(id, 1);

    if (template) {
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: 'modal-lg' })
      );
    }
  }

  deleteInterview(id: number) {
    if (this.joinProgramModel.id == 0) {
      this.interviewViewModels.splice(id, 1);
    } else {
      let _id = this.interviewViewModels[id].id;
      this.joinProgramService._deleteInterView(_id).subscribe({
        next: (respone: ResponseResult) => {
          if (respone.statusCode == StatusCodes.success) {
            this.tosterService.success(respone.message);
            this.listInterview();
          } else {
            this.tosterService.error(respone.message);
          }
        },
      });
    }
  }

  removeImageInterview() {
    this.interviewViewModel.imageUrl = '';
    this.interviewViewModel.file = null;
    this.interviewViewModel.urlBase64 = '';
  }

  updateInterview() {
    if (this.joinProgramModel.id == 0) {
      if (this.file != null) {
        this.interviewViewModel.file = this.file;
        this.interviewViewModel.imageUrl = this.file.name;
      }
      const index = this.interviewViewModels.findIndex(
        (item) => item.id === this.interviewViewModel.id
      );

      // const existingInterview = this.interviewViewModels.find(
      //   (item) => item.id === this.interviewViewModel.id
      // );

      if (index !== -1 && this.interviewViewModel.id !== -1) {
        // Remove the existing item at the specific index and insert the updated item at the same index
        this.interviewViewModel.id = this._id;

        this.interviewViewModels.splice(index, 1, this.interviewViewModel);
      } else {
        // If the item is not found, simply push the new item
        this.interviewViewModels.push(this.interviewViewModel);
      }

      this.initInterviewModel();
      this.file as File;
      this.modalRef?.hide();
    } else {
      if (this.file != null) {
        this.upload(this.file).subscribe({
          next: (event: any) => {
            if (event instanceof HttpResponse && event.status === 200) {
              if (event.body.data && event.body.data.length > 0) {
                this.interviewViewModel.imageUrl = event.body.data[0].url;
                this.interviewViewModel.programId = this.joinProgramModel.id;
                this.interviewViewModel.id = 0;
                this._updateInterview(); // Call the function that adds the workshop after upload completes
              }
            }
          },
          error: (error) => {
            this.tosterService.error('File upload failed. Please try again.');
          },
        });
        // this.upload(this.file);
        // this.workshopViewModel.imageUrl = this.fileUrl;
        //this.updateWorkshop();
      } else {
        this._updateInterview();
      }
    }
  }

  _updateInterview() {
    this.interviewViewModel.id = this._id;
    this.joinProgramService
      ._updateInterView(this.interviewViewModel)
      .subscribe({
        next: (respone: ResponseResult) => {
          if (respone.statusCode == StatusCodes.update) {
            this.tosterService.success(respone.message);
            this.modalRef?.hide();

            this.initInterviewModel();
            this.listInterview();
          } else {
            this.tosterService.error(respone.message);
          }
        },
      });
  }

  listInterview() {
    this.joinProgramService._listInterview().subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success) {
          this.interviewViewModels = response.data;
        }
      },
    });
  }

  // InterView **********/// End ////************ */

  // Challenge *******//// Start **************////

  addChallenge(challengeTemplate: TemplateRef<void> | undefined) {
    //this.initModel();
    this.initJoinJoinProgramChallengeViewModel();
    if (challengeTemplate) {
      this.modalRef = this.modalService.show(
        challengeTemplate,
        Object.assign({}, { class: 'modal-lg' })
      );
    }
  }

  saveChallenge() {
    if (this.joinProgramModel.id == 0) {
      const index = this.joinProgramChallengeViewModels.findIndex(
        (item) => item.id === this.joinProgramChallengeViewModel.id
      );

      if (index !== -1 && this.joinProgramChallengeViewModel.id !== -1) {
        // Remove the existing item at the specific index and insert the updated item at the same index
        this.joinProgramChallengeViewModels.splice(
          index,
          1,
          this.joinProgramChallengeViewModel
        );
      } else {
        // If the item is not found, simply push the new item
        this.joinProgramChallengeViewModels.push(
          this.joinProgramChallengeViewModel
        );
      }

      this.initChallengedViewModel();

      this.modalRef?.hide();
    } else {
      if (this.joinProgramChallengeViewModel.id == -1) {
        this.joinProgramChallengeViewModel.id = 0;
      }
      this.joinProgramChallengeViewModel.programId = this.joinProgramModel.id;
      this.joinProgramService
        ._addChallenge(this.joinProgramChallengeViewModel)
        .subscribe({
          next: (response: ResponseResult) => {
            if (response.statusCode == StatusCodes.success) {
              this.tosterService.success(response.message);
              this.listChalllenge();
              this.modalRef?.hide();
            } else {
              this.tosterService.error(response.message);
            }
          },
        });
    }
  }

  editChallenge(id: number, template: TemplateRef<any> | undefined) {
    if (!template) {
      // Handle the case where template is undefined, perhaps by throwing an error or logging a message
      return;
    }

    this.initChallengedViewModel();
    this.joinProgramChallengeViewModel =
      this.joinProgramChallengeViewModels[id];

    this._id = this.joinProgramChallengeViewModel.id;
    this.joinProgramChallengeViewModel.id = id;

    if (template) {
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: 'modal-lg' })
      );
    }
  }

  viewChallengeDetail(id: number, template: TemplateRef<any> | undefined) {
    if (!template) {
      // Handle the case where template is undefined, perhaps by throwing an error or logging a message
      return;
    }
    this.initChallengedViewModel();
    this.joinProgramChallengeViewModel =
      this.joinProgramChallengeViewModels[id];
    // this.wrokshopsViewModels?.splice(id, 1);

    if (template) {
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: 'modal-lg' })
      );
    }
  }

  deleteChallenge(id: number) {
    if (this.joinProgramModel.id == 0) {
      this.joinProgramChallengeViewModels.splice(id, 1);
    } else {
      let _id = this.joinProgramChallengeViewModels[id].id;
      const index = this.joinProgramChallengeViewModels.findIndex(
        (item) => item.id === this.joinProgramChallengeViewModel.id
      );

      this.joinProgramService._deleteChallenge(_id).subscribe({
        next: (respone: ResponseResult) => {
          if (respone.statusCode == StatusCodes.deleted) {
            this.tosterService.success(respone.message);

            this.listChalllenge();
          } else {
            this.tosterService.error(respone.message);
          }
        },
      });
    }
  }

  updateChallenge() {
    if (this.joinProgramModel.id == 0) {
      const index = this.joinProgramChallengeViewModels.findIndex(
        (item) => item.id === this.joinProgramChallengeViewModel.id
      );

      if (index !== -1 && this.joinProgramChallengeViewModel.id !== -1) {
        // Remove the existing item at the specific index and insert the updated item at the same index
        this.joinProgramChallengeViewModels.splice(
          index,
          1,
          this.joinProgramChallengeViewModel
        );
      } else {
        // If the item is not found, simply push the new item
        this.joinProgramChallengeViewModels.push(
          this.joinProgramChallengeViewModel
        );
      }

      this.initChallengedViewModel();
      this.file as File;
      this.modalRef?.hide();
    } else {
      this.joinProgramChallengeViewModel.id = this._id;
      this.joinProgramService
        ._updateChallenge(this.joinProgramChallengeViewModel)
        .subscribe({
          next: (respone: ResponseResult) => {
            if (respone.statusCode == StatusCodes.update) {
              this.tosterService.success(respone.message);
              this.modalRef?.hide();
              this.listChalllenge();
              this.initChallengedViewModel();
            } else {
              this.tosterService.error(respone.message);
            }
          },
        });
    }
  }

  listChalllenge() {
    this.joinProgramService._listChallenge().subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success) {
          this.joinProgramChallengeViewModels = response.data;
        }
      },
    });
  }

  //Challenge *******//// End ************//////

  addProgram() {
    if (this.joinProgramModel.id == 0)
      // if (this.wrokshopsViewModels.length > 0) {
      //   //this.upload();
      //   for (let workshop of this.wrokshopsViewModels) {
      //     if (workshop.file != null) {
      //       this.upload(workshop.file);
      //       workshop.imageUrl = this.fileUrl;
      //     }
      //     this._wrokshopsViewModelsUpload.push(workshop);
      //   }
      // }

      for (let workshop of this.workshopViewModels) {
        // Check if the interview is not in _interviewViewModelsUpload
        const alreadyUploaded = this._workshopViewModelsUpload.some(
          (uploadedWorkshop) => uploadedWorkshop === workshop
        );

        if (!alreadyUploaded && workshop.file != null) {
          this.upload(workshop.file);
          workshop.imageUrl = this.fileUrl;
          this._workshopViewModelsUpload.push(workshop); // Add to the uploaded list
        }
      }

    if (this.interviewViewModels.length > 0) {
      // for (let interview of this.interviewViewModels) {
      //   if (interview.file != null)
      //   {
      //     this.upload(interview.file);
      //     interview.imageUrl = this.fileUrl;
      //   }
      //      this._interviewViewModelsUpload.push(interview);
      // }

      for (let interview of this.interviewViewModels) {
        // Check if the interview is not in _interviewViewModelsUpload
        const alreadyUploaded = this._interviewViewModelsUpload.some(
          (uploadedInterview) => uploadedInterview === interview
        );

        if (!alreadyUploaded && interview.file != null) {
          this.upload(interview.file);
          interview.imageUrl = this.fileUrl;
          this._interviewViewModelsUpload.push(interview); // Add to the uploaded list
        }
      }
    }

    this.joinProgramModel.interviewViewModels = this._interviewViewModelsUpload;
    this.joinProgramModel.workshopViewModels = this._workshopViewModelsUpload;
    this.joinProgramModel.joinProgramChallengeViewModels =
      this.joinProgramChallengeViewModels;

    //participationTestViewModel

    this.joinProgramService._addProgram(this.joinProgramModel).subscribe({
      next: (respone: ResponseResult) => {
        if (respone.statusCode == StatusCodes.success) {
          this.initForm();
          this._challengesViewModelsUpload = [];
          this._interviewViewModelsUpload = [];
          this._workshopViewModelsUpload = [];

          this.tosterService.success(respone.message);
        } else {
          this.tosterService.error(respone.message);
        }
      },
    });
  }

  upload(file: File): Observable<any> {
    this.progress = 0;

    if (file != null) {
      return this.uploadService.upload(file, 'joinProgram').pipe(
        finalize(() => {
          this.selectedFiles = undefined;
          //this.workshopViewModel.imageUrl = this.fileUrl;
        })
      );
    }

    return EMPTY; // Return an empty observable if no file is provided
  }
  // upload(file: File): Observable<any> {
  //   this.progress = 0;

  //   if (file != null) {
  //     this.uploadService
  //       .upload(file, 'joinProgram')
  //       .pipe(
  //         finalize(() => {
  //           this.selectedFiles = undefined;

  //           this.workshopViewModel.imageUrl = this.fileUrl;
  //         })
  //       )
  //       .subscribe({
  //         next: (event: any) => {
  //           if (event.type === HttpEventType.UploadProgress) {
  //             this.progress = Math.round((100 * event.loaded) / event.total);
  //           } else if (event instanceof HttpResponse) {
  //             this.message = event.body.message;

  //             // Assuming the uploaded file's URL is returned in the response
  //             if (event.status == 200) {
  //               if (event.body.data != null && event.body.data.length > 0) {
  //                 this.fileUrl = event.body.data[0].url;
  //               }
  //             }
  //             this.fileInfos = this.uploadService.getFiles();

  //             // Set the URL here
  //           }
  //         },
  //         error: (err: any) => {
  //           this.progress = 0;
  //           if (err.error && err.error.message) {
  //             this.message = err.error.message;
  //           } else {
  //             this.message = 'Could not upload the file!';
  //           }
  //           this.currentFile = undefined;
  //         },
  //       });
  //   }

  //   return EMPTY;
  // }

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
