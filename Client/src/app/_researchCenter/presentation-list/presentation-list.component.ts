import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { WorkFlowStatus } from 'src/app/_models/Common/workflowStatus';
import { tblPresentationModel } from 'src/app/_models/ResearchCenter/presentation';
import { ResponseResult } from 'src/app/_models/responseResult';
import { PresentationService } from 'src/app/_services/_researchCenter/presentation.service';
import { FiledownloaderService } from 'src/app/_services/filedownloader.service';

@Component({
  selector: 'app-presentation-list',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './presentation-list.component.html',
  styleUrl: './presentation-list.component.css',
})
export class PresentationListComponent {
  modalRef?: BsModalRef;
  sectorList: any[] = [];
  administrationList: any[] = [];
  presentationModelList: tblPresentationModel[] = [];
  bindLableSector: string;
  bindLableAdministration: string;
  presentationModel: tblPresentationModel | null = null;
  @ViewChild('template') template: TemplateRef<any> | undefined;
  @ViewChild('templateDetails') templateDetails: TemplateRef<any> | undefined;

  private datatable: any;
  private languageChangeSubscription!: Subscription;
  searchLabel: string = 'Search:';
  constructor(
    private presentationService: PresentationService,
    private modalService: BsModalService,
    public globalService: GlobalServiceService,
    private tosterService: ToastrService,
    private downloadService: FiledownloaderService
  ) {
    this.bindLableSector = '';
    this.bindLableAdministration = '';
    this.languageChangeSubscription = new Subscription();
  }

  ngOnInit(): void {
    //  this.initilizeDataTable();
    this.languageChangeSubscription =
      this.globalService.languageChange$.subscribe((lang) => {
        this.updateBindLabelDepartment(lang);
      });
  }

  private updateBindLabelDepartment(lang: string): void {
    this.bindLableSector = this.getLabelPropertySector(lang);

    // You might need to recreate or refresh the ng-select component here

    //this.getDepartments();
    //this.getKIPProcessesList();

    this.searchLabel = lang === 'en' ? 'Search:' : 'بحث:';
    // Use a timeout to allow Angular to detect changes and refresh the ng-select component
    setTimeout(() => {
      // Refresh the ng-select component
      this.initilizeDataTable();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.languageChangeSubscription.unsubscribe();
  }

  getLabelPropertySector(lang: string): string {
    return this.globalService.getCurrentLanguage() === 'en'
      ? 'orgEName'
      : 'orgAName';
  }

  getLabelPropertyAdministration(lang: string): string {
    return this.globalService.getCurrentLanguage() === 'en'
      ? 'name_EN'
      : 'name_AR';
  }

  Update() {
    this.presentationService._update(this.presentationModel).subscribe({
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

  viewDetails(id: number, templateDetails: TemplateRef<any> | undefined) {
    this.presentationService._details(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (templateDetails) {
            this.presentationModel = response.data;
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

  editConsultingRequest(id: number, template: TemplateRef<any> | undefined) {}

  initilizeDataTable(): void {
    //const datatable: any = $('#consultingRequestDataTable').DataTable();
    const currentLang = this.globalService.getCurrentLanguage();
    const languageConfig =
      currentLang === 'ar'
        ? this.globalService.getArabicLanguageConfig()
        : this.globalService.getEnglishLanguageConfig();
    this.datatable = $('#ideaDataTable').DataTable();
    if (this.datatable != null && this.datatable != undefined) {
      this.datatable.destroy();
      this.datatable = null;
    }
    this.presentationService._lists().subscribe((response: ResponseResult) => {
      // ////console.log(response.data, 'Data Table values');
      ////console.log(response.data);
      console.log(response, 'response');
      if (response.statusCode == 0) {
        this.presentationModelList = response.data;
      }
      // ////console.log(this.btnList, 'List Data');

      setTimeout(() => {
        $('#ideaDataTable').DataTable({
          pagingType: 'full_numbers',
          pageLength: 5,
          processing: true,
          data: this.presentationModelList,
          language: languageConfig,
          columns: [
            { data: 'id' },
            {
              data: 'searchNameEn', //(row: any) => this.getDepartmentName(row.requestModel.sID),
            },
            {
              data: 'searchNameAr', //(row: any) => this.getDepartmentName(row.requestModel.sID),
            },
            {
              data: (row: any) =>
                this.globalService.getResearchAreaName(
                  row.researchAreaCategory
                ),
            },

            // {
            //   data: function (row: any) {
            //     if (row.workFlowStatus === WorkFlowStatus.Accept) {
            //       return (
            //         '<span style="color:green;font-weight: 600">' +
            //         row.workFlowStatusName +
            //         '</span>'
            //       );
            //     } else if (row.workFlowStatus === WorkFlowStatus.Reject) {
            //       return (
            //         '<span style="color:red;font-weight: 600">' +
            //         row.workFlowStatusName +
            //         '</span>'
            //       );
            //     } else if (row.workFlowStatus === WorkFlowStatus.Returned) {
            //       return (
            //         '<span style="color:blue;font-weight: 600">' +
            //         row.workFlowStatusName +
            //         '</span>'
            //       );
            //     } else if (
            //       row.workFlowStatus === WorkFlowStatus.UnderProcesses
            //     ) {
            //       return (
            //         '<span style="color:#a78e8e;font-weight: 600">' +
            //         row.workFlowStatusName +
            //         '</span>'
            //       );
            //     }

            //     return '';
            //   },
            // },

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
              this.editConsultingRequest(data.id, this.template);
            });

            return row;
          },

          lengthMenu: [5, 10, 25],
        });
      }, 1);
    });
  }

  downloadFile(url: string | null) {
    console.log(url);
    if (url) {
      this.downloadService.downloadFile(url);
    }
  }
}
