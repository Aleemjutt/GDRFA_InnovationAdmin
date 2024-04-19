import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { FormGroup, FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InnovationConsultingModel } from 'src/app/_models/About/innovatoinConsulting';
import { InnovationConsultingService } from 'src/app/_services/_about/innovation-consulting.service';
import { ResponseResult } from 'src/app/_models/responseResult';

@Component({
  selector: 'app-innovation-consulting-lists',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './innovation-consulting-lists.component.html',
  styleUrl: './innovation-consulting-lists.component.css',
})
export class InnovationConsultingListsComponent implements OnInit {
  consultingModel: InnovationConsultingModel;
  @ViewChild('consultingForm') consultingForm: NgForm | undefined;
  constructor(
    private tosterService: ToastrService,
    public globalService: GlobalServiceService,
    private innovationConsutling: InnovationConsultingService
  ) {
    // Initialize consultingModel
    this.consultingModel = {
      id: null,
      contactDescEn: null,
      contactDescAr: null,
      mobile: null,
      availablity: null,
      twitterUrl: null,
      instagramUrl: null,
      submitComplain: null,
      facebookUrl: null,
      submitSuggestion: null,
      amirChart: null,
      contactGeneralManager: null,
      instantVideoCall: null,
      email: null,
      toolFreeNumber: null,
      internationalPhoneNumber: null,
      amirChartLink: null,
      postalAddress: null,
      headquaterLocation: null,
    };
  }
  ngOnInit(): void {
    this.details();
  }

  saveDetails() {
    console.log(this.consultingForm?.value);
    if (this.consultingForm?.value.id == 0) {
      this.innovationConsutling
        .addinnovationConsulting(this.consultingForm?.value)
        .subscribe({
          next: (response: ResponseResult) => {
            if (response.statusCode == 0) {
              this.tosterService.success(response.message);
            } else {
              this.tosterService.error(response.message);
            }
          },
        });
    } else {
      this.consultingModel.id = this.consultingForm?.value.id;
      console.log(this.consultingModel.id, 'id');
      this.updateDetails(this.consultingForm?.value);
    }
  }

  updateDetails(consultingModel: InnovationConsultingModel) {
    console.log(consultingModel);

    this.innovationConsutling
      .updateinnovationConsulting(consultingModel)
      .subscribe({
        next: (response: ResponseResult) => {
          if (response.statusCode == 0) {
            this.tosterService.success(response.message);
          } else {
            this.tosterService.error(response.message);
          }
        },
      });
  }

  details() {
    //console.log(this.consultingForm?.value);

    this.innovationConsutling.getinnovationConsultingDetails().subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          //this.tosterService.success(response.message);
          this.consultingModel = response.data;
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }
}
