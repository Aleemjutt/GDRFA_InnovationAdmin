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
import { AgendaAttachmentModel } from 'src/app/_models/About/agendaAttachment';
import { AgendaModel } from 'src/app/_models/About/agendaModel';
import { ResponseResult, StatusCodes } from 'src/app/_models/responseResult';
import { AgendaService } from 'src/app/_services/_about/agenda.service';
import { UploadServiceService } from 'src/app/_services/upload-service.service';

@Component({
  selector: 'app-agenda-lists',
  standalone: true,
  imports: [FormsModule, FilePondModule, CommonModule, TranslateModule],
  templateUrl: './agenda-lists.component.html',
  styleUrl: './agenda-lists.component.css',
})
export class AgendaListsComponent implements OnInit {
  agendaList: AgendaModel[] = [];
  // agendaModel: agendaModel | undefined = undefined;

  @ViewChild('template') template: TemplateRef<any> | undefined;
  @ViewChild('templateDetails') templateDetails: TemplateRef<any> | undefined;
  registerForm!: FormGroup;
  pondFiles: FilePondOptions['files'] = [];
  pondFiles_Multiples: FilePondOptions['files'] = [];
  agendaModel: AgendaModel;
  modalRef?: BsModalRef;
  fb: any;
  progress: number | undefined;
  currentFile: File | undefined;
  message: any;
  selectedFiles?: FileList;
  attachmentList: any = [];
  fileInfos?: Observable<any>;
  file: File | undefined;
  agendAttachmentFile: File | undefined;
  attachment: any;
  imagesArray: any = [];
  agendaAttachmentsList: AgendaAttachmentModel[] = [];
  agendaAttachment: AgendaAttachmentModel;
  private languageChangeSubscription!: Subscription;
  constructor(
    private tosterService: ToastrService,
    private modalService: BsModalService,
    private uploadService: UploadServiceService,
    private agendaService: AgendaService,
    public globalService: GlobalServiceService
  ) {
    this.agendaAttachment = {
      url: '',
      urlBase64: '',
      ext: '',
      fileName: '',
      agendaId: 0,
    };
    this.agendaModel = {
      id: 0,
      descriptionAr: '',
      descriptionEn: '',
      date: '',
      time: '',
      headingEn: '',
      headingAr: '',
      locationDescriptionEn: '',
      locationDescriptionAr: '',
      urlBase64: '',
      imageUrl: '',
      agendaVenue: 1,
      agendaAttachmentModels: this.agendaAttachmentsList,
    };
    this.languageChangeSubscription = new Subscription();
  }

  objeInit() {
    this.agendaModel = {
      id: 0,
      descriptionAr: '',
      descriptionEn: '',
      date: '',
      time: '',
      headingEn: '',
      headingAr: '',
      locationDescriptionEn: '',
      locationDescriptionAr: '',
      urlBase64: '',
      imageUrl: '',
      agendaVenue: 1,
      agendaAttachmentModels: this.agendaAttachmentsList,
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

  pondOptions_Multiple: FilePondOptions = {
    allowMultiple: true,
    labelIdle: 'Drop files here...',
    //allo: ['image/jpeg, image/png'],
    //acceptedFileTypes: ['image/jpeg, image/png'],
    allowReorder: true,
  };

  pondHandleInit() {}

  pondHandleAddFile(event: any, instanceName: string) {
    //const file: File | null = event.file;
    if (instanceName === 'agendaBannerImg') {
      this.file = event.file.file;
    } else {
      this.agendAttachmentFile = event.file.file;
    }

    const file_ = event.file.file;

    this.imagesArray.push({
      fileName: file_,
      instance: instanceName,
      Name: file_.name,
      ext: file_.type,
    });
  }
  pondHandleActivateFile(event: any) {}
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
    // Data reload function

    const currentLang = this.globalService.getCurrentLanguage();
    const languageConfig =
      currentLang === 'ar'
        ? this.globalService.getArabicLanguageConfig()
        : this.globalService.getEnglishLanguageConfig();
    const datatable: any = $('#agendaDataTable').DataTable();
    this.agendaService.getAgendaList().subscribe((response: ResponseResult) => {
      // ////console.log(response.data, 'Data Table values');
      console.log(response, 'response');
      this.agendaList = response.data;
      // Datatable reloading
      datatable.destroy();

      setTimeout(() => {
        $('#agendaDataTable').DataTable({
          pagingType: 'full_numbers',
          pageLength: 5,
          processing: true,
          data: this.agendaList,
          language: languageConfig,
          columns: [
            { data: 'id' },
            {
              data: 'headingEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
            },
            {
              data: 'descriptionEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
            },
            {
              data: 'headingAr', //(row: any) => this.getDepartmentName(row.requestModel.sID),
            },
            {
              data: 'descriptionAr', //(row: any) => this.getDepartmentName(row.requestModel.sID),
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
            `,
            },
          ],
          rowCallback: (row: Node, data: any, index: number) => {
            const viewpartnerDetails = $('button:first', row);
            const editpartner = $('button:eq(1)', row);
            const deletepartner = $('button:last', row);
            // Attach click event handlers to the buttons
            viewpartnerDetails.on('click', () => {
              this.viewAgendaDetails(data.id, this.templateDetails);
            });

            editpartner.on('click', () => {
              this.editAgenda(data.id, this.template);
            });

            deletepartner.on('click', () => {
              this.deleteAgenda(data.id);
            });

            return row;
          },

          lengthMenu: [5, 10, 25],
        });
      }, 1);
    });
  }

  add() {
    if (this.imagesArray.length > 0) {
      this.upload(0);
    } else {
      // Handle the case where no file is selected.
      this.addWithFile();
    }
  }
  addWithFile() {
    this.agendaService.addAgenda(this.agendaModel).subscribe({
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
    if (this.imagesArray.length > 0) {
      this.upload(1);
    } else {
      // Handle the case where no file is selected.
      this.updateAgenda();
    }
  }

  updateAgenda() {
    this.agendaService.updateAgenda(this.agendaModel).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
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

  viewAgendaDetails(id: number, templateDetails: TemplateRef<any> | undefined) {
    this.objeInit();
    this.agendaService.getAgendaDetails(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (templateDetails) {
            this.modalRef = this.modalService.show(templateDetails, {
              class: 'gray modal-lg',
            });
          } else {
            console.error('Template is undefined');
          }
          this.agendaModel = response.data;
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  editAgenda(id: number, template: TemplateRef<any> | undefined) {
    this.objeInit();
    this.agendaService.getAgendaDetails(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (template) {
            this.agendaModel = response.data;

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

  deleteAgenda(id: number) {
    this.agendaService.deleteAgenda(id).subscribe({
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

  openModal(template: TemplateRef<void>) {
    this.objeInit();

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg' })
    );
  }

  upload(type: number): void {
    this.progress = 0;
    const totalImages = this.imagesArray.length;
    let uploadedImages = 0;
    if (this.imagesArray.length > 0) {
      for (let index = 0; index < totalImages; index++) {
        this.uploadService
          .upload(this.imagesArray[index].fileName, 'agenda')
          .pipe(
            finalize(() => {
              uploadedImages++;
              if (uploadedImages === totalImages) {
                this.agendaModel.agendaAttachmentModels =
                  this.agendaAttachmentsList;

                if (!this.agendaModel.id) {
                  this.addWithFile();
                } else {
                  this.updateAgenda();
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
                }[]) {
                  if (attm !== null) {
                    if (
                      this.imagesArray[index].instance === 'agendDownloadFile'
                    ) {
                      // Check if an attachment with the same fileName already exists in the agendaAttachmentModels array
                      const existingAttachment =
                        this.agendaModel.agendaAttachmentModels.find(
                          (a) => a.fileName === attm.name
                        );

                      if (!existingAttachment) {
                        // Create a new agendaAttachment
                        const newAttachment: AgendaAttachmentModel = {
                          fileName: attm.name,
                          url: attm.url,
                          ext: attm.extension,
                          urlBase64: '',
                          agendaId: 0,
                        };

                        // Push the new attachment to the agendaAttachmentModels array
                        this.agendaModel.agendaAttachmentModels.push(
                          newAttachment
                        );
                      }

                      // Set agendaAttachment properties (outside the condition to avoid duplicating code)
                      this.agendaAttachment.fileName = attm.name;
                      this.agendaAttachment.url = attm.url;
                      this.agendaAttachment.ext = attm.extension;
                    } else {
                      this.agendaModel.imageUrl = attm.url;
                    }
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
        this.updateAgenda();
      }
    }

    this.selectedFiles = undefined;
  }

  setUrlsForInstanceNames(): void {
    for (let index = 0; index < this.imagesArray.length; index++) {
      const instanceName = this.imagesArray[index].instance;
      let imageUrl;

      if (instanceName === 'agendDownloadFile') {
        let obj = this._returnAttachmentObj(instanceName);
        if (obj != null) {
          (this.agendaAttachment.fileName = obj.name),
            (this.agendaAttachment.url = obj.url);
          this.agendaAttachment.ext = obj.extension;
        }
      } else {
        imageUrl = this._returnImageUrl(instanceName)
          ? this._returnImageUrl(instanceName)
          : '';
      }
      // Set URLs based on instance names
      if (this.agendaModel != null) {
        switch (instanceName) {
          case 'agendaBannerImg':
            this.agendaModel.imageUrl = imageUrl ? imageUrl : '';
            break;
          case 'agendDownloadFile':
            //this.agendaModel.downloadFileUrl = imageUrl;

            this.agendaAttachmentsList.push(this.agendaAttachment);
            break;

          // Add cases for other instance names
        }
      }
    }
  }

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

  _returnImageUrl(instanceName: string): string | null {
    const imageUrl = this.attachmentList.find(
      (element: { instanceName: string }) =>
        element.instanceName === instanceName
    )?.imageUrl;

    return imageUrl !== undefined ? imageUrl : null;
  }

  _returnAttachmentObj(
    instanceName: string
  ): { name: string; url: string; extension: string } | null {
    const obj = this.attachmentList.find(
      (element: { instanceName: string }) =>
        element.instanceName === instanceName
    );

    return obj !== undefined
      ? { name: obj.name, url: obj.imageUrl, extension: obj.extension }
      : null;
  }

  IntiForm() {
    this.agendaAttachment = {
      url: '',
      ext: '',
      fileName: '',
      urlBase64: '',
      agendaId: 0,
    };
    this.agendaModel = {
      id: 0,
      descriptionAr: '',
      descriptionEn: '',
      date: '',
      time: '',
      headingEn: '',
      headingAr: '',
      locationDescriptionEn: '',
      locationDescriptionAr: '',
      urlBase64: '',
      imageUrl: '',
      agendaVenue: 1,
      agendaAttachmentModels: this.agendaAttachmentsList,
    };
  }

  removeImage() {
    if (this.agendaModel) {
      this.agendaModel.imageUrl = '';
    }
  }

  /// Tables
}
