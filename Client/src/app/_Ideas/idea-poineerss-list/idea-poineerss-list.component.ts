import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { FilePondOptions } from 'filepond';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, finalize } from 'rxjs';
import { IdeaPioneerModel } from 'src/app/_models/Ideas/ideaPionnerModel';
import { ResponseResult, StatusCodes } from 'src/app/_models/responseResult';
import { IdeaPionnerService } from 'src/app/_services/_Ideas/idea-pionner.service';
import { UploadServiceService } from 'src/app/_services/upload-service.service';
import { CommonModule } from '@angular/common';
import { FilePondModule } from 'ngx-filepond';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';

@Component({
  selector: 'app-idea-poineerss-list',
  standalone: true,
  imports: [FormsModule, FilePondModule, CommonModule],
  templateUrl: './idea-poineerss-list.component.html',
  styleUrl: './idea-poineerss-list.component.css',
})
export class IdeaPoineerssListComponent {
  ideaPioneerList: IdeaPioneerModel[] = [];
  // ideaPionnerModel: ideaPionnerModel | undefined = undefined;
  @ViewChild('template') template: TemplateRef<any> | undefined;
  @ViewChild('templateDetails') templateDetails: TemplateRef<any> | undefined;
  @ViewChild('templatePoints') templatePoints: TemplateRef<any> | undefined;
  registerForm!: FormGroup;
  pondFiles: FilePondOptions['files'] = [];
  ideaPionnerModel: any;
  ideaPionnerPointsModel: any;
  ideaPionnerPointsListModel: any = [];
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
  constructor(
    private tosterService: ToastrService,
    private modalService: BsModalService,
    private uploadService: UploadServiceService,
    private ideaPionnerService: IdeaPionnerService,
    public globalService: GlobalServiceService
  ) {}
  ngOnInit(): void {
    this.initilizeDataTable();
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
  }
  pondHandleActivateFile(event: any) {}
  pondHandleRemoveFile(event: any) {}

  get registerFormControl() {
    return this.registerForm.controls;
  }

  initilizeDataTable(): void {
    this.ideaPionnerService
      .getPionnerList()
      .subscribe((response: ResponseResult) => {
        // ////console.log(response.data, 'Data Table values');
        ////console.log(response.data);
        console.log(response, 'response');
        this.ideaPioneerList = response.data;

        // ////console.log(this.partnerList, 'List Data');

        setTimeout(() => {
          $('#ideaPionnerDataTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            data: this.ideaPioneerList,
            columns: [
              { data: 'id' },
              {
                data: 'titleEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },
              {
                data: 'titleAr', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },

              {
                data: 'nameEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },
              {
                data: 'nameAr', //(row: any) => this.getDepartmentName(row.requestModel.sID),
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
            `,
              },
            ],
            rowCallback: (row: Node, data: any, index: number) => {
              const viewIdeaPionnerDetails = $('button:first', row);
              const editIdeaPionner = $('button:eq(1)', row);
              const deleteIdeaPionner = $('button:last', row);
              // Attach click event handlers to the buttons
              viewIdeaPionnerDetails.on('click', () => {
                this.viewideaPionnerDetails(data.id, this.templateDetails);
              });

              editIdeaPionner.on('click', () => {
                this.editideaPionnerDetails(data.id, this.template);
              });

              deleteIdeaPionner.on('click', () => {
                this.deleteIdeaPionner(data.id);
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
    this.ideaPionnerService.addPionner(this.ideaPionnerModel).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          this.modalRef?.hide();
          this.tosterService.success(response.message);
          this.reInitilizeDataTable();
          this.file = undefined;
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
      this.updateideaPionner();
    }
  }

  updateideaPionner() {
    this.ideaPionnerService.updatePionner(this.ideaPionnerModel).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          this.modalRef?.hide();
          this.tosterService.success(response.message);
          this.reInitilizeDataTable();
          this.file = undefined;
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  viewideaPionnerDetails(
    id: number,
    templateDetails: TemplateRef<any> | undefined
  ) {
    this.ideaPionnerService.getPionnerDetails(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (templateDetails) {
            this.modalRef = this.modalService.show(templateDetails, {
              class: 'gray modal-lg',
            });
          } else {
            console.error('Template is undefined');
          }
          this.ideaPionnerModel = response.data;
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  editideaPionnerDetails(id: number, template: TemplateRef<any> | undefined) {
    this.ideaPionnerService.getPionnerDetails(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (template) {
            this.ideaPionnerModel = response.data;
            if (
              this.ideaPionnerModel.imageUrlView != null &&
              this.ideaPionnerModel.imageUrlView != ''
            )
              this.pondFiles = [
                {
                  source: this.ideaPionnerModel.imageUrlView,
                  options: {
                    type: 'local',
                  },
                },
              ];

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

  deleteIdeaPionner(id: number) {
    this.ideaPionnerService.deletePionner(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          this.tosterService.success(response.message);
          this.reInitilizeDataTable();
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  reInitilizeDataTable(): void {
    // Data reload function
    const datatable: any = $('#ideaPionnerDataTable').DataTable();
    this.ideaPionnerService
      .getPionnerList()
      .subscribe((response: ResponseResult) => {
        // ////console.log(response.data, 'Data Table values');
        console.log(response, 'response');
        this.ideaPioneerList = response.data;
        // Datatable reloading
        datatable.destroy();
        setTimeout(() => {
          $('#ideaPionnerDataTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            data: this.ideaPioneerList,
            columns: [
              { data: 'id' },
              {
                data: 'titleEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },
              {
                data: 'titleAr', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },

              {
                data: 'nameEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },
              {
                data: 'nameAr', //(row: any) => this.getDepartmentName(row.requestModel.sID),
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
            (click)="editpartnerDetails(id, template)"
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
              const viewIdeaPionnerDetails = $('button:first', row);
              const editIdeaPionner = $('button:eq(1)', row);
              const deleteIdeaPionner = $('button:last', row);
              // Attach click event handlers to the buttons
              viewIdeaPionnerDetails.on('click', () => {
                this.viewideaPionnerDetails(data.id, this.templateDetails);
              });

              editIdeaPionner.on('click', () => {
                this.editideaPionnerDetails(data.id, this.template);
              });

              deleteIdeaPionner.on('click', () => {
                this.deleteIdeaPionner(data.id);
              });

              return row;
            },

            lengthMenu: [5, 10, 25],
          });
        }, 1);
      });
  }

  openModal(template: TemplateRef<void>) {
    this.ideaPionnerModel = {
      id: 0,
      descriptionEn: '',
      descriptionAr: '',
      imageUrl: '',
      imageUrlView: '',
      url: '',
    };
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg' })
    );
  }

  OpenPointsModel(templatePoints: TemplateRef<void>) {
    this.ideaPionnerPointsModel = {
      id: 0,
      textEn: '',
      textAr: '',
    };
    this.modalRef = this.modalService.show(
      templatePoints,
      Object.assign({}, { class: 'modal-lg' })
    );

    this.ideaPionnerService.getPionnerPointsList().subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success) {
          this.ideaPionnerPointsListModel = response.data;
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  upload(file: File | undefined, type: number): void {
    this.progress = 0;

    if (file) {
      this.currentFile = file;

      this.uploadService
        .upload(this.currentFile, 'pionner')
        .pipe(
          finalize(() => {
            if (this.attachmentList.length > 0) {
              this.ideaPionnerModel.url = this.attachmentList[0].imageUrl;
              if (type == 0) {
                this.addWithFile();
              } else {
                this.updateideaPionner();
              }
            } else {
              if (type == 0) {
                this.addWithFile();
              } else {
                this.updateideaPionner();
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

  removeImage() {
    if (this.ideaPionnerModel) {
      this.ideaPionnerModel.url = '';
    }
  }
  addPoints(): void {
    if (
      this.ideaPionnerPointsModel?.textEn?.trim() !== '' ||
      (this.ideaPionnerPointsModel?.textAr?.trim() !== '' &&
        this.ideaPionnerPointsModel != null)
    ) {
      if (this.ideaPionnerPointsModel != null)
        this.ideaPionnerPointsModel.id = 0;
      this.ideaPionnerPointsListModel?.push(this.ideaPionnerPointsModel);

      this.ideaPionnerPointsModel = {
        textEn: '',
        textAr: '',
        id: 0,
      };
    }
  }

  removePoints(index: number): void {
    this.ideaPionnerPointsListModel?.splice(index, 1);
  }

  savePoinets() {
    this.ideaPionnerService
      .addPionnerPoints(this.ideaPionnerPointsListModel)
      .subscribe({
        next: (response: ResponseResult) => {
          if (
            response.statusCode == StatusCodes.success ||
            StatusCodes.update
          ) {
            this.tosterService.success(response.message);
            this.modalRef?.hide();
          } else {
            this.tosterService.error(response.message);
          }
        },
      });
  }
}
