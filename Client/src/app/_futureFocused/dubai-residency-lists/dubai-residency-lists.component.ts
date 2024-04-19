import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import {
  DubaiResidencyCentenaryModel,
  DubaiResidencyCentenaryPointsLineModel,
  DubaiResidencyCentenaryPointsMainModel,
} from 'src/app/_models/FutureFocused/dubaiResidancy';
import { ResponseResult } from 'src/app/_models/responseResult';
import { DubaiResidencayService } from 'src/app/_services/_futureFocused/dubai-residencay.service';

@Component({
  selector: 'app-dubai-residency-lists',
  standalone: true,
  imports: [FormsModule, CommonModule, AccordionModule],
  templateUrl: './dubai-residency-lists.component.html',
  styleUrl: './dubai-residency-lists.component.css',
})
export class DubaiResidencyListsComponent {
  @ViewChild('template') template: TemplateRef<any> | undefined;
  @ViewChild('templateDetails') templateDetails: TemplateRef<any> | undefined;
  oneAtATime: any = true;
  dubaiResidencyCentenaryModel: any;
  dubaiResidencyCentenaryModelList: DubaiResidencyCentenaryModel[] = [];

  dubaiResidencyCentenaryPointsMainModel: any;
  dubaiResidencyCentenaryPointsLineModel: any;

  dubaiResidencyCentenaryPointsMainModelList: DubaiResidencyCentenaryPointsMainModel[] =
    [];
  dubaiResidencyCentenaryPointsLineModelList: DubaiResidencyCentenaryPointsLineModel[] =
    [];

  modalRef?: BsModalRef;

  constructor(
    public globalService: GlobalServiceService,
    private tosterService: ToastrService,
    private modalService: BsModalService,
    private dubaiResidancyService: DubaiResidencayService
  ) {
    this.dubaiResidencyCentenaryModel = {
      id: 0,
      tagLineEn: '',
      tagLineAr: '',
      descriptionEn: '',
      descriptionAr: '',

      // dubaiResidencyCentenaryPointsMainModels: [],
    };

    this.dubaiResidencyCentenaryPointsMainModel = {
      id: 0,
      headLineEn: '',
      headLineAr: '',
      dubaiResidencyCentenaryId: 0,
      dubaiResidencyCentenaryPointsLineModels: [],
    };
    this.dubaiResidencyCentenaryPointsLineModel = {
      id: 0,
      textEn: '',
      textAr: '',
      dubaiResidencyCentenaryPointsMainId: 0,
    };
  }

  ngOnInit(): void {
    //this.initializeDataTable();
  }

  add() {}
  update() {}

  viewDetails(id: number, templateDetails: TemplateRef<any> | undefined) {
    this.dubaiResidancyService.getDetails(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (templateDetails) {
            this.modalRef = this.modalService.show(templateDetails, {
              class: 'gray modal-lg',
            });
          } else {
            console.error('Template is undefined');
          }
          this.dubaiResidencyCentenaryModel = response.data;
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  edit(id: number, template: TemplateRef<any> | undefined) {
    this.dubaiResidancyService.getDetails(id).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          if (template) {
            this.dubaiResidencyCentenaryModel = response.data;
            if (
              this.dubaiResidencyCentenaryModel.imageUrlView != null &&
              this.dubaiResidencyCentenaryModel.imageUrlView != ''
            )
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

  addPoint(): void {
    if (
      this.dubaiResidencyCentenaryPointsMainModel?.headLineEn?.trim() !== '' ||
      (this.dubaiResidencyCentenaryPointsMainModel?.headLineAr?.trim() !== '' &&
        this.dubaiResidencyCentenaryPointsMainModelList != null)
    ) {
      if (this.dubaiResidencyCentenaryPointsMainModelList != null)
        this.dubaiResidencyCentenaryPointsMainModel.dubaiResidencyCentenaryPointsLineModels =
          this.dubaiResidencyCentenaryPointsLineModelList;
      this.dubaiResidencyCentenaryPointsMainModelList?.push(
        this.dubaiResidencyCentenaryPointsMainModel
      );

      this.dubaiResidencyCentenaryPointsLineModelList = [];

      this.dubaiResidencyCentenaryPointsMainModel = {
        headLineEn: '',
        headLineAr: '',
        dubaiResidencyCentenaryPointsLineModels: [],
        id: 0,
      };
    }
  }

  removePoint(index: number): void {
    this.dubaiResidencyCentenaryPointsMainModelList?.splice(index, 1);
  }

  addPointLine(): void {
    if (
      this.dubaiResidencyCentenaryPointsLineModel?.textEn?.trim() !== '' ||
      (this.dubaiResidencyCentenaryPointsLineModel?.textAr?.trim() !== '' &&
        this.dubaiResidencyCentenaryPointsLineModelList != null)
    ) {
      if (this.dubaiResidencyCentenaryPointsLineModelList != null)
        this.dubaiResidencyCentenaryPointsLineModelList?.push(
          this.dubaiResidencyCentenaryPointsLineModel
        );

      this.dubaiResidencyCentenaryPointsLineModel = {
        textAr: '',
        textEn: '',
        dubaiResidencyCentenaryPointsMainId: 0,
        id: 0,
      };
    }
  }

  removePointLine(index: number): void {
    this.dubaiResidencyCentenaryPointsLineModelList?.splice(index, 1);
  }

  editItem(residenacy: any) {}

  deleteItem(residenacy: any) {}
}
