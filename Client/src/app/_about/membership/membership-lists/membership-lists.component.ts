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
import { MembershipsModel } from 'src/app/_models/About/membership';
import { ResponseResult } from 'src/app/_models/responseResult';
import { MembershipService } from 'src/app/_services/_about/membership.service';
import { UploadServiceService } from 'src/app/_services/upload-service.service';

@Component({
  selector: 'app-membership-lists',
  standalone: true,
  imports: [FormsModule, CommonModule, FilePondModule, TranslateModule],
  templateUrl: './membership-lists.component.html',
  styleUrl: './membership-lists.component.css',
})
export class MembershipListsComponent implements OnInit {
  membershipList: MembershipsModel[] = [];
  membership: MembershipsModel | undefined = undefined;

  @ViewChild('template') template: TemplateRef<any> | undefined;
  @ViewChild('templateDetails') templateDetails: TemplateRef<any> | undefined;
  registerForm!: FormGroup;

  membershipModel: any;
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
    private memberService: MembershipService,
    private tosterService: ToastrService,
    private modalService: BsModalService,
    private uploadService: UploadServiceService,
    public globalService: GlobalServiceService
  ) {
    this.languageChangeSubscription = new Subscription();
  }
  ngOnInit(): void {
    // this.registerForm = this.fb.group(
    //   {
    //     descriptionEn: ['', Validators.required],
    //     descriptionAr: ['', Validators.required],
    //     url: [null],
    //email: ['', [Validators.required, Validators.email]],

    // password: [
    //   '',
    //   Validators.compose([
    //     Validators.required,
    //     this.customValidator.patternValidator(),
    //   ]),
    // ],
    // confirmPassword: ['', [Validators.required]],
    //}
    // {
    //   validator: this.customValidator.MatchPassword(
    //     'password',
    //     'confirmPassword'
    //   ),
    // }
    //);

    this.languageChangeSubscription =
      this.globalService.languageChange$.subscribe((lang) => {
        // Update the ng-select label property when the language changes
        this.initilizeDataTable();
      });
  }

  pondOptions: FilePondOptions = {
    allowMultiple: false,
    labelIdle: 'Drop files here...',
    //allo: ['image/jpeg, image/png'],
    //acceptedFileTypes: ['image/jpeg, image/png'],
    allowReorder: true,
  };

  pondFiles: FilePondOptions['files'] = [
    // {
    //   source: 'assets/photo.jpeg',
    //   options: {
    //     type: 'local',
    //   },
    // },
  ];

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

  removeImage() {
    if (this.membershipModel) {
      this.membershipModel.url = '';
    }
  }

  initilizeDataTable(): void {
    const currentLang = this.globalService.getCurrentLanguage();
    const languageConfig =
      currentLang === 'ar'
        ? this.globalService.getArabicLanguageConfig()
        : this.globalService.getEnglishLanguageConfig();

    const datatable: any = $('#membershipDataTable').DataTable();
    this.memberService
      .getMembershipList()
      .subscribe((response: ResponseResult) => {
        // ////console.log(response.data, 'Data Table values');
        console.log(response, 'response');
        this.membershipList = response.data;
        // Datatable reloading
        datatable.destroy();

        setTimeout(() => {
          $('#membershipDataTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            data: this.membershipList,
            language: languageConfig,
            columns: [
              { data: 'id' },
              {
                data: 'descriptionEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
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
              (click)="viewMembershipDetails(request.id, operationViewTemplate)"
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
            (click)="editMembership(id, template)"
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
                (click)="deleteMembership(id)"
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
              const viewMembershipDetails = $('button:first', row);
              const editMembership = $('button:eq(1)', row);
              const deleteMembership = $('button:last', row);
              // Attach click event handlers to the buttons
              viewMembershipDetails.on('click', () => {
                this.viewMembershipDetails(data.id, this.templateDetails);
              });

              editMembership.on('click', () => {
                this.editMembershipDetails(data.id, this.template);
              });

              deleteMembership.on('click', () => {
                this.deleteMembership(data.id);
              });

              return row;
            },

            lengthMenu: [5, 10, 25],
          });
        }, 1);
      });
  }
  addMembership() {
    if (this.file != null) {
      this.upload(this.file, 0);
    } else {
      // Handle the case where no file is selected.
      this.addMembershipSave();
    }
  }

  addMembershipSave() {
    // if (this.file != null) {
    //   this.upload(this.file);

    //   if (this.membershipList != null && this.membershipList.length > 0) {
    //     this.membershipModel.url = this.attachmentList[0].url;
    //   }
    // }
    this.memberService.addMembership(this.membershipModel).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          this.modalRef?.hide();
          this.tosterService.success(response.message);
          this.file = undefined;
          this.initilizeDataTable();
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
      this.updateMembership();
    }
  }
  updateMembership() {
    this.memberService.updateMembership(this.membershipModel).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          this.modalRef?.hide();
          this.tosterService.success(response.message);
          this.file = undefined;
          this.initilizeDataTable();
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  viewMembershipDetails(
    id: number,
    templateDetails: TemplateRef<any> | undefined
  ) {
    this.memberService.getMembershipDetails(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (templateDetails) {
            this.modalRef = this.modalService.show(templateDetails, {
              class: 'gray modal-lg',
            });
          } else {
            console.error('Template is undefined');
          }
          this.membershipModel = response.data;
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  editMembershipDetails(id: number, template: TemplateRef<any> | undefined) {
    this.memberService.getMembershipDetails(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (template) {
            this.membershipModel = response.data;
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
  deleteMembership(id: number) {
    this.memberService.deleteMembership(id).subscribe({
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

  // reInitilizeDataTable(): void {
  //   // Data reload function
  //   const datatable: any = $('#membershipDataTable').DataTable();
  //   this.memberService
  //     .getMembershipList()
  //     .subscribe((response: ResponseResult) => {
  //       // ////console.log(response.data, 'Data Table values');
  //       console.log(response, 'response');
  //       this.membershipList = response.data;
  //       // Datatable reloading
  //       datatable.destroy();
  //       setTimeout(() => {
  //         $('#membershipDataTable').DataTable({
  //           pagingType: 'full_numbers',
  //           pageLength: 5,
  //           processing: true,
  //           data: this.membershipList,
  //           columns: [
  //             { data: 'id' },
  //             {
  //               data: 'descriptionEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
  //             },
  //             {
  //               data: 'descriptionAr', //(row: any) => this.getDepartmentName(row.requestModel.sID),
  //             },
  //             // {
  //             //   title: this.translateService.instant('Status'),
  //             //   data: (row: any) => this.getStatus(row.saveType),
  //             // },
  //             // {
  //             //   data: 'id',
  //             //   render: (id: any) => `
  //             //     <a  routerLink="/membership/${id}/view" class="btn btn-info">View</a>
  //             //     <a href="#" [routerLink]="['/membership/', ${id}, 'edit']" class="btn btn-primary">Edit</a>

  //             //   `,
  //             // },

  //             {
  //               data: 'data',
  //               defaultContent: `
  //             <button
  //             type="button"
  //             class="btn btn-light mr-1"
  //             data-bs-toggle="modal"
  //             data-bs-target="#exampleModal"
  //             (click)="viewMembershipDetails(request.id, operationViewTemplate)"
  //             data-backdrop="static"
  //             data-keyboard="false"
  //           >
  //           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
  //           <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
  //           <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
  //           </svg>
  //           </button>

  //           <button
  //           type="button"
  //           class="btn btn-light mr-1"
  //           data-bs-toggle="modal"
  //           data-bs-target="#exampleModal"
  //           (click)="editMembershipDetails(id, template)"
  //           data-backdrop="static"
  //           data-keyboard="false"
  //         >
  //           <svg
  //             width="1em"
  //             height="1em"
  //             viewBox="0 0 16 16"
  //             class="bi bi-pencil-square"
  //             fill="currentColor"
  //             xmlns="http://www.w3.org/2000/svg"
  //           >
  //             <path
  //               d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
  //             />
  //             <path
  //               fill-rule="evenodd"
  //               d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
  //             />
  //           </svg>
  //         </button>

  //           <button
  //               type="button"
  //               class="btn btn-outline-danger  mr-1 "
  //               data-bs-toggle="modal"
  //               data-bs-target="#exampleModal"
  //               (click)="deleteMembership(id)"
  //               data-backdrop="static"
  //               data-keyboard="false"
  //             >
  //             <svg
  //             width="1em"
  //             height="1em"
  //             viewBox="0 0 16 16"
  //             class="bi bi-trash-fill"
  //             fill="currentColor"
  //             xmlns="http://www.w3.org/2000/svg"
  //           >
  //             <path
  //               fill-rule="evenodd"
  //               d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"
  //             />
  //           </svg>
  //             </button>
  //           `,
  //             },
  //           ],
  //           rowCallback: (row: Node, data: any, index: number) => {
  //             const viewMembershipDetails = $('button:first', row);
  //             const editMembership = $('button:eq(1)', row);
  //             const deleteMembership = $('button:last', row);
  //             // Attach click event handlers to the buttons
  //             viewMembershipDetails.on('click', () => {
  //               this.viewMembershipDetails(data.id, this.templateDetails);
  //             });

  //             editMembership.on('click', () => {
  //               this.editMembershipDetails(data.id, this.template);
  //             });

  //             deleteMembership.on('click', () => {
  //               this.deleteMembership(data.id);
  //             });

  //             return row;
  //           },

  //           lengthMenu: [5, 10, 25],
  //         });
  //       }, 1);
  //     });
  // }

  openModal(template: TemplateRef<void>) {
    this.membershipModel = {
      id: 0,
      descriptionEn: '',
      descriptionAr: '',
      url: '',
    };
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
        .upload(this.currentFile, 'Membership')
        .pipe(
          finalize(() => {
            if (this.attachmentList.length > 0) {
              if (type == 0) {
                this.membershipModel.url = this.attachmentList[0].url;
                this.addMembershipSave();
              } else {
                this.membershipModel.url = this.attachmentList[0].url;
                this.updateMembership();
              }
            } else {
              if (type == 0) {
                this.addMembershipSave();
              } else {
                this.updateMembership();
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
                  url: attm.url,
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
  // upload(file: File | undefined): void {
  //   this.progress = 0;

  //   //if (this.selectedFiles) {
  //   //const file: File | null = this.selectedFiles.item(0);

  //   if (file) {
  //     this.currentFile = file;

  //     this.uploadService.upload(this.currentFile).subscribe({
  //       next: (event: any) => {
  //         if (event.type === HttpEventType.UploadProgress) {
  //           this.progress = Math.round((100 * event.loaded) / event.total);
  //         } else if (event instanceof HttpResponse) {
  //           this.message = event.body.message;
  //           //this.attachmentList = event.body.data;
  //           console.log(event.body.data, 'response result');
  //           for (let attm of event.body.data as { url: string }[]) {
  //             const attachment = {
  //               url: attm.url,
  //             };
  //             this.attachmentList.push(attachment);
  //           }

  //           this.fileInfos = this.uploadService.getFiles();
  //         }
  //       },
  //       error: (err: any) => {
  //         this.progress = 0;

  //         if (err.error && err.error.message) {
  //           this.message = err.error.message;
  //         } else {
  //           this.message = 'Could not upload the file!';
  //         }

  //         this.currentFile = undefined;
  //       },
  //     });
  //   }

  //   this.selectedFiles = undefined;
  //   // }
  // }
}
