import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { ResponseResult } from 'src/app/_models/responseResult';
import { UserService } from 'src/app/_services/_users/user.service';

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

  constructor(
    private modalService: BsModalService,
    private globalService: GlobalServiceService,
    private tosterService: ToastrService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.initilizeDataTable();
  }
  initilizeDataTable(): void {
    //const datatable: any = $('#consultingRequestDataTable').DataTable();

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
          columns: [
            { data: 'id' },
            {
              data: 'firstName', //(row: any) => this.getDepartmentName(row.requestModel.sID),
            },
            {
              data: 'lastName', //(row: any) => this.getDepartmentName(row.requestModel.sID),
            },
            {
              data: 'email', //(row: any) => this.getDepartmentName(row.requestModel.sID),
            },

            {
              data: function (row: any) {
                if (row.userStatus === false) {
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
              this.edit(data.id, this.template);
            });

            return row;
          },

          lengthMenu: [5, 10, 25],
        });
      }, 1);
    });
  }

  viewDetails(id: number, template: TemplateRef<any> | undefined) {}
  edit(id: number, template: TemplateRef<any> | undefined) {}

  Update() {}
}
