import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  TargetCompainModel,
  TargetCompainsOptionModel,
} from 'src/app/_models/Ideas/ideaTargetModel';
import { ResponseResult, StatusCodes } from 'src/app/_models/responseResult';
import { TargetCompainService } from 'src/app/_services/_Ideas/target-compain.service';
import { NavigationExtras, Route, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
@Component({
  selector: 'app-target-compains-list',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './target-compains-list.component.html',
  styleUrl: './target-compains-list.component.css',
})
export class TargetCompainsListComponent {
  targetCompainList: TargetCompainModel[] = [];
  // targetCompainModel: TargetCompainModel[];
  // targetCompainModel: targetCompainModel | undefined = undefined;
  @ViewChild('template') template: TemplateRef<any> | undefined;
  @ViewChild('templateDetails') templateDetails: TemplateRef<any> | undefined;
  registerForm!: FormGroup;
  targetCompainModel: TargetCompainModel;
  modalRef?: BsModalRef;
  targetCompainsOptionModel: TargetCompainsOptionModel;
  targetCompainsOptionModelList: TargetCompainsOptionModel[] = [];
  constructor(
    private tosterService: ToastrService,
    private modalService: BsModalService,
    private targetCompainService: TargetCompainService,
    private router: Router,
    private globalService: GlobalServiceService
  ) {
    this.targetCompainsOptionModel = {
      id: 0,
      optiontextEn: '',
      optiontextAR: '',
    };
    this.targetCompainModel = {
      id: 0,
      targetCompainTextAr: '',
      targetCompainTextEn: '',
      targetCompainsOptionModels: this.targetCompainsOptionModelList,
      noteEn: '',
      noteAr: '',
      isActiveStatus: false,
    };
  }
  ngOnInit(): void {
    this.initilizeDataTable();
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
    const datatable: any = $('#targetCompainDataTable').DataTable();
    this.targetCompainService
      ._getList()
      .subscribe((response: ResponseResult) => {
        // ////console.log(response.data, 'Data Table values');
        console.log(response, 'response');
        this.targetCompainList = response.data;
        // Datatable reloading
        datatable.destroy();

        setTimeout(() => {
          $('#targetCompainDataTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            data: this.targetCompainList,
            language: languageConfig,
            columns: [
              { data: 'id' },
              {
                data: 'targetCompainTextEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },
              {
                data: 'targetCompainTextAr', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },

              {
                data: 'noteEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },
              {
                data: 'noteAr', //(row: any) => this.getDepartmentName(row.requestModel.sID),
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
              const viewtargetCompainDetails = $('button:first', row);
              const edittargetCompain = $('button:eq(1)', row);
              const deletetargetCompain = $('button:eq(2)', row);
              const showtargetCompainAnswer = $('button:last', row);
              // Attach click event handlers to the buttons
              viewtargetCompainDetails.on('click', () => {
                this.viewtargetCompainDetails(data.id, this.templateDetails);
              });

              edittargetCompain.on('click', () => {
                this.edittargetCompainDetails(data.id, this.template);
              });

              deletetargetCompain.on('click', () => {
                this.deletetargetCompain(data.id);
              });

              showtargetCompainAnswer.on('click', () => {
                this.router.navigateByUrl('/targetCompainAnswer/' + data.id);
              });
              return row;
            },

            lengthMenu: [5, 10, 25],
          });
        }, 1);
      });
  }

  addOption() {
    if (
      this.targetCompainsOptionModel?.optiontextEn?.trim() !== '' ||
      (this.targetCompainsOptionModel?.optiontextAR?.trim() !== '' &&
        this.targetCompainsOptionModel != null)
    ) {
      if (this.targetCompainsOptionModel != null)
        this.targetCompainModel.targetCompainsOptionModels?.push(
          this.targetCompainsOptionModel
        );

      this.targetCompainsOptionModel = {
        id: 0,
        optiontextEn: '',
        optiontextAR: '',
      };
    }
  }

  removeOption(index: number) {
    this.targetCompainModel.targetCompainsOptionModels?.splice(index, 1);
  }
  add() {
    // Handle the case where no file is selected.
    this.targetCompainService._add(this.targetCompainModel).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          this.modalRef?.hide();
          this.tosterService.success(response.message);
          this.initilizeDataTable();
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  update() {
    // Handle the case where no file is selected.
    this.updatetargetCompain();
  }

  updatetargetCompain() {
    this.targetCompainService._update(this.targetCompainModel).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          this.modalRef?.hide();
          this.tosterService.success(response.message);
          this.initilizeDataTable();
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  viewtargetCompainDetails(
    id: number,
    templateDetails: TemplateRef<any> | undefined
  ) {
    this.targetCompainService._getDetails(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (templateDetails) {
            this.modalRef = this.modalService.show(templateDetails, {
              class: 'gray modal-lg',
            });
          } else {
            console.error('Template is undefined');
          }
          this.targetCompainModel = response.data;
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  edittargetCompainDetails(id: number, template: TemplateRef<any> | undefined) {
    this.targetCompainService._getDetails(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (template) {
            this.targetCompainModel = response.data;

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

  deletetargetCompain(id: number) {
    this.targetCompainService._delete(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success) {
          this.tosterService.success(response.message);
          this.initilizeDataTable();
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  openModal(template: TemplateRef<void>) {
    this.targetCompainModel = {
      id: 0,
      targetCompainTextAr: '',
      targetCompainTextEn: '',
      targetCompainsOptionModels: this.targetCompainsOptionModelList,
      noteEn: '',
      noteAr: '',
      isActiveStatus: false,
    };
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg' })
    );
  }
}
