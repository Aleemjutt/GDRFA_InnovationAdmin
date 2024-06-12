import { CommonModule } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FilePondOptions } from 'filepond';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FilePondModule } from 'ngx-filepond';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, finalize } from 'rxjs';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { InnovationInBriefModel } from 'src/app/_models/knowledge/innovationBrief';
import { ResponseResult, StatusCodes } from 'src/app/_models/responseResult';
import { InnovationBreifService } from 'src/app/_services/knowledge/innovation-breif.service';
import { ResearchAndStudiesService } from 'src/app/_services/knowledge/research-and-studies.service';
import { UploadServiceService } from 'src/app/_services/upload-service.service';

@Component({
  selector: 'app-innovation-brief',
  standalone: true,
  imports: [FormsModule, FilePondModule, CommonModule, TranslateModule],
  templateUrl: './innovation-brief.component.html',
  styleUrl: './innovation-brief.component.css',
})
export class InnovationBriefComponent implements OnInit {
  @ViewChild('template') template: TemplateRef<any> | undefined;
  @ViewChild('templateDetails') templateDetails: TemplateRef<any> | undefined;
  registerForm!: FormGroup;
  pondFiles: FilePondOptions['files'] = [];
  innovationInBriefModel: InnovationInBriefModel;
  innovationInBriefModelList: any;
  modalRef?: BsModalRef;
  fb: any;
  progress: number | undefined;
  currentFile: File | undefined;
  message: any;
  selectedFiles?: FileList;
  attachmentList: any = [];
  fileInfos?: Observable<any>;
  file: File | undefined;
  attachmentFile: File | undefined;
  attachment: any;
  imagesArray: any = [];
  private languageChangeSubscription!: Subscription;
  constructor(
    private tosterService: ToastrService,
    private modalService: BsModalService,
    private uploadService: UploadServiceService,
    private innovationBriefService: InnovationBreifService,
    public globalService: GlobalServiceService
  ) {
    this.innovationInBriefModel = {
      id: 0,
      bookNameEn: null,
      bookNameAr: null,
      url: null, // Set a default value for discuss from the Discuss enum
      urlBase64: null, // Provide appropriate default value or structure for ResearchAndStudiesCategories
      bookUrl: null, // Provide appropriate default value or structure for ResearchAndStudiesCategories
      bookUrlBase64: null,
    };
  }

  objeInit() {
    this.innovationInBriefModel = {
      id: 0,
      bookNameEn: null,
      bookNameAr: null,
      url: null, // Set a default value for discuss from the Discuss enum
      urlBase64: null, // Provide appropriate default value or structure for ResearchAndStudiesCategories
      bookUrl: null, // Provide appropriate default value or structure for ResearchAndStudiesCategories
      bookUrlBase64: null,
    };

    this.languageChangeSubscription = new Subscription();
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

  pondOptionsBook: FilePondOptions = {
    allowMultiple: true,
    labelIdle: 'Drop files here...',
    //allo: ['image/jpeg, image/png'],
    //acceptedFileTypes: ['image/jpeg, image/png'],
    allowReorder: true,
  };

  pondHandleInit() {}

  pondHandleAddFile(event: any, instanceName: string) {
    //const file: File | null = event.file;

    const file_ = event.file.file;

    this.imagesArray.push({
      fileName: file_,
      instance: instanceName,
      Name: file_.name,
      ext: file_.type,
    });
  }
  pondHandleActivateFile() {}
  pondHandleRemoveFile(event: any) {
    const removedFile = event.file;
    const index = this.imagesArray.findIndex(
      (item: { fileName: any }) => item.fileName === removedFile.file
    );

    if (index !== -1) {
      this.imagesArray.splice(index, 1);
    }
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  initilizeDataTable(): void {
    const currentLang = this.globalService.getCurrentLanguage();
    const languageConfig =
      currentLang === 'ar'
        ? this.globalService.getArabicLanguageConfig()
        : this.globalService.getEnglishLanguageConfig();
    // Data reload function
    const datatable: any = $('#innovationBriefDataTable').DataTable();
    this.innovationBriefService
      ._list()
      .subscribe((response: ResponseResult) => {
        // ////console.log(response.data, 'Data Table values');
        console.log(response, 'response');
        this.innovationInBriefModelList = response.data;
        // Datatable reloading
        datatable.destroy();

        setTimeout(() => {
          $('#innovationBriefDataTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            data: this.innovationInBriefModelList,
            language: languageConfig,
            columns: [
              { data: 'id' },
              { data: 'bookNameEn' },
              { data: 'bookNameAr' },
              {
                data: 'data',
                defaultContent: `
              <button
              type="button"
              class="btn btn-light mr-1"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              (click)="viewbtnDetails()"
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
            (click)="editAgenda(id, template)"
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
                (click)="deletebtn(id)"
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
              const viewbtnDetails = $('button:first', row);
              const editbtn = $('button:eq(1)', row);
              const deletebtn = $('button:last', row);
              // Attach click event handlers to the buttons
              viewbtnDetails.on('click', () => {
                this.viewDetails(data.id, this.templateDetails);
              });

              editbtn.on('click', () => {
                this.edit(data.id, this.template);
              });

              deletebtn.on('click', () => {
                this.delete(data.id);
              });

              return row;
            },

            lengthMenu: [5, 10, 25],
          });
        }, 1);
      });
  }

  add() {
    if (this.imagesArray != null && this.imagesArray.length > 0) {
      this.upload(0);
    } else {
      // Handle the case where no file is selected.
      this.addWithFile();
    }
  }
  addWithFile() {
    this.innovationBriefService._add(this.innovationInBriefModel).subscribe({
      next: (response: ResponseResult) => {
        if (
          response.statusCode == StatusCodes.success ||
          StatusCodes.add ||
          StatusCodes.update
        ) {
          this.modalRef?.hide();
          this.tosterService.success(response.message);
          this.initilizeDataTable();
          this.file = undefined;
          this.IntiForm();
          this.imagesArray = [];
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  update() {
    if (this.imagesArray != null && this.imagesArray.length > 0) {
      this.upload(1);
    } else {
      // Handle the case where no file is selected.
      this._update();
    }
  }

  _update() {
    this.innovationBriefService._update(this.innovationInBriefModel).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success || StatusCodes.update) {
          this.modalRef?.hide();
          this.tosterService.success(response.message);

          this.initilizeDataTable();
          this.file = undefined;
          this.imagesArray = [];
          this.IntiForm();
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  viewDetails(id: number, templateDetails: TemplateRef<any> | undefined) {
    this.objeInit();
    this.innovationBriefService._details(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success || StatusCodes.update) {
          if (templateDetails) {
            this.modalRef = this.modalService.show(templateDetails, {
              class: 'gray modal-lg',
            });
          } else {
            console.error('Template is undefined');
          }
          this.innovationInBriefModel = response.data;
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  edit(id: number, template: TemplateRef<any> | undefined) {
    this.objeInit();
    this.innovationBriefService._details(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success || StatusCodes.update) {
          if (template) {
            this.innovationInBriefModel = response.data;

            this.modalRef = this.modalService.show(template, {
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

  delete(id: number) {
    this.innovationBriefService._delete(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          this.tosterService.success(response.message);
          this.initilizeDataTable();
          this.attachmentList = [];
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  openModal(template: TemplateRef<void>) {
    this.objeInit();
    this.IntiForm();
    this.attachmentList = [];

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg' })
    );
  }

  upload(type: number): void {
    this.progress = 0;
    const _instanceName = '';
    const totalImages = this.imagesArray.length;
    let uploadedImages = 0;
    if (this.imagesArray.length > 0) {
      for (let index = 0; index < totalImages; index++) {
        this.uploadService
          .upload(this.imagesArray[index].fileName, 'InnovationBrief')
          .pipe(
            finalize(() => {
              uploadedImages++;
              if (uploadedImages === totalImages) {
                for (var _attachment of this.attachmentList) {
                  if (_attachment.instanceName == 'bookfile') {
                    this.innovationInBriefModel.bookUrl = _attachment.url;
                  } else if (_attachment.instanceName == 'bookCoverImage') {
                    this.innovationInBriefModel.url = _attachment.url;
                  }
                }

                if (type == 0) {
                  this.addWithFile();
                } else {
                  this._update();
                }
              }
            })
          )
          .subscribe({
            next: (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round((100 * event.loaded) / event.total);
              } else if (event instanceof HttpResponse) {
                this.message = event.body.message;
                for (let attm of event.body.data as {
                  url: string;
                  name: string;
                  extension: string;
                  instanceName: string;
                }[]) {
                  if (attm !== null) {
                    //if (
                    //  this.imagesArray[index].instance === 'agendDownloadFile'
                    //) {
                    // Check if an attachment with the same fileName already exists in the agendaAttachmentModels array
                    const existingAttachment = this.attachmentList.find(
                      (a: { fileName: string }) => a.fileName === attm.name
                    );

                    if (!existingAttachment) {
                      // Create a new agendaAttachment
                      const newAttachment = {
                        fileName: attm.name,
                        url: attm.url,
                        ext: attm.extension,
                        urlBase64: '',
                        instanceName: this.imagesArray[index].instance, //attm.instanceName,
                      };

                      // Push the new attachment to the agendaAttachmentModels array
                      this.attachmentList.push(newAttachment);
                    }

                    // Set agendaAttachment properties (outside the condition to avoid duplicating code)
                    this.attachment.fileName = attm.name;
                    this.attachment.url = attm.url;
                    this.attachment.ext = attm.extension;
                    this.attachment.instanceName =
                      this.imagesArray[index].instance;
                    //}
                  }
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
    } else {
      if (type == 0) {
        this.addWithFile();
      } else {
        this._update();
      }
    }

    this.selectedFiles = undefined;
  }

  // upload(file: File | undefined, type: number): void {
  //   this.progress = 0;

  //   if (file) {
  //     this.currentFile = file;

  //     this.uploadService
  //       .upload(this.currentFile, 'InnovationBrief')
  //       .pipe(
  //         finalize(() => {
  //           if (this.attachmentList.length > 0) {
  //             for (var _attachment of this.attachmentList) {
  //               if (_attachment.instanceName == 'bookfile') {
  //                 this.innovationInBriefModel.bookUrl = _attachment.imageUrl;
  //               } else if (_attachment.instanceName == 'bookCoverImage') {
  //                 this.innovationInBriefModel.url = _attachment.imageUrl;
  //               }
  //             }
  //             if (type == 0) {
  //               this.addWithFile();
  //             } else {
  //               this._update();
  //             }
  //           }
  //         })
  //       )
  //       .subscribe({
  //         next: (event: any) => {
  //           if (event.type === HttpEventType.UploadProgress) {
  //             this.progress = Math.round((100 * event.loaded) / event.total);
  //           } else if (event instanceof HttpResponse) {
  //             this.message = event.body.message;
  //             for (let attm of event.body.data as {
  //               url: string;
  //               instanceName: string;
  //             }[]) {
  //               const attachment = {
  //                 imageUrl: attm.url,
  //                 instanceName: attm.instanceName,
  //               };
  //               this.attachmentList.push(attachment);
  //             }
  //             this.fileInfos = this.uploadService.getFiles();
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

  //   this.selectedFiles = undefined;
  // }

  processHttpResponse(event: HttpResponse<any>, index: number): void {
    this.message = event.body.message;

    for (let attm of event.body.data as { url: string }[]) {
      const attachment = {
        imageUrl: attm.url,
        instanceName: this.imagesArray[index].instanceName,
      };
      this.attachmentList.push(attachment);
    }
  }

  handleUploadError(err: any): void {
    this.progress = 0;

    if (err.error && err.error.message) {
      this.message = err.error.message;
    } else {
      this.message = 'Could not upload the file!';
    }
  }

  IntiForm() {
    this.innovationInBriefModel = {
      id: 0,
      bookNameEn: null,
      bookNameAr: null,
      url: null, // Set a default value for discuss from the Discuss enum
      urlBase64: null, // Provide appropriate default value or structure for ResearchAndStudiesCategories
      bookUrl: null, // Provide appropriate default value or structure for ResearchAndStudiesCategories
      bookUrlBase64: null,
    };
    this.attachmentList = [];
  }

  removeImage(instanceName: string) {
    if (this.innovationInBriefModel) {
      if (instanceName == 'bookCoverImage') {
        this.innovationInBriefModel.url = '';
        this.innovationInBriefModel.urlBase64 = '';
      } else {
        this.innovationInBriefModel.bookUrl = '';
        this.innovationInBriefModel.bookUrlBase64 = '';
      }
    }
  }
}
