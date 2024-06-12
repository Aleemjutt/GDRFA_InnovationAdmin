import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FilePondOptions } from 'filepond';
import { FilePondComponent } from 'ngx-filepond';
import { ToastrService } from 'ngx-toastr';
import { Observable, finalize } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';

import { ResponseResult, StatusCodes } from 'src/app/_models/responseResult';
import { AboutService } from 'src/app/_services/_about/about.service';
import { UploadServiceService } from 'src/app/_services/upload-service.service';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import {
  ResearchAreaModel,
  ResearchCenterInfoModel,
} from 'src/app/_models/ResearchCenter/researchCneterInfo';
import { ResearchCenterService } from 'src/app/_services/_researchCenter/research-center.service';
import { TabComponent } from 'ngx-tabset';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-research-center',
  standalone: true,
  imports: [CommonModule, FormsModule, TabsModule, TranslateModule],
  templateUrl: './research-center.component.html',
  styleUrl: './research-center.component.css',
})
export class ResearchCenterComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm | undefined;

  researchAreaModel: ResearchAreaModel;
  researchAreaModelList: ResearchAreaModel[] = [];

  researchCenterInfoModel: ResearchCenterInfoModel;
  constructor(
    private researchCenterService: ResearchCenterService,
    private tosterService: ToastrService,
    public globalService: GlobalServiceService
  ) {
    this.researchAreaModel = {
      textAr: '',
      textEn: '',
      researchCenterInfoId: 0,
      id: 0,
    };

    this.researchCenterInfoModel = {
      id: 0,
      descriptionAr: '',
      descriptionEn: '',
      presentingscientificResearchAr: '',
      presentingscientificResearchEn: '',
      researchAreaModels: [],
    };
  }

  ngOnInit(): void {
    this.getDetails();
  }

  getDetails() {
    this.researchCenterService._details().subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode === StatusCodes.success) {
          this.researchCenterInfoModel = response.data;
        }
      },
    });
  }

  add() {
    console.log(this.researchCenterInfoModel);
    console.log(this.editForm?.value);
    let model = this.editForm?.value;

    model.id = this.researchCenterInfoModel.id;
    model.researchAreaModels = this.researchCenterInfoModel.researchAreaModels;
    this.researchCenterService._add(model).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          this.tosterService.success(response.message);
          this.getDetails();
        }
      },
    });
  }

  addItem(): void {
    if (
      this.researchAreaModel?.textEn?.trim() !== '' ||
      (this.researchAreaModel?.textAr?.trim() !== '' &&
        this.researchAreaModel !== null)
    ) {
      if (this.researchAreaModel != null)
        this.researchCenterInfoModel?.researchAreaModels?.push(
          this.researchAreaModel
        );
      this.researchAreaModel = {
        textAr: '',
        textEn: '',
        researchCenterInfoId: 0,
        id: 0,
      };
    }
  }

  removeItem(index: number): void {
    this.researchCenterInfoModel?.researchAreaModels?.splice(index, 1);
  }

  getTabName(tabId: number): string {
    let tabName = '';
    if (tabId == 1)
      tabName =
        this.globalService.getCurrentLanguage() === 'en'
          ? 'About the Center'
          : 'حول المركز';
    else
      tabName =
        this.globalService.getCurrentLanguage() === 'en'
          ? 'Presenting Scientific Research'
          : 'عرض الأبحاث العلمية';

    return tabName;
  }
}
