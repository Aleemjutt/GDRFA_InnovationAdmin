import { Component } from '@angular/core';
import { OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { InnovationConsultingRequestModel } from 'src/app/_models/ConsultingRequest/consultingRequestModel';
import { ResponseResult } from 'src/app/_models/responseResult';
import { ConsultingRequestService } from 'src/app/_services/_consultingRequst/consulting-request.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-reqeust-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reqeust-list.component.html',
  styleUrl: './reqeust-list.component.css',
})
export class ReqeustListComponent implements OnInit {
  modalRef?: BsModalRef;

  innovationConsultingRequestModelList: InnovationConsultingRequestModel[] = [];
  consultingRequestModel: InnovationConsultingRequestModel | null = null;
  @ViewChild('template') template: TemplateRef<any> | undefined;
  @ViewChild('templateDetails') templateDetails: TemplateRef<any> | undefined;
  private datatable: any;
  constructor(
    private consultingRequestService: ConsultingRequestService,
    private modalService: BsModalService,

    private tosterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeDataTable();
  }

  Update() {
    this.consultingRequestService
      .updateConsultingRequest(this.consultingRequestModel)
      .subscribe({
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

  viewConsultingRequestDetails(
    id: number,
    templateDetails: TemplateRef<any> | undefined
  ) {
    this.consultingRequestService.getConsultingRequestDetails(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (templateDetails) {
            this.consultingRequestModel = response.data;
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

  editConsultingRequest(id: number, template: TemplateRef<any> | undefined) {
    this.consultingRequestService.getConsultingRequestDetails(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (template) {
            this.consultingRequestModel = response.data;
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

  initilizeDataTable(): void {
    //const datatable: any = $('#consultingRequestDataTable').DataTable();
    const row = '';
    this.datatable = $('#consultingRequestDataTable').DataTable();
    if (this.datatable != null && this.datatable != undefined) {
      this.datatable.destroy();
      this.datatable = null;
    }
    this.consultingRequestService
      .getConsultingRequestList()
      .subscribe((response: ResponseResult) => {
        // ////console.log(response.data, 'Data Table values');
        ////console.log(response.data);
        console.log(response, 'response');
        if (response.statusCode == 0) {
          this.innovationConsultingRequestModelList = response.data;
        }
        // ////console.log(this.partnerList, 'List Data');

        setTimeout(() => {
          $('#consultingRequestDataTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            data: this.innovationConsultingRequestModelList,
            columns: [
              { data: 'id' },
              {
                data: 'name', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },
              {
                data: 'email', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },
              {
                data: 'subject', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },
              {
                data: 'message', //(row: any) => this.getDepartmentName(row.requestModel.sID),
              },

              {
                data: function (row: any) {
                  if (row.replyMessage == null || row.replyMessage === '') {
                    return `
                            <button type="button" class="btn btn-light mr-1 view-btn" data-toggle="modal" 
                            data-target="#exampleModal" data-backdrop="static" data-keyboard="false">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" 
                                class="bi bi-eye-fill" viewBox="0 0 16 16">
                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                                </svg>
                            </button>
                            <button type="button" class="btn btn-light mr-1 edit-btn" data-toggle="modal" 
                            data-target="#exampleModal" data-backdrop="static" data-keyboard="false">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-square" 
                                fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg>
                            </button>`;
                  } else {
                    return ` <button type="button" class="btn btn-light mr-1 view-btn" data-toggle="modal" 
                    data-target="#exampleModal" data-backdrop="static" data-keyboard="false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" 
                        class="bi bi-eye-fill" viewBox="0 0 16 16">
                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                        </svg>
                    </button>`;
                  }
                },
              },
            ],
            rowCallback: (row: Node, data: any, index: number) => {
              const viewpartnerDetails = $('button:first', row);
              const editpartner = $('button:eq(1)', row);
              const deletepartner = $('button:last', row);
              // Attach click event handlers to the buttons
              viewpartnerDetails.on('click', () => {
                this.viewConsultingRequestDetails(
                  data.id,
                  this.templateDetails
                );
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
}
