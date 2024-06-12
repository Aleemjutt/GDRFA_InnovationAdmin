import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription, retry } from 'rxjs';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import {
  EstablishingDubaiForTheFutureDetailModel,
  EstablishingDubaiForTheFutureModel,
  RequirmentsHeadingPointModel,
  RequirmentsPointsModel,
} from 'src/app/_models/FutureFocused/futureFocused';
import { ResponseResult, StatusCodes } from 'src/app/_models/responseResult';
import { DubaiResidencayService } from 'src/app/_services/_futureFocused/dubai-residencay.service';
import { FutureFocusedService } from 'src/app/_services/_futureFocused/future-focused.service';

@Component({
  selector: 'app-estabishing-dubai-future-list',
  standalone: true,
  imports: [FormsModule, CommonModule, AccordionModule, TranslateModule],
  templateUrl: './estabishing-dubai-future-list.component.html',
  styleUrl: './estabishing-dubai-future-list.component.css',
})
export class EstabishingDubaiFutureListComponent {
  @ViewChild('template') template: TemplateRef<any> | undefined;
  @ViewChild('templateDetails') templateDetails: TemplateRef<any> | undefined;
  oneAtATime: any = true;
  modalRef?: BsModalRef;
  establishingDubaiForTheFutureModel: any;
  establishingDubaiForTheFutureDetailModel: any;
  requirmentsHeadingPointModel: any;
  requirmentsPointsModel: any;
  establishingDubaiForTheFutureModels: EstablishingDubaiForTheFutureModel[] =
    [];
  establishingDubaiForTheFutureDetailModels: EstablishingDubaiForTheFutureDetailModel[] =
    [];
  requirmentsHeadingPointModels: RequirmentsHeadingPointModel[] = [];
  requirmentsPointsModels: RequirmentsPointsModel[] = [];
  private languageChangeSubscription!: Subscription;
  constructor(
    public globalService: GlobalServiceService,
    private tosterService: ToastrService,
    private futureFocusedService: FutureFocusedService,
    private modalService: BsModalService,
    private router: Router
  ) {
    this.establishingDubaiForTheFutureModel = {
      id: 0,
      descriptionEn: '',
      descriptionAr: '',
      establishingDubaiForTheFutureDetailModels: [],
    };
    this.establishingDubaiForTheFutureDetailModel = {
      id: 0,
      descriptionEn: '',
      descriptionAr: '',
      establishingDubaiForTheFutureId: 0,
      requirmentsHeadingPointModels: [],
      requirmentsPointsModels: [],
    };
    this.requirmentsHeadingPointModel = {
      id: 0,
      textEn: '',
      textAr: '',
      establishingDubaiForTheFutureDetailId: 0,
    };
    this.requirmentsPointsModel = {
      id: 0,
      textEn: '',
      textAr: '',
      establishingDubaiForTheFutureDetailId: 0,
    };
  }

  initForm() {
    this.establishingDubaiForTheFutureModel = {
      id: 0,
      descriptionEn: '',
      descriptionAr: '',
      establishingDubaiForTheFutureDetailModels: [],
    };
    this.establishingDubaiForTheFutureDetailModel = {
      id: 0,
      descriptionEn: '',
      descriptionAr: '',
      establishingDubaiForTheFutureId: 0,
      requirmentsHeadingPointModels: [],
      requirmentsPointsModels: [],
    };
    this.requirmentsHeadingPointModel = {
      id: 0,
      textEn: '',
      textAr: '',
      establishingDubaiForTheFutureDetailId: 0,
    };
    this.requirmentsPointsModel = {
      id: 0,
      textEn: '',
      textAr: '',
      establishingDubaiForTheFutureDetailId: 0,
    };

    this.establishingDubaiForTheFutureDetailModels = [];
    this.languageChangeSubscription = new Subscription();
  }

  ngOnInit(): void {
    //this.initializeDataTable();
    this.languageChangeSubscription =
      this.globalService.languageChange$.subscribe((lang) => {
        // Update the ng-select label property when the language changes
        this.initilizeDataTable();
      });
  }
  openModal(template: TemplateRef<void>) {
    this.initForm();
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg' })
    );
  }

  initilizeDataTable(): void {
    const currentLang = this.globalService.getCurrentLanguage();
    const languageConfig =
      currentLang === 'ar'
        ? this.globalService.getArabicLanguageConfig()
        : this.globalService.getEnglishLanguageConfig();
    const datatable: any = $('#awardsDataTable').DataTable();
    this.futureFocusedService
      .getList()
      .subscribe((response: ResponseResult) => {
        // ////console.log(response.data, 'Data Table values');
        console.log(response, 'response');
        this.establishingDubaiForTheFutureModels = response.data;
        // Datatable reloading
        datatable.destroy();

        setTimeout(() => {
          $('#awardsDataTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            data: this.establishingDubaiForTheFutureModels,
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
                data: (row: any) =>
                  this.globalService.getStatusName(row.status),
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
              const viewpartnerDetails = $('button:first', row);
              const editpartner = $('button:eq(1)', row);
              const deletepartner = $('button:eq(2)', row);
              const viewSubmitionDetails = $('button:last', row);
              // Attach click event handlers to the buttons
              viewpartnerDetails.on('click', () => {
                this.viewChallengedDetails(data.id, this.templateDetails);
              });

              editpartner.on('click', () => {
                this.editChallenged(data.id, this.template);
              });

              deletepartner.on('click', () => {
                this.deleteChallenged(data.id);
              });

              viewSubmitionDetails.on('click', () => {
                this.router.navigateByUrl('/establisehdAnswerlist/' + data.id);
              });

              return row;
            },

            lengthMenu: [5, 10, 25],
          });
        }, 1);
      });
  }
  addChallenged() {
    this.establishingDubaiForTheFutureModel.establishingDubaiForTheFutureDetailModels =
      this.establishingDubaiForTheFutureDetailModels;
    this.futureFocusedService
      .add(this.establishingDubaiForTheFutureModel)
      .subscribe({
        next: (response: ResponseResult) => {
          if (response.statusCode == StatusCodes.success) {
            this.tosterService.success(response.message);
            this.modalRef?.hide();

            this.initForm();
            this.initilizeDataTable();
          } else {
            this.tosterService.error(response.message);
          }
        },
      });
  }
  updateChallenged() {
    this.establishingDubaiForTheFutureModel.establishingDubaiForTheFutureDetailModels =
      this.establishingDubaiForTheFutureDetailModels;
    this.futureFocusedService
      .update(this.establishingDubaiForTheFutureModel)
      .subscribe({
        next: (response: ResponseResult) => {
          if (response.statusCode == StatusCodes.success) {
            this.tosterService.success(response.message);
            this.initForm();
            this.modalRef?.hide();
            this.initilizeDataTable();
          } else {
            this.tosterService.error(response.message);
          }
        },
      });
  }

  viewChallengedDetails(id: number, template: TemplateRef<any> | undefined) {
    if (!template) {
      return;
    }
    this.futureFocusedService.getDetails(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success) {
          this.establishingDubaiForTheFutureModel = response.data;

          this.establishingDubaiForTheFutureDetailModels =
            this.establishingDubaiForTheFutureModel.establishingDubaiForTheFutureDetailModels;

          this.modalRef = this.modalService.show(template, {
            class: 'gray modal-lg',
          });
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  editChallenged(id: number, template: TemplateRef<any> | undefined) {
    if (!template) {
      // Handle the case where template is undefined, perhaps by throwing an error or logging a message
      return;
    }
    this.establishingDubaiForTheFutureModel = {
      id: 0,
      descriptionEn: '',
      descriptionAr: '',
      establishingDubaiForTheFutureDetailModels: [],
    };
    this.futureFocusedService.getDetails(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success) {
          this.establishingDubaiForTheFutureModel = response.data;

          this.establishingDubaiForTheFutureDetailModels =
            this.establishingDubaiForTheFutureModel.establishingDubaiForTheFutureDetailModels;

          this.modalRef = this.modalService.show(template, {
            class: 'gray modal-lg',
          });
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  deleteChallenged(id: any) {}

  addChallengedDetail(): void {
    if (
      this.establishingDubaiForTheFutureDetailModel?.descriptionEn?.trim() !==
        '' ||
      (this.establishingDubaiForTheFutureDetailModel?.descriptionEn?.trim() !==
        '' &&
        this.establishingDubaiForTheFutureDetailModels != null)
    ) {
      if (this.establishingDubaiForTheFutureDetailModels != null)
        this.establishingDubaiForTheFutureDetailModel.requirmentsHeadingPointModels =
          this.requirmentsHeadingPointModels;
      this.establishingDubaiForTheFutureDetailModel.requirmentsPointsModels =
        this.requirmentsPointsModels;
      this.establishingDubaiForTheFutureDetailModels?.push(
        this.establishingDubaiForTheFutureDetailModel
      );

      this.requirmentsHeadingPointModels = [];
      this.requirmentsPointsModels = [];

      this.establishingDubaiForTheFutureDetailModel = {
        id: 0,
        descriptionEn: '',
        descriptionAr: '',
        establishingDubaiForTheFutureId: 0,
        requirmentsHeadingPointModels: [],
        requirmentsPointsModels: [],
      };
    }
  }

  removeFutureDetailItem(index: number): void {
    this.establishingDubaiForTheFutureDetailModels?.splice(index, 1);
  }

  requirmentsHeadingPointItem(index: number): void {
    this.requirmentsHeadingPointModels?.splice(index, 1);
  }

  requirmentsHeadingPointDetails(index: number): void {
    this.requirmentsPointsModels?.splice(index, 1);
  }

  addRequirmentHeadingPoint(): void {
    if (
      this.requirmentsHeadingPointModel?.textEn?.trim() !== '' ||
      (this.requirmentsHeadingPointModel?.textAr?.trim() !== '' &&
        this.requirmentsHeadingPointModels != null)
    ) {
      if (this.requirmentsHeadingPointModels != null)
        this.requirmentsHeadingPointModels?.push(
          this.requirmentsHeadingPointModel
        );

      this.requirmentsHeadingPointModel = {
        textAr: '',
        textEn: '',
        establishingDubaiForTheFutureDetailId: 0,
        id: 0,
      };
    }
  }

  addRequirmentPoint(): void {
    if (
      this.requirmentsPointsModel?.textEn?.trim() !== '' ||
      (this.requirmentsPointsModel?.textAr?.trim() !== '' &&
        this.requirmentsPointsModels != null)
    ) {
      if (this.requirmentsPointsModels != null)
        this.requirmentsPointsModels?.push(this.requirmentsPointsModel);

      this.requirmentsPointsModel = {
        textAr: '',
        textEn: '',
        establishingDubaiForTheFutureDetailId: 0,
        id: 0,
      };
    }
  }

  editItem(residenacy: any, index: number) {
    // Check if the array is valid and index is within bounds
    if (
      this.establishingDubaiForTheFutureDetailModels &&
      index >= 0 &&
      index < this.establishingDubaiForTheFutureDetailModels.length
    ) {
      // Access the item at the specified index
      this.establishingDubaiForTheFutureDetailModel =
        this.establishingDubaiForTheFutureDetailModels[index];

      this.requirmentsHeadingPointModels =
        this.establishingDubaiForTheFutureDetailModel.requirmentsHeadingPointModels;
      this.requirmentsPointsModels =
        this.establishingDubaiForTheFutureDetailModel.requirmentsPointsModels;
      this.establishingDubaiForTheFutureDetailModels?.splice(index, 1);
    }
  }

  deleteItem(residenacy: any, index: number) {
    this.establishingDubaiForTheFutureDetailModels?.splice(index, 1);
  }
}
