import { Component } from '@angular/core';
import { InnovationConsultingModel } from 'src/app/_models/About/innovatoinConsulting';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InnovationConsultingService } from 'src/app/_services/_about/innovation-consulting.service';
import { ResponseResult } from 'src/app/_models/responseResult';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { HostListener, OnInit, ViewChild } from '@angular/core';
@Component({
  selector: 'app-innovation-consulting-add-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './innovation-consulting-add-edit.component.html',
  styleUrl: './innovation-consulting-add-edit.component.css',
})
export class InnovationConsultingAddEditComponent {
  @ViewChild('editForm') editForm: NgForm | undefined;
  innovationConsultingModel: InnovationConsultingModel | null = null;
  responseReuslt = new ResponseResult();
  constructor(
    private innovationConsultingService: InnovationConsultingService,
    private toasterService: ToastrService
  ) {}
  ngOnInit() {
    this.getDetails();
  }

  getDetails() {
    this.innovationConsultingService
      .getinnovationConsultingModelDetails()
      .subscribe({
        next: (responseReuslt) => {
          if (responseReuslt.statusCode === 0) {
            this.innovationConsultingModel = responseReuslt.data;
          } else {
            this.toasterService.error(responseReuslt.message);
          }
        },
      });
  }

  saveAndUpdate() {
    if (this.innovationConsultingModel?.id == 0 || null) {
      this.innovationConsultingService
        .addinnovationConsultingModel(this.innovationConsultingModel)
        .subscribe({
          next: (responseReuslt) => {
            if (responseReuslt.statusCode === 0) {
              this.toasterService.success(responseReuslt.message);
            } else {
              this.toasterService.error(responseReuslt.message);
            }
          },
        });
    } else {
      this.innovationConsultingService
        .updateinnovationConsultingModel(this.innovationConsultingModel)
        .subscribe({
          next: (responseReuslt) => {
            if (responseReuslt.statusCode === 0) {
              this.toasterService.success(responseReuslt.message);
            } else {
              this.toasterService.error(responseReuslt.message);
            }
          },
        });
    }
  }
}
