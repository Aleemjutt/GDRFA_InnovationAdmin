import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FilePondOptions } from 'filepond';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, TimeoutError, finalize } from 'rxjs';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { ResponseResult, StatusCodes } from 'src/app/_models/responseResult';
import { UserService } from 'src/app/_services/_users/user.service';
import { UploadServiceService } from 'src/app/_services/upload-service.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent {
  modalRef: any;

  @ViewChild('template') template: TemplateRef<any> | undefined;
  @ViewChild('templateDetails') templateDetails: TemplateRef<any> | undefined;
  userModels: any;
  userModel: any;
  private datatable: any;

  fb: any;
  progress: number | undefined;
  currentFile: File | undefined;
  message: any;
  selectedFiles?: FileList;
  attachmentList: any = [];
  fileInfos?: Observable<any>;
  file: File | undefined;
  attachment: any;
  pondFiles: FilePondOptions['files'] = [];

  constructor(
    private modalService: BsModalService,
    public globalService: GlobalServiceService,
    private tosterService: ToastrService,
    private userService: UserService,
    private uploadService: UploadServiceService
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
  openModal(templete: TemplateRef<any> | undefined) {
    if (!templete) {
      return;
    }
    this.userModel = {
      id: 0,
      firstName: '',
      lastName: null,
      userName: null,
      email: null,
      password: null,
      mobileNumber: '',
      confirmPassword: null,
      token: null,
      expireDateTimeString: null,
      refreshToken: '',
      userStatus: false,
      roleId: null,
      url: '',
      urlBase64: '',
    };
    this.modalRef = this.modalService.show(
      templete,
      Object.assign({}, { class: 'modal-lg' })
    );
  }
  initilizeDataTable(): void {
    //const datatable: any = $('#consultingRequestDataTable').DataTable();
    const currentLang = this.globalService.getCurrentLanguage();
    const languageConfig =
      currentLang === 'ar'
        ? this.globalService.getArabicLanguageConfig()
        : this.globalService.getEnglishLanguageConfig();
    this.datatable = $('#usersDataTable').DataTable();
    if (this.datatable != null && this.datatable != undefined) {
      this.datatable.destroy();
      this.datatable = null;
    }
    this.userService.getList().subscribe((response: ResponseResult) => {
      // ////console.log(response.data, 'Data Table values');
      ////console.log(response.data);
      console.log(response, 'response');
      if (response.statusCode == 0) {
        this.userModels = response.data;
      }
      // ////console.log(this.partnerList, 'List Data');

      setTimeout(() => {
        $('#usersDataTable').DataTable({
          pagingType: 'full_numbers',
          pageLength: 5,
          processing: true,
          data: this.userModels,
          language: languageConfig,
          columns: [
            { data: 'id' },
            {
              data: 'titleEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
            },

            {
              data: 'firstNameEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
            },
            {
              data: 'lastNameEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
            },
            {
              data: 'email', //(row: any) => this.getDepartmentName(row.requestModel.sID),
            },

            {
              data: function (row: any) {
                if (row.userStatus === true) {
                  return (
                    '<span style="color:green;font-weight: 600">' +
                    'Active' +
                    '</span>'
                  );
                } else {
                  return (
                    '<span style="color:red;font-weight: 600">' +
                    'In-Active' +
                    '</span>'
                  );
                }

                return '';
              },
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
            const viewpartnerDetails = $('button:first', row);
            const editpartner = $('button:eq(1)', row);
            const deleteUser = $('button:last', row);
            // Attach click event handlers to the buttons
            viewpartnerDetails.on('click', () => {
              this.viewDetails(data.id, this.templateDetails);
            });

            editpartner.on('click', () => {
              this.edit(data.id, this.template);
            });

            deleteUser.on('click', () => {
              this.deleteUser(data.id);
            });

            return row;
          },

          lengthMenu: [5, 10, 25],
        });
      }, 1);
    });
  }

  viewDetails(id: number, template: TemplateRef<any> | undefined) {
    this.userService.getUserDetails(id).subscribe({
      next: (ressponse: ResponseResult) => {
        if (ressponse.statusCode == StatusCodes.success) {
          this.openModal(template);
          this.userModel = ressponse.data;
        } else {
          this.tosterService.error(ressponse.message);
        }
      },
    });
  }
  edit(id: number, template: TemplateRef<any> | undefined) {
    this.viewDetails(id, template);
  }

  add() {
    if (this.file != null) {
      this.upload(this.file, 0);
    } else {
      // Handle the case where no file is selected.
      this.addWithFile();
    }
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success || StatusCodes.deleted) {
          this.tosterService.success(response.message);
          this.initilizeDataTable();
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }
  addWithFile() {
    // if (this.userModel.password == '') {
    //   this.userModel.password = '123';
    //   this.userModel.confirmPassword = '123';
    // }

    // if (this.userModel.confirmPassword == '') {
    //   this.userModel.password = '123';
    //   this.userModel.confirmPassword = '123';
    // }

    this.userService.addUser(this.userModel).subscribe({
      next: (response: ResponseResult) => {
        if (
          response.statusCode == StatusCodes.success ||
          response.statusCode == StatusCodes.update
        ) {
          this.modalRef?.hide();
          this.tosterService.success(response.message);
          this.initilizeDataTable();
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
      this.addWithFile();
    }
  }

  upload(file: File | undefined, type: number): void {
    this.progress = 0;

    if (file) {
      this.currentFile = file;

      this.uploadService
        .upload(this.currentFile, 'users')
        .pipe(
          finalize(() => {
            this.userModel.url = this.attachmentList[0].imageUrl;

            this.addWithFile();
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
    if (this.userModel) {
      this.userModel.url = '';
    }
  }
}
