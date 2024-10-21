import { CommonModule } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FilePondOptions } from 'filepond';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FilePondModule } from 'ngx-filepond';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, finalize } from 'rxjs';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import {
  AccommodationType,
  AuthorNature,
  AuthorType,
  Gender,
  WorkbookType,
} from 'src/app/_models/Common/enumsConnon';
import {
  AuthorDataModel,
  ClassifierDataModel,
  RegisteringIntellectualPropertyModel,
} from 'src/app/_models/intecllectualProperty/registeringIntellectualPropertyModel';
import { ResponseResult } from 'src/app/_models/responseResult';
import { RegisterIntellectualPropertyService } from 'src/app/_services/_intellectualProperty/register-intellectual-property.service';
import { FiledownloaderService } from 'src/app/_services/filedownloader.service';
import { UploadServiceService } from 'src/app/_services/upload-service.service';

@Component({
  selector: 'app-register-intellectual-property-list',
  standalone: true,
  imports: [
    FilePondModule,
    CommonModule,
    FormsModule,
    TabsModule,
    TranslateModule,
    TabsModule,
  ],
  templateUrl: './register-intellectual-property-list.component.html',
  styleUrl: './register-intellectual-property-list.component.css',
})
export class RegisterIntellectualPropertyListComponent implements OnInit {
  registerIntecllectualPropertiesList: RegisteringIntellectualPropertyModel[] =
    [];
  // Model: Model | undefined = undefined;
  registerIntecllectualPropertyModel: RegisteringIntellectualPropertyModel;
  @ViewChild('templateEdit') templateEdit: TemplateRef<any> | undefined;
  @ViewChild('templateDetails') templateDetails: TemplateRef<any> | undefined;
  registerForm!: FormGroup;
  pondFiles: FilePondOptions['files'] = [];
  authorDataModel: AuthorDataModel;
  classifierDataModel: ClassifierDataModel;

  modalRef?: BsModalRef;
  fb: any;
  progress: number | undefined;
  currentFile: File | undefined;
  message: any;
  selectedFiles?: FileList;
  attachmentList: any = [];
  fileInfos?: Observable<any>;
  file: File | undefined;
  attachment: any;
  private languageChangeSubscription!: Subscription;
  constructor(
    private tosterService: ToastrService,
    private modalService: BsModalService,
    private uploadService: UploadServiceService,
    private registerPropertyService: RegisterIntellectualPropertyService,
    public globalService: GlobalServiceService,
    private downloadService: FiledownloaderService
  ) {
    this.languageChangeSubscription = new Subscription();

    this.authorDataModel = {
      authorNature: AuthorNature.Non,
      authorType: AuthorType.Non,
      accommodationType: AccommodationType.Non,
      nameEn: '',
      nameAr: '',
      nationality: 0,
      mobile: '',
      email: '',
      registeringIntellectualPropertyId: 0,
    };
    this.classifierDataModel = {
      nameofworkEn: '',
      nameofworkAr: '',
      workbookType: WorkbookType.Non,
      descriptionWorkbook: '',
      workbookContent: '',
      registeringIntellectualPropertyId: 0,
      attachmentsModel: [],
    };
    this.registerIntecllectualPropertyModel = {
      id: 0,
      fullNameEn: '',
      fullNameAr: '',
      firstNameEn: '',
      firstNameAr: '',
      secondNameEn: '',
      secondNameAr: '',
      thirdNameEn: '',
      thirdNameAr: '',
      familyNameEn: '',
      familyNameAr: '',
      dateofBirth: '',
      gender: Gender.Non,
      personsofDetermination: false,
      mobile: '',
      email: '',
      emiratesIDNumber: '',
      passportNumber: '',
      authorDataModel: this.authorDataModel,
      classifierDataModel: this.classifierDataModel,
    };
  }
  ngOnInit(): void {
    this.languageChangeSubscription =
      this.globalService.languageChange$.subscribe((lang) => {
        // Update the ng-select label property when the language changes
        this.initilizeDataTable();
      });
    this.pondFiles;
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

    // this.uploadService.uploadFile(event.file).subscribe({
    //   next: (response) => {},
    // });

    //this.upload(event.file.file);
  }
  pondHandleActivateFile(event: any) {}
  pondHandleRemoveFile(event: any) {}

  get registerFormControl() {
    return this.registerForm.controls;
  }

  initilizeDataTable(): void {
    const currentLang = this.globalService.getCurrentLanguage();
    const languageConfig =
      currentLang === 'ar'
        ? this.globalService.getArabicLanguageConfig()
        : this.globalService.getEnglishLanguageConfig();
    const datatable: any = $('#propertiesTypeDataTable').DataTable();
    this.registerPropertyService
      ._list()
      .subscribe((response: ResponseResult) => {
        // ////console.log(response.data, 'Data Table values');
        console.log(response, 'response');
        this.registerIntecllectualPropertiesList = response.data;
        // Datatable reloading
        datatable.destroy();

        setTimeout(() => {
          $('#propertiesTypeDataTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            data: this.registerIntecllectualPropertiesList,
            language: languageConfig,
            columns: [
              { data: 'id' },
              {
                data: 'fullNameEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },
              {
                data: 'fullNameAr', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },
              {
                data: 'data',
                defaultContent: `
              <button
              type="button"
              class="btn btn-light mr-1"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              (click)="viewDetails()"
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
                class="btn btn-outline-danger  mr-1 "
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                (click)="delete(id)"
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
            `,
              },
            ],
            rowCallback: (row: Node, data: any, index: number) => {
              const btnViewDetails = $('button:first', row);
              const btnDelete = $('button:last', row);
              // Attach click event handlers to the buttons
              btnViewDetails.on('click', () => {
                this.viewDetails(data.id, this.templateDetails);
              });

              btnDelete.on('click', () => {
                this._delete(data.id);
              });

              return row;
            },

            lengthMenu: [5, 10, 25],
          });
        }, 1);
      });
  }

  add() {
    if (this.file != null) {
      this.upload(this.file, 0);
    } else {
      // Handle the case where no file is selected.
      this.addWithFile();
    }
  }
  addWithFile() {
    this.registerPropertyService
      ._add(this.registerIntecllectualPropertyModel)
      .subscribe({
        next: (response: ResponseResult) => {
          if (response.statusCode == 0) {
            this.tosterService.success(response.message);
            this.file = undefined;
            this.initilizeDataTable();
            this.attachment = null;
            this.attachmentList = [];
            this.modalRef?.hide();
          } else {
            this.tosterService.error(response.message);
          }
        },
      });
  }

  update() {
    if (this.file != null) {
      this.upload(this.file, 1);
    } else {
      // Handle the case where no file is selected.
      this._update();
    }
  }
  _update() {
    this.registerPropertyService
      ._update(this.registerIntecllectualPropertyModel)
      .subscribe({
        next: (response: ResponseResult) => {
          if (response.statusCode == 0) {
            this.modalRef?.hide();
            this.tosterService.success(response.message);
            this.file = undefined;
            this.initilizeDataTable();
            this.attachment = null;
            this.attachmentList = [];
          } else {
            this.tosterService.error(response.message);
          }
        },
      });
  }

  _add() {
    this.registerPropertyService
      ._add(this.registerIntecllectualPropertyModel)
      .subscribe({
        next: (response: ResponseResult) => {
          if (response.statusCode == 0) {
            this.modalRef?.hide();
            this.tosterService.success(response.message);
            this.file = undefined;
            this.initilizeDataTable();
            this.attachment = null;
            this.attachmentList = [];
          } else {
            this.tosterService.error(response.message);
          }
        },
      });
  }

  viewDetails(id: number, templateDetails: TemplateRef<any> | undefined) {
    this.initModel();
    this.registerPropertyService._details(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (templateDetails) {
            this.modalRef = this.modalService.show(templateDetails, {
              class: 'gray modal-lg',
            });
          } else {
            console.error('Template is undefined');
          }
          this.registerIntecllectualPropertyModel = response.data;
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  editDetails(id: number, templateDetails: TemplateRef<any> | undefined) {
    this.initModel();
    this.registerPropertyService._details(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (templateDetails) {
            this.registerIntecllectualPropertyModel = response.data;

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

  _delete(id: number) {
    this.registerPropertyService._delete(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          this.tosterService.success(response.message);
          this.initilizeDataTable();
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  initModel() {
    this.registerIntecllectualPropertyModel = {
      id: 0,
      fullNameEn: '',
      fullNameAr: '',
      firstNameEn: '',
      firstNameAr: '',
      secondNameEn: '',
      secondNameAr: '',
      thirdNameEn: '',
      thirdNameAr: '',
      familyNameEn: '',
      familyNameAr: '',
      dateofBirth: '',
      gender: Gender.Non,
      personsofDetermination: false,
      mobile: '',
      email: '',
      emiratesIDNumber: '',
      passportNumber: '',
      authorDataModel: this.authorDataModel,
      classifierDataModel: this.classifierDataModel,
    };
  }
  openModal(template: TemplateRef<void> | undefined) {
    this.initModel();
    if (template)
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: 'modal-lg' })
      );
  }

  upload(file: File | undefined, type: number): void {
    this.progress = 0;

    if (file) {
      this.currentFile = file;

      this.uploadService
        .upload(this.currentFile, 'IntectuallProperties')
        .pipe(
          finalize(() => {
            if (this.attachmentList.length > 0) {
              // this.registerIntecllectualPropertyModel.classifierDataModel?.attachmentsModel[0].url =
              //   this.attachmentList[0].imageUrl;
              // if (type == 0) {
              //   this.attachmentList = [];
              //   this.addWithFile();
              // } else {
              //   this._update();
              //   this.attachmentList = [];
              // }
            }
          })
        )
        .subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              for (let attm of event.body.data as { url: string }[]) {
                const attachment = {
                  imageUrl: attm.url,
                };
                this.attachmentList.push(attachment);
              }
              this.fileInfos = this.uploadService.getFiles();
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

    this.selectedFiles = undefined;
  }

  downloadFile(url: string | null) {
    console.log(url);
    if (url) {
      this.downloadService.downloadFile(url);
    }
  }

  _translate(name: string): string {
    let translString = '';
    switch (name) {
      case 'BasicInformation':
        translString =
          this.globalService.getCurrentLanguage() === 'en'
            ? 'Basic Information'
            : 'معلومات أساسية';
        break;

      case 'ClassifierData':
        translString =
          this.globalService.getCurrentLanguage() === 'en'
            ? 'Classifier Data'
            : 'بيانات التصنيف';
        break;

      case 'AuthorData':
        translString =
          this.globalService.getCurrentLanguage() === 'en'
            ? 'Author Data'
            : 'بيانات المؤلف';
        break;

      // Add other cases as needed
    }

    return translString;
  }
}
