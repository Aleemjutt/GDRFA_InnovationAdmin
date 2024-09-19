import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FilePondOptions, Status } from 'filepond';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FilePondModule } from 'ngx-filepond';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, finalize, Observable, Subscription } from 'rxjs';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import {
  InterviewAttendanceViewModel,
  InterviewStatus,
  InterviewViewModel,
} from 'src/app/_models/CreativeSupport/interviewViewModel';
import {
  JoinProgramChallengeSubmitViewModel,
  JoinProgramChallengeViewModel,
} from 'src/app/_models/CreativeSupport/joinProgramChallengeViewModel';
import {
  joinProgramViewModel,
  RegisterJoinProgramViewModel,
} from 'src/app/_models/CreativeSupport/joinProgramViewModel';
import {
  MQSOptionViewModel,
  ParticipationTestAnswerViewModel,
  ParticipationTestAttendnaceViewModel,
  ParticipationTestViewModel,
  QuestionViewModel,
} from 'src/app/_models/CreativeSupport/participatingTestViewModel';
import {
  AttendanceStatus,
  WorkshopAttendanceViewModel,
  WorkshopViewModel,
} from 'src/app/_models/CreativeSupport/workshopViewModel';
import { ResponseResult, StatusCodes } from 'src/app/_models/responseResult';
import { JoinProgramService } from 'src/app/_services/_creativeSupport/join-program.service';
import { JoinProgramShareServiceService } from 'src/app/_services/SharedServices/join-program-share-service.service';
import { UploadServiceService } from 'src/app/_services/upload-service.service';
import { ListRegisterInProgramComponent } from '../list-register-in-program/list-register-in-program.component';
import { ListTestSubmitedComponent } from '../list-test-submited/list-test-submited.component';
import { ListWorkshopAttendanceComponent } from '../list-workshop-attendance/list-workshop-attendance.component';
import { ListInterviewAttendanceComponent } from '../list-interview-attendance/list-interview-attendance.component';
import { ListChallengedSubmitedComponent } from '../list-challenged-submited/list-challenged-submited.component';
import { DataKeys, StatusCode } from 'src/app/_models/Common/enumsConnon';
import { event } from 'jquery';

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
    ListRegisterInProgramComponent,
    ListTestSubmitedComponent,
    ListWorkshopAttendanceComponent,
    ListInterviewAttendanceComponent,
    ListChallengedSubmitedComponent,
  ],
  templateUrl: './add-program.component.html',
  styleUrl: './add-program.component.css',
})
export class AddProgramComponent implements OnInit, AfterViewInit {
  @ViewChild('addProgramForm') addProgramForm: NgForm | undefined;
  isComponentVisible = true;
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

  @ViewChild('registerInProgramDetailTemplete')
  registerInProgramDetailTemplete: TemplateRef<any> | undefined;
  @ViewChild('participateTestAttendanceDetailTemplete')
  participateTestAttendanceDetailTemplete: TemplateRef<any> | undefined;

  @ViewChild('workshopAttendanceDetailTemplete')
  workshopAttendanceDetailTemplete: TemplateRef<any> | undefined;

  @ViewChild('interviewAttendanceDetailTemplete')
  interviewAttendanceDetailTemplete: TemplateRef<any> | undefined;

  @ViewChild('challengeSubmitedDetailTemplete')
  challengeSubmitedDetailTemplete: TemplateRef<any> | undefined;

  @ViewChild('listWorkshopAttendanceComponent', { static: false })
  listWorkshopAttendanceComponent: ListWorkshopAttendanceComponent | undefined;

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

  //  Data From Client Side

  listRegisterProgramViewModel: RegisterJoinProgramViewModel[] = [];
  listWorkshopAttendanceViewModel: WorkshopAttendanceViewModel[] = [];

  listInterviewAttendanceViewModel: InterviewAttendanceViewModel[] = [];
  listChallengeSubmitedViewModel: JoinProgramChallengeSubmitViewModel[] = [];
  listParticipateAttendanceViewModel: ParticipationTestAttendnaceViewModel[] =
    [];
  public StatusCode = StatusCode;

  status = false;
  count = 0;

  constructor(
    public globalService: GlobalServiceService,
    private tosterService: ToastrService,
    private joinProgramService: JoinProgramService,
    private modalService: BsModalService,
    private router: Router,
    private uploadService: UploadServiceService,
    private route: ActivatedRoute,
    private joinProgramSharedService: JoinProgramShareServiceService
  ) {
    this.joinProgramModel = {
      id: 0,
      descriptionAr: '',
      descriptionEn: '',
      startDate: '',
      endDate: '',
      statusCode: StatusCode.InActive,
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
      statusCode: StatusCode.InActive,
      programId: 0,
      passingRating: 0,
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
      interviewTimeTo: '',
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
      workshopTimeTo: '',
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
      workshopTimeTo: '',
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
      interviewTimeTo: '',
    };
    this._id = 0;
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
    //this.joinProgramChallengeViewModels = [];
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
    //this.joinProgramChallengeViewModels = [];
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
  }

  ngOnInit(): void {
    this.languageChangeSubscription =
      this.globalService.languageChange$.subscribe((lang) => {
        // Update the ng-select label property when the language changes
        //this.initilizeDataTable();
      });
    this.initForm();
    this.route.snapshot.paramMap.get('id');
    this.route.snapshot.paramMap.get('type');

    this.route.paramMap.subscribe((params) => {
      let id = params.get('id');
      let type = params.get('type');
      // Use the id and type parameters as needed

      console.log('id', id);
      console.log('type', type);

      if (id != null && type != null) {
        this.initForm();
        if (id == '0' && type == '0') {
        } else {
          this.editProgram(parseInt(id, 10));
          this.isView = type === '1' ? true : false;
        }
      }
    });

    this.joinProgramSharedService.programList$.subscribe((list) => {
      this.listRegisterProgramViewModel = list;
    });

    this.joinProgramSharedService.participateInTestListSource$.subscribe(
      (list) => {
        this.listParticipateAttendanceViewModel = list;
      }
    );

    this.joinProgramSharedService.workshopList$.subscribe((list) => {
      this.listWorkshopAttendanceViewModel = list;
    });

    this.joinProgramSharedService.interviewList$.subscribe((list) => {
      this.listInterviewAttendanceViewModel = list;
    });

    this.joinProgramSharedService.challengeList$.subscribe((list) => {
      this.listChallengeSubmitedViewModel = list;
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
      //status: false,
      statusCode: StatusCode.InActive,
      programId: 0,
      passingRating: 0,
    };
    this.languageChangeSubscription = new Subscription();

    this.mQSOptionViewModelList = [];
    this.questionViewModelList = [];
    this.initWrokshopModel();
    this.initInterviewModel();
    this.initJoinJoinProgramChallengeViewModel();
    this.initChallengedViewModel();

    this._id = 0;
    this.isView = false;
  }
  ngAfterViewInit() {
    // Ensure the FilePond instance is correctly assigned after the view is initialized
    console.log(this.listWorkshopAttendanceComponent);
    this.pond = this.myPond.filePond;
  }
  openModal(template: TemplateRef<void> | undefined) {
    this.initForm();
    if (template)
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: 'modal-lg' })
      );
    this.globalService.resetValidation();
    this.globalService.dataKeys = {};
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
  checekIsActiveTest(model: any, modelList: any[]) {
    if (model.statusCode == StatusCode.IsActive) {
      var isExist = modelList.find(
        (a) => a.statusCode == StatusCode.IsActive && a.id != model.id
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
  validateTestModel(): boolean {
    // return this.globalService.validateModel(this.participationTestViewModel, [
    //   'textAr',
    //   'textEn',
    // ]);

    return this.globalService.validateModel(this.participationTestViewModel, [
      { key: 'textAr' },
      { key: 'textEn' },
    ]);
  }
  addTest() {
    //  if (this.validateTestModel()) {
    if (
      !this.checekIsActiveTest(
        this.participationTestViewModel,
        this.participationTestViewModelList
      )
    ) {
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
        if (this.participationTestViewModel.id == -1) {
          this.participationTestViewModel.id = 0;
        }

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
    //}
  }
  updateTest() {
    // if (this.validateTestModel()) {
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
    //}
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
    this.joinProgramService
      ._getParticipateTestList(this.joinProgramModel.id)
      .subscribe({
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
  validateQuestionModel(): boolean {
    // return this.globalService.validateModel(this.questionViewModel, [
    //   'textAr',
    //   'textEn',
    // ]);

    return this.globalService.validateModel(this.questionViewModel, [
      { key: 'textAr' },
      { key: 'textEn' },
    ]);
  }
  addQuestion(): void {
    if (this.validateQuestionModel()) {
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
  }
  validateOptionModel(): boolean {
    // return this.globalService.validateModel(this.mQSOptionViewModel, [
    //   'textAr',
    //   'textEn',
    // ]);

    return this.globalService.validateModel(this.mQSOptionViewModel, [
      { key: 'textAr' },
      { key: 'textEn' },
    ]);
  }
  addOption(): void {
    if (this.validateOptionModel()) {
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
    this.globalService.dataKeys = {};
    this.globalService.resetValidation();
  }
  validateWorkshopModel(): boolean {
    // return this.globalService.validateModel(this.workshopViewModel, [
    //   'nameAr',
    //   'nameEn',
    // ]);

    return this.globalService.validateModel(this.workshopViewModel, [
      { key: 'nameAr' },
      { key: 'nameEn' },
      { key: 'workshopDate', type: 'date' },
    ]);
  }

  saveWorkshop() {
    if (this.validateWorkshopModel()) {
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
          this.workshopViewModels.push(this.workshopViewModel);
          //this._workshopViewModelsUpload.push(this.workshopViewModel);
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
  }

  addWorkshop() {
    let _workshopId = this.workshopViewModel.id;
    if (this.workshopViewModel.id == -1) {
      _workshopId = this.workshopViewModel.id;
      this.workshopViewModel.id = 0;
    }

    this.joinProgramService._addWorkshop(this.workshopViewModel).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success) {
          this.tosterService.success(response.message);
          this.modalRef?.hide();
          this.listWorkshop();
          _workshopId = 0;
          const index = this.workshopViewModels.findIndex(
            (item) => item.id === this.workshopViewModel.id
          );
          if (index !== -1 && this.workshopViewModel.id !== -1) {
            this.workshopViewModels.splice(index, 1, this.workshopViewModel);
          } else {
            this._workshopViewModelsUpload.push(this.workshopViewModel);
          }
        } else {
          this.workshopViewModel.id = _workshopId;
          this.tosterService.error(response.message);
        }
      },
      error: (error) => {
        this.workshopViewModel.id = _workshopId;
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
      this._workshopViewModelsUpload.splice(id, 1);
    } else {
      let _id = this.workshopViewModels[id].id;
      this.joinProgramService._deleteWorkshop(_id).subscribe({
        next: (respone: ResponseResult) => {
          if (
            respone.statusCode == StatusCodes.success ||
            respone.statusCode == StatusCodes.deleted
          ) {
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
    if (this.validateWorkshopModel()) {
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
    this.joinProgramService._listWorkshop(this.joinProgramModel.id).subscribe({
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
  validateInterviewModel(): boolean {
    // return this.globalService.validateModel(this.interviewViewModel, [
    //   'nameAr',
    //   'nameEn',
    // ]);

    return this.globalService.validateModel(this.interviewViewModel, [
      { key: 'nameAr' },
      { key: 'nameEn' },
      { key: 'interviewDate', type: 'date' },
    ]);
  }
  saveInterview() {
    if (this.validateInterviewModel()) {
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
          this.interviewViewModels.push(this.interviewViewModel);
          //this._interviewViewModelsUpload.push(this.interviewViewModel);
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
  }

  _addInterview() {
    let _interviewId = 0;
    if (this.interviewViewModel.id >= -1) {
      _interviewId = this.interviewViewModel.id;
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
          this.interviewViewModel.id = _interviewId;
          this.tosterService.error(response.message);
        }
      },
      error: (error) => {
        this.interviewViewModel.id = _interviewId;
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
    if (this.joinProgramModel.id != 0) {
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
          if (
            respone.statusCode == StatusCodes.success ||
            respone.statusCode == StatusCodes.deleted
          ) {
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
    if (this.validateInterviewModel()) {
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
                  // this.interviewViewModel.id = 0;
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
  }

  _updateInterview() {
    this.interviewViewModel.id = this._id;
    this.joinProgramService
      ._updateInterView(this.interviewViewModel)
      .subscribe({
        next: (respone: ResponseResult) => {
          if (
            respone.statusCode == StatusCodes.update ||
            respone.statusCode == StatusCodes.success
          ) {
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
    this.joinProgramService._listInterview(this.joinProgramModel.id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success) {
          this.interviewViewModels = [];
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

  validateChallegeModel(): boolean {
    // return this.globalService.validateModel(
    //   this.joinProgramChallengeViewModel,
    //   ['titleAr', 'titleEn']
    // );

    return this.globalService.validateModel(
      this.joinProgramChallengeViewModel,
      [{ key: 'titleAr' }, { key: 'titleEn' }]
    );
  }
  saveChallenge() {
    if (this.validateChallegeModel()) {
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
          if (
            respone.statusCode == StatusCodes.success ||
            respone.statusCode == StatusCodes.deleted
          ) {
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
    if (this.validateChallegeModel()) {
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
  }

  listChalllenge() {
    this.joinProgramChallengeViewModels = [];

    this.joinProgramService._listChallenge(this.joinProgramModel.id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success) {
          this.joinProgramChallengeViewModels = response.data;
        }
      },
    });
  }

  //Challenge *******//// End ************//////

  // validateProgramModel(): boolean {
  //   return this.globalService.validateModel(this.joinProgramModel, [
  //     'descriptionEn',
  //     'descriptionAr',
  //   ]);
  // }

  validateProgramModel(): boolean {
    return this.globalService.validateModel(this.joinProgramModel, [
      { key: 'descriptionEn' },
      { key: 'descriptionAr' },
      { key: 'startDate', type: 'date' },
      { key: 'endDate', type: 'date' },
    ]);
  }
  setJoinProgramCheckBoxValue(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    this.joinProgramModel.statusCode = isChecked
      ? StatusCode.IsActive
      : StatusCode.InActive;
  }
  addProgram() {
    //this._challengesViewModelsUpload = [];
    //this._interviewViewModelsUpload = [];
    // this._workshopViewModelsUpload = [];

    if (this.validateProgramModel()) {
      if (this.joinProgramModel.id == 0) {
        for (let workshop of this.workshopViewModels) {
          // Check if the interview is not in _interviewViewModelsUpload
          const alreadyUploaded = this._workshopViewModelsUpload.some(
            (uploadedWorkshop) => uploadedWorkshop === workshop
          );

          if (!alreadyUploaded && workshop.file != null) {
            this.upload(workshop.file);
            workshop.imageUrl = this.fileUrl;
            workshop.id = 0;
            this._workshopViewModelsUpload.push(workshop); // Add to the uploaded list
          } else if (!alreadyUploaded) {
            this._workshopViewModelsUpload.push(workshop);
          }
        }

        if (this.interviewViewModels.length > 0) {
          for (let interview of this.interviewViewModels) {
            // Check if the interview is not in _interviewViewModelsUpload
            const alreadyUploaded = this._interviewViewModelsUpload.some(
              (uploadedInterview) => uploadedInterview === interview
            );
            if (!alreadyUploaded && interview.file != null) {
              this.upload(interview.file);
              interview.imageUrl = this.fileUrl;
              interview.id = 0;
              this._interviewViewModelsUpload.push(interview); // Add to the uploaded list
            } else if (!alreadyUploaded) {
              this._interviewViewModelsUpload.push(interview);
            }
          }
        }
        let _listOfWorkshop = this._workshopViewModelsUpload.map((element) => {
          // Modify the element if necessary, for example, setting `id` to `null`
          element.id = 0;
          return element;
        });

        let _listOfInterview = this._interviewViewModelsUpload.map(
          (element) => {
            // Modify the element if necessary, for example, setting `id` to `null`
            element.id = 0;
            return element;
          }
        );

        let _listOfParticipating = this.participationTestViewModelList.map(
          (element) => {
            // Modify the element if necessary, for example, setting `id` to `null`
            element.id = 0;
            return element;
          }
        );

        let _listOfChallenge = this.joinProgramChallengeViewModels.map(
          (element) => {
            // Modify the element if necessary, for example, setting `id` to `null`
            element.id = 0;
            return element;
          }
        );

        this.joinProgramModel.interviewViewModels = _listOfInterview; //this._interviewViewModelsUpload;
        this.joinProgramModel.workshopViewModels = _listOfWorkshop; //this._workshopViewModelsUpload;
        this.joinProgramModel.joinProgramChallengeViewModels = _listOfChallenge;
        this.joinProgramModel.participationTestViewModels =
          _listOfParticipating;
        //participationTestViewModel

        this.joinProgramService._addProgram(this.joinProgramModel).subscribe({
          next: (respone: ResponseResult) => {
            if (respone.statusCode == StatusCodes.success) {
              this.initForm();
              this._challengesViewModelsUpload = [];
              this._interviewViewModelsUpload = [];
              this._workshopViewModelsUpload = [];
              this.tosterService.success(respone.message);

              setTimeout(() => {
                this.router.navigateByUrl('/creativeSupport/listProgram');
              }, 1000);
            } else {
              this.tosterService.error(respone.message);
            }
          },
        });
      } else {
        if (this.validateProgramModel()) {
          this.joinProgramService
            ._updateProgram(this.joinProgramModel)
            .subscribe({
              next: (respone: ResponseResult) => {
                if (
                  respone.statusCode == StatusCodes.success ||
                  respone.statusCode == StatusCodes.update
                ) {
                  this.tosterService.success(respone.message);
                  this._challengesViewModelsUpload = [];
                  this._interviewViewModelsUpload = [];
                  this._workshopViewModelsUpload = [];
                  this.initForm();
                  setTimeout(() => {
                    this.router.navigateByUrl('/creativeSupport/listProgram');
                  }, 1000);
                } else {
                  this.tosterService.error(respone.message);
                }
              },
            });
        }
      }
    }
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
        return this.globalService.getCurrentLanguage() == 'en'
          ? 'Program'
          : 'برنامج';
      case 'CreateTest':
        return this.globalService.getCurrentLanguage() == 'en'
          ? 'Create Test'
          : 'إنشاء اختبار';
      case 'Wrokshop':
        return this.globalService.getCurrentLanguage() == 'en'
          ? 'Wrokshop'
          : 'ورشة عمل';
      case 'Interview':
        return this.globalService.getCurrentLanguage() == 'en'
          ? 'Interview'
          : 'مقابلة';
      case 'TranningCourse':
        return this.globalService.getCurrentLanguage() == 'en'
          ? 'Tranning Course'
          : 'دورة تدريبية';
      case 'Challenges':
        return this.globalService.getCurrentLanguage() == 'en'
          ? 'Challenges'
          : 'التحديات';
      default:
        return '';
    }
  }

  listRegisterProgram(
    registerInProgramDetailTemplete: TemplateRef<void> | undefined
  ) {
    //this.initModel();

    if (registerInProgramDetailTemplete) {
      this.modalRef = this.modalService.show(
        registerInProgramDetailTemplete,
        Object.assign({}, { class: 'modal-lg' })
      );
    }
  }

  viewParticipateInTest(
    id: number,
    participateTemplete: TemplateRef<void> | undefined
  ) {
    if (participateTemplete) {
      if (this.participationTestViewModelList != null) {
        this.participationTestViewModel =
          this.participationTestViewModelList.find((a) => a.id == id) ||
          this.participationTestViewModel;
      }

      this.modalRef = this.modalService.show(
        participateTemplete,
        Object.assign({}, { class: 'modal-lg' })
      );
    }
  }
  viewWorkshopAttendance(
    id: number,
    workshopAttendanceTemplete: TemplateRef<void> | undefined
  ) {
    if (workshopAttendanceTemplete) {
      if (this.workshopViewModels != null) {
        this.workshopViewModel =
          this.workshopViewModels.find((a) => a.id == id) ||
          this.workshopViewModel;
        this.modalRef = this.modalService.show(
          workshopAttendanceTemplete,
          Object.assign({}, { class: 'modal-lg' })
        );
      }
    }
  }

  viewInterviewAttendance(
    id: number,
    interviewAttendanceTemplete: TemplateRef<void> | undefined
  ) {
    if (interviewAttendanceTemplete) {
      if (this.interviewViewModels != null) {
        this.interviewViewModel =
          this.interviewViewModels.find((a) => a.id == id) ||
          this.interviewViewModel;

        this.modalRef = this.modalService.show(
          interviewAttendanceTemplete,
          Object.assign({}, { class: 'modal-lg' })
        );
      }
    }
  }
  viewChallengeSubmited(
    id: number,
    challengeTemplete: TemplateRef<void> | undefined
  ) {
    if (challengeTemplete) {
      if (this.joinProgramChallengeViewModels != null) {
        this.joinProgramChallengeViewModel =
          this.joinProgramChallengeViewModels.find((a) => a.id == id) ||
          this.joinProgramChallengeViewModel;
        this.modalRef = this.modalService.show(
          challengeTemplete,
          Object.assign({}, { class: 'modal-lg' })
        );
      }
    }
  }

  /// listWorkshopAttendanceComponent Functions
  toggleComponentVisibility() {
    this.isComponentVisible = !this.isComponentVisible;
  }
  submitAttendance() {
    const datatable: any = $('#workshopAttendanceDataTable').DataTable();
    const data: any[] = datatable.rows().data().toArray(); // Get all rows data

    this.listWorkshopAttendanceViewModel = data.map((row: any) => {
      return {
        registerDate: row.registerDate,
        userId: row.userId,
        userName: row.userName,
        empId: row.empId,
        empName: row.empName,
        workshopId: this.workshopViewModel.id,
        attendanceStatus: $(`#userStatusInput_${row.id}`).is(':checked')
          ? AttendanceStatus.Present
          : AttendanceStatus.Absent,
      } as WorkshopAttendanceViewModel;
    });

    if (this.listWorkshopAttendanceViewModel) {
      this.joinProgramService
        ._markWorkshopeAttendance(this.listWorkshopAttendanceViewModel)
        .subscribe({
          next: (response: ResponseResult) => {
            if (
              response.statusCode == StatusCodes.success ||
              StatusCodes.update
            ) {
              this.tosterService.success(response.message);
              this.modalRef?.hide();
              this.initWrokshopModel();
              this.listWorkshopAttendanceViewModel = [];
            } else {
              this.tosterService.error(response.message);
            }
          },
        });
    }
    console.log(this.listWorkshopAttendanceViewModel);
    // if (this.listWorkshopAttendanceComponent) {
    //   this.listWorkshopAttendanceComponent.submitAttendanceDataFromDataTable();
    // } else {
    //   console.log('listWorkshopAttendanceComponent is not yet initialized.');
    // }
  }

  markInterviewStatus() {
    const datatable: any = $('#interviewAttendanceDataTable').DataTable();
    const data: any[] = datatable.rows().data().toArray(); // Get all rows data

    this.listInterviewAttendanceViewModel = data.map((row: any) => {
      return {
        registerDate: row.interviewDate,
        userId: row.userId,
        userName: row.userName,
        empId: row.empId,
        empName: row.empName,
        interviewId: this.interviewViewModel.id,
        interviewStatus: $(`#userStatusInput_${row.id}`).is(':checked')
          ? InterviewStatus.Passed
          : InterviewStatus.Fail,
      } as InterviewAttendanceViewModel;
    });

    if (this.listInterviewAttendanceViewModel) {
      this.joinProgramService
        ._markInterviewResult(this.listInterviewAttendanceViewModel)
        .subscribe({
          next: (response: ResponseResult) => {
            if (
              response.statusCode == StatusCodes.success ||
              StatusCodes.update
            ) {
              this.tosterService.success(response.message);
              this.modalRef?.hide();
              this.initInterviewModel();
              this.listInterviewAttendanceViewModel = [];
            } else {
              this.tosterService.error(response.message);
            }
          },
        });
    }
    console.log(this.listInterviewAttendanceViewModel);
    // if (this.listWorkshopAttendanceComponent) {
    //   this.listWorkshopAttendanceComponent.submitAttendanceDataFromDataTable();
    // } else {
    //   console.log('listWorkshopAttendanceComponent is not yet initialized.');
    // }
  }
}
