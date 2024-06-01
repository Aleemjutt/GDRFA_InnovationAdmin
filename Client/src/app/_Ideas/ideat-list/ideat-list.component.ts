import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ResponseResult } from 'src/app/_models/responseResult';
import { IdeasSubmitModel } from 'src/app/_models/Ideas/ideaSubmitModel';
import { IdeaService } from 'src/app/_services/_Ideas/idea.service';
import { Subscription } from 'rxjs';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { Status } from 'filepond';
import { WorkFlowStatus } from 'src/app/_models/Common/workflowStatus';
import { FiledownloaderService } from 'src/app/_services/filedownloader.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-ideat-list',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, TranslateModule],
  templateUrl: './ideat-list.component.html',
  styleUrl: './ideat-list.component.css',
})
export class IdeatListComponent implements OnInit {
  modalRef?: BsModalRef;
  sectorList: any[] = [];
  administrationList: any[] = [];
  ideasSubmitModelList: IdeasSubmitModel[] = [];
  bindLableSector: string;
  bindLableAdministration: string;
  ideaSubmitModel: IdeasSubmitModel | null = null;
  @ViewChild('template') template: TemplateRef<any> | undefined;
  @ViewChild('templateDetails') templateDetails: TemplateRef<any> | undefined;
  @ViewChild('mySector', { static: true }) mySector!: NgSelectComponent;
  @ViewChild('myAdministration', { static: true })
  myAdministration!: NgSelectComponent;
  enum: typeof WorkFlowStatus = WorkFlowStatus;

  private datatable: any;
  private languageChangeSubscription!: Subscription;
  searchLabel: string = 'Search:';
  constructor(
    private ideaSerivces: IdeaService,
    private modalService: BsModalService,
    private globalService: GlobalServiceService,
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
      this.refreshNgSelect();
    });
  }

  refreshNgSelect(): void {
    // Hide the ng-select component
    this.mySector.close();
    this.myAdministration.close();

    // Use a timeout to allow Angular to detect changes and refresh the ng-select component
    setTimeout(() => {
      // Show the ng-select component
      // this.mySelect.open();
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
    this.ideaSerivces.updateIdea(this.ideaSubmitModel).subscribe({
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
    this.ideaSerivces.getIdeaDetails(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (templateDetails) {
            this.ideaSubmitModel = response.data;
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
    this.ideaSerivces.getIdeaList().subscribe((response: ResponseResult) => {
      // ////console.log(response.data, 'Data Table values');
      ////console.log(response.data);
      console.log(response, 'response');
      if (response.statusCode == 0) {
        this.ideasSubmitModelList = response.data;
      }
      // ////console.log(this.partnerList, 'List Data');

      setTimeout(() => {
        $('#ideaDataTable').DataTable({
          pagingType: 'full_numbers',
          pageLength: 5,
          processing: true,
          data: this.ideasSubmitModelList,
          language: languageConfig,
          columns: [
            { data: 'id' },
            {
              data: 'title', //(row: any) => this.getDepartmentName(row.requestModel.sID),
            },
            {
              data: 'sectorName', //(row: any) => this.getDepartmentName(row.requestModel.sID),
            },
            {
              data: 'administrationName', //(row: any) => this.getDepartmentName(row.requestModel.sID),
            },

            {
              data: function (row: any) {
                if (row.workFlowStatus === WorkFlowStatus.Accept) {
                  return (
                    '<span style="color:green;font-weight: 600">' +
                    row.workFlowStatusName +
                    '</span>'
                  );
                } else if (row.workFlowStatus === WorkFlowStatus.Reject) {
                  return (
                    '<span style="color:red;font-weight: 600">' +
                    row.workFlowStatusName +
                    '</span>'
                  );
                } else if (row.workFlowStatus === WorkFlowStatus.Returned) {
                  return (
                    '<span style="color:blue;font-weight: 600">' +
                    row.workFlowStatusName +
                    '</span>'
                  );
                } else if (row.workFlowStatus === WorkFlowStatus.Modification) {
                  return (
                    '<span style="color:blue;font-weight: 600">' +
                    row.workFlowStatusName +
                    '</span>'
                  );
                } else if (
                  row.workFlowStatus === WorkFlowStatus.UnderProcesses
                ) {
                  return (
                    '<span style="color:#a78e8e;font-weight: 600">' +
                    row.workFlowStatusName +
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
            `,
            },
          ],
          rowCallback: (row: Node, data: any, index: number) => {
            const viewpartnerDetails = $('button:first', row);
            const editpartner = $('button:eq(1)', row);
            const deletepartner = $('button:last', row);
            // Attach click event handlers to the buttons
            viewpartnerDetails.on('click', () => {
              this.viewDetails(data.id, this.templateDetails);
            });

            editpartner.on('click', () => {
              this.editConsultingRequest(data.id, this.template);
            });

            return row;
          },

          lengthMenu: [5, 10, 25],
        });
      }, 1);
    });
  }

  accept(workFlowStatus: WorkFlowStatus) {
    if (this.ideaSubmitModel != null) {
      this.ideaSubmitModel.workFlowStatus = workFlowStatus;
    }

    this.ideaSerivces.updateIdea(this.ideaSubmitModel).subscribe({
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
  reject(workFlowStatus: WorkFlowStatus) {
    if (this.ideaSubmitModel != null) {
      this.ideaSubmitModel.workFlowStatus = workFlowStatus;
    }

    this.ideaSerivces.updateIdea(this.ideaSubmitModel).subscribe({
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
  modify(workFlowStatus: WorkFlowStatus) {
    if (this.ideaSubmitModel != null) {
      this.ideaSubmitModel.workFlowStatus = workFlowStatus;
    }

    this.ideaSerivces.updateIdea(this.ideaSubmitModel).subscribe({
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

  downloadFile(url: string | null) {
    console.log(url);
    if (url) {
      this.downloadService.downloadFile(url);
    }
  }
}
