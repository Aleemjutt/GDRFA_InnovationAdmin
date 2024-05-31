import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FilePondModule } from 'ngx-filepond';
import { ToastrService } from 'ngx-toastr';
import { ArchivesModel } from 'src/app/_models/About/archivesModel';
import { ResponseResult } from 'src/app/_models/responseResult';
import { ArchivesService } from 'src/app/_services/_about/archives.service';

@Component({
  selector: 'app-archives-lists',
  standalone: true,
  imports: [FormsModule, FilePondModule, CommonModule, TranslateModule],
  templateUrl: './archives-lists.component.html',
  styleUrl: './archives-lists.component.css',
})
export class ArchivesListsComponent {
  archivesList: ArchivesModel[] = [];
  // archivesModel: archivesModel | undefined = undefined;

  @ViewChild('template') template: TemplateRef<any> | undefined;
  @ViewChild('templateDetails') templateDetails: TemplateRef<any> | undefined;
  registerForm!: FormGroup;
  archivesModel: any;
  modalRef?: BsModalRef;
  fb: any;
  progress: number | undefined;

  message: any;

  constructor(
    private tosterService: ToastrService,
    private modalService: BsModalService,
    private archivesService: ArchivesService
  ) {}
  ngOnInit(): void {
    this.initilizeDataTable();
  }

  pondHandleActivateFile(event: any) {}
  pondHandleRemoveFile(event: any) {}

  get registerFormControl() {
    return this.registerForm.controls;
  }

  initilizeDataTable(): void {
    this.archivesService
      .getArchivesList()
      .subscribe((response: ResponseResult) => {
        // ////console.log(response.data, 'Data Table values');
        ////console.log(response.data);
        console.log(response, 'response');
        this.archivesList = response.data;

        // ////console.log(this.archivesList, 'List Data');

        setTimeout(() => {
          $('#archivesDataTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            data: this.archivesList,
            columns: [
              { data: 'id' },
              {
                data: 'titleEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },
              {
                data: 'descriptionEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },
              {
                data: 'titleAr', //(row: any) => this.getDepartmentName(row.requestModel.sID),
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
              (click)="viewarchivesDetails()"
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
            (click)="editarchives(id, template)"
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
                (click)="deletearchives(id)"
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
              const viewarchivesDetails = $('button:first', row);
              const editarchives = $('button:eq(1)', row);
              const deletearchives = $('button:last', row);
              // Attach click event handlers to the buttons
              viewarchivesDetails.on('click', () => {
                this.viewarchivesDetails(data.id, this.templateDetails);
              });

              editarchives.on('click', () => {
                this.editarchivesDetails(data.id, this.template);
              });

              deletearchives.on('click', () => {
                this.deletearchives(data.id);
              });

              return row;
            },

            lengthMenu: [5, 10, 25],
          });
        }, 1);
      });
  }

  add() {
    this.archivesService.addArchives(this.archivesModel).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          this.modalRef?.hide();
          this.tosterService.success(response.message);
          this.reInitilizeDataTable();
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  update() {
    this.archivesService.updateArchives(this.archivesModel).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          this.modalRef?.hide();
          this.tosterService.success(response.message);
          this.reInitilizeDataTable();
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  viewarchivesDetails(
    id: number,
    templateDetails: TemplateRef<any> | undefined
  ) {
    this.archivesService.getArchivesDetails(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (templateDetails) {
            this.modalRef = this.modalService.show(templateDetails, {
              class: 'gray modal-lg',
            });
          } else {
            console.error('Template is undefined');
          }
          this.archivesModel = response.data;
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  editarchivesDetails(id: number, template: TemplateRef<any> | undefined) {
    this.archivesService.getArchivesDetails(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (template) {
            this.archivesModel = response.data;

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

  deletearchives(id: number) {
    this.archivesService.deleteArchives(id).subscribe({
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
    const datatable: any = $('#archivesDataTable').DataTable();
    this.archivesService
      .getArchivesList()
      .subscribe((response: ResponseResult) => {
        // ////console.log(response.data, 'Data Table values');
        console.log(response, 'response');
        this.archivesList = response.data;
        // Datatable reloading
        datatable.destroy();
        setTimeout(() => {
          $('#archivesDataTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            data: this.archivesList,
            columns: [
              { data: 'id' },
              {
                data: 'titleEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },
              {
                data: 'descriptionEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },
              {
                data: 'titleAr', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },
              {
                data: 'descriptionAr', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },
              // {
              //   title: this.translateService.instant('Status'),
              //   data: (row: any) => this.getStatus(row.saveType),
              // },
              // {
              //   data: 'id',
              //   render: (id: any) => `
              //     <a  routerLink="/archives/${id}/view" class="btn btn-info">View</a>
              //     <a href="#" [routerLink]="['/archives/', ${id}, 'edit']" class="btn btn-primary">Edit</a>

              //   `,
              // },

              {
                data: 'data',
                defaultContent: `
              <button
              type="button"
              class="btn btn-light mr-1"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              (click)="viewarchivesDetails()"
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
            (click)="editarchivesDetails(id, template)"
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
                (click)="deletearchives(id)"
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
              const viewarchivesDetails = $('button:first', row);
              const editarchives = $('button:eq(1)', row);
              const deletearchives = $('button:last', row);
              // Attach click event handlers to the buttons
              viewarchivesDetails.on('click', () => {
                this.viewarchivesDetails(data.id, this.templateDetails);
              });

              editarchives.on('click', () => {
                this.editarchivesDetails(data.id, this.template);
              });

              deletearchives.on('click', () => {
                this.deletearchives(data.id);
              });

              return row;
            },

            lengthMenu: [5, 10, 25],
          });
        }, 1);
      });
  }

  openModal(template: TemplateRef<void>) {
    this.archivesModel = {
      id: 0,
      descriptionEn: '',
      descriptionAr: '',
      imageUrl: '',
      imageUrlView: '',
    };
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg' })
    );
  }
}
