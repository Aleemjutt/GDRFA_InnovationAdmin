import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FilePondOptions } from 'filepond';
import { FilePondComponent } from 'ngx-filepond';
import { ToastrService } from 'ngx-toastr';
import { Observable, finalize } from 'rxjs';
import { DatePipe } from '@angular/common';
import {
  AboutInnovationCenterModel,
  OurGoalModel,
  OurValueModel,
} from 'src/app/_models/About/aboutInnovationCenterModel';
import { ResponseResult } from 'src/app/_models/responseResult';
import { AboutService } from 'src/app/_services/_about/about.service';
import { UploadServiceService } from 'src/app/_services/upload-service.service';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';

@Component({
  selector: 'app-about-innovaton-center-add-edit',
  standalone: false,
  templateUrl: './about-innovaton-center-add-edit.component.html',
  styleUrl: './about-innovaton-center-add-edit.component.css',
})
export class AboutInnovatonCenterAddEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm | undefined;
  @ViewChild('organizationImgEn', { static: true })
  organizationImgEn!: FilePondComponent;
  @ViewChild('organizationImgAr', { static: true })
  organizationImgAr!: FilePondComponent;

  @ViewChild('DirectorImg', { static: true })
  DirectorImg!: FilePondComponent;

  @ViewChild('VisionEnImg', { static: true })
  VisionEnImg!: FilePondComponent;

  @ViewChild('VisionArImg', { static: true })
  VisionArImg!: FilePondComponent;

  @ViewChild('StrategyEnImg', { static: true })
  StrategyEnImg!: FilePondComponent;

  @ViewChild('StrategyArImg', { static: true })
  StrategyArImg!: FilePondComponent;

  //ourValuesEnInput: string = '';

  ourValueModel: OurValueModel;
  ourValuesModelList: OurValueModel[] = [];

  //ourValuesArInput: string = '';
  ourGoalModel: OurGoalModel;
  ourGoalsModelList: OurGoalModel[] = [];

  aboutInnovationCenterModel: AboutInnovationCenterModel | undefined;

  file: File | undefined;
  progress: number = 0;
  attachmentList: any = [];
  fileInfos?: Observable<any>;

  message: any;
  constructor(
    private aboutInnovationCenterservice: AboutService,
    private tosterService: ToastrService,
    private uploadService: UploadServiceService,
    public globalService: GlobalServiceService
  ) {
    this.ourGoalModel = {
      ourGoalAr: '',
      ourGoalEn: '',
      innovationAboutCenterId: 0,
      id: 0,
      //createdDate: '',
      //createdBy: null,
      //updatedDate: '',
      // updatedBy: 0,
      //isDeleted: false,
      // isActive: true,
    };

    this.ourValueModel = {
      ourValuesAr: '',
      ourValuesEn: '',
      innovationAboutCenterId: 0,
      id: 0,
      //  createdDate: '',
      // createdBy: null,
      // updatedDate: '',
      // updatedBy: 0,
      //isDeleted: false,
      //isActive: true,
    };
  }

  ngOnInit(): void {
    this.getDetails();
  }
  @HostListener('window:beforeunload', ['$event']) unloadNotification(
    $event: any
  ) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }

  imagesArray: any = [];

  pondOptions: FilePondOptions = {
    allowMultiple: false,
    labelIdle: 'Drop files here...',
    //allo: ['image/jpeg, image/png'],
    //acceptedFileTypes: ['image/jpeg, image/png'],
    allowReorder: true,
  };

  pondFiles: FilePondOptions['files'] = [
    // {
    //   source: 'assets/photo.jpeg',
    //   options: {
    //     type: 'local',
    //   },
    // },
  ];

  pondHandleInit() {}

  pondHandleAddFile(event: any, instanceName: string) {
    //const file: File | null = event.file;
    this.file = event.file.file;
    const file_ = event.file.file;

    this.imagesArray.push({ fileName: file_, instance: instanceName });
    console.log(`File added to ${instanceName}:`, file_.name);

    console.log(this.imagesArray);
  }

  pondHandleActivateFile(event: any) {}
  pondHandleRemoveFile(event: any) {}

  getDetails() {
    this.aboutInnovationCenterservice
      .getAboutInnovcationCenterDetails()
      .subscribe({
        next: (response: ResponseResult) => {
          if (response.statusCode == 0) {
            this.aboutInnovationCenterModel = response.data;
          }
        },
      });
  }

  addAboutInnovation() {
    if (this.imagesArray.length > 0) {
      this.upload();
    } else {
      this._addAboutInnovation();
    }
  }

  _addAboutInnovation() {
    console.log(this.aboutInnovationCenterModel);
    this.aboutInnovationCenterservice
      .addAboutInnovcationCenterDetails(this.aboutInnovationCenterModel)
      .subscribe({
        next: (response: ResponseResult) => {
          if (response.statusCode == 0) {
            this.tosterService.success(response.message);
            this.getDetails();
          }
        },
      });
  }

  addItem(): void {
    //if (type === 'en') {
    const datePipe = new DatePipe('en-US');
    const isoFormattedDate = datePipe.transform(
      new Date(),
      'yyyy-MM-ddTHH:mm:ssZ'
    );
    if (
      this.ourGoalModel?.ourGoalEn?.trim() !== '' ||
      (this.ourGoalModel?.ourGoalAr?.trim() !== '' &&
        this.ourGoalModel !== null)
    ) {
      if (this.ourGoalModel != null)
        // this.ourGoalModel.createdDate = isoFormattedDate; //Date();
        // this.ourGoalModel.updatedDate = isoFormattedDate;
        this.aboutInnovationCenterModel?.ourGoalsModel?.push(this.ourGoalModel);
      this.ourGoalModel = {
        ourGoalAr: '',
        ourGoalEn: '',
        innovationAboutCenterId: 0,
        id: 0,
        //createdDate: isoFormattedDate,
        // createdBy: 0,
        // updatedDate: isoFormattedDate,
        // updatedBy: 0,
        // isDeleted: false,
        // isActive: true,
      };
      //this.ourGoalModel = OurGloaModel; // Clear the input field after adding
    }
    // } else
    // {
    //   if (this.ourValuesArInput.trim() !== '') {
    //     this.ourValuesArList.push(this.ourValuesArInput);
    //     this.ourValuesArInput = ''; // Clear the input field after adding
    //   }
    // }
  }

  removeItem(index: number): void {
    // if (language === 'en') {
    this.aboutInnovationCenterModel?.ourGoalsModel?.splice(index, 1);
    // } else if (language === 'ar') {
    //   this.aboutInnovationCenterModel?.ourGoalsModel?.splice(index, 1);
    // }
  }

  addItemValues(): void {
    const datePipe = new DatePipe('en-US');
    const isoFormattedDate = datePipe.transform(
      new Date(),
      'yyyy-MM-ddTHH:mm:ssZ'
    );

    if (
      this.ourValueModel?.ourValuesEn?.trim() !== '' ||
      (this.ourValueModel?.ourValuesAr?.trim() !== '' &&
        this.ourValueModel != null)
    ) {
      if (this.ourValueModel != null)
        this.aboutInnovationCenterModel?.ourValuesModel?.push(
          this.ourValueModel
        );

      this.ourValueModel = {
        ourValuesAr: '',
        ourValuesEn: '',
        innovationAboutCenterId: 0,
        id: 0,
      };
    }
  }

  removeValueItem(index: number): void {
    this.aboutInnovationCenterModel?.ourValuesModel?.splice(index, 1);
  }

  upload(): void {
    this.progress = 0;
    const totalImages = this.imagesArray.length;
    let uploadedImages = 0;

    for (let index = 0; index < totalImages; index++) {
      this.uploadService
        .upload(this.imagesArray[index].fileName, 'AboutInnovationCenter')
        .pipe(
          finalize(() => {
            uploadedImages++;

            if (uploadedImages === totalImages) {
              // All images have been uploaded, set URLs and call _addAboutInnovation
              this.setUrlsForInstanceNames();
              this._addAboutInnovation();

              //this.imagesArray = []; // Clear the array after processing all images
            }
          })
        )
        .subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              // Process the response and update attachmentList

              for (let attm of event.body.data as { url: string }[]) {
                const attachment = {
                  imageUrl: attm.url,
                  instanceName: this.imagesArray[index].instance,
                };
                this.attachmentList.push(attachment);
              }
            }
          },
          error: (err: any) => {
            // Handle errors
          },
        });
    }
  }

  setUrlsForInstanceNames(): void {
    for (let index = 0; index < this.imagesArray.length; index++) {
      const instanceName = this.imagesArray[index].instance;
      const imageUrl = this._returnImageUrl(instanceName);

      // Set URLs based on instance names
      if (this.aboutInnovationCenterModel != null) {
        switch (instanceName) {
          case 'OrganizationEnInstance':
            this.aboutInnovationCenterModel.orgStractureUrlEn = imageUrl;
            break;
          case 'OrganizationArInstance':
            this.aboutInnovationCenterModel.orgStractureUrlAr = imageUrl;
            break;

          case 'DirectorEnInstance':
            this.aboutInnovationCenterModel.directorImgUrl = imageUrl;
            break;

          case 'StrategyEnInstance':
            this.aboutInnovationCenterModel.strategyImageUrlAr = imageUrl;
            break;

          case 'StrategyArInstance':
            this.aboutInnovationCenterModel.strategyImageUrlEn = imageUrl;
            break;

          case 'VisionEnInstance':
            this.aboutInnovationCenterModel.ourVisionImageUrlEn = imageUrl;
            break;

          case 'VisionArInstance':
            this.aboutInnovationCenterModel.ourVisionImageUrlAr = imageUrl;
            break;

          case 'MissionEnInstance':
            this.aboutInnovationCenterModel.ourMissionImageUrlEn = imageUrl;
            break;
          case 'MissionArInstance':
            this.aboutInnovationCenterModel.ourMissionImageUrlAr = imageUrl;
            break;

          // Add cases for other instance names
        }
      }
    }
  }

  processHttpResponse(event: HttpResponse<any>, index: number): void {
    this.message = event.body.message;

    for (let attm of event.body.data as { url: string }[]) {
      const attachment = {
        imageUrl: attm.url,
        instanceName: this.imagesArray[index].instanceName,
      };
      this.attachmentList.push(attachment);
    }
  }

  handleUploadError(err: any): void {
    this.progress = 0;

    if (err.error && err.error.message) {
      this.message = err.error.message;
    } else {
      this.message = 'Could not upload the file!';
    }
  }

  _returnImageUrl(instanceName: string): string | null {
    const imageUrl = this.attachmentList.find(
      (element: { instanceName: string }) =>
        element.instanceName === instanceName
    )?.imageUrl;

    return imageUrl !== undefined ? imageUrl : null;
  }

  removeImage(type: string) {
    if (this.aboutInnovationCenterModel)
      switch (type) {
        case 'en':
          this.aboutInnovationCenterModel.orgStractureUrlEn = '';
          break;
        case 'ar':
          this.aboutInnovationCenterModel.orgStractureUrlAr = '';
          break;
        case 'ourMissionEn':
          this.aboutInnovationCenterModel.ourMissionImageUrlEn = '';
          break;
        case 'ourMissionAr':
          this.aboutInnovationCenterModel.ourMissionImageUrlAr = '';
          break;
        case 'VisionArInstance':
          this.aboutInnovationCenterModel.ourVisionImageUrlAr = '';
          break;
        case 'VisionEnInstance':
          this.aboutInnovationCenterModel.ourVisionImageUrlEn = '';
          break;
        case 'strategyEn':
          this.aboutInnovationCenterModel.strategyImageUrlEn = '';
          break;

        case 'strategyAr':
          this.aboutInnovationCenterModel.strategyImageUrlAr = '';
          break;
        case 'director':
          this.aboutInnovationCenterModel.directorImgUrl = '';
          break;
      }
    // if (type === 'en') {
    //   this.aboutInnovationCenterModel.orgStractureUrlEn = '';
    // } else if (type === 'ar') {
    //   this.aboutInnovationCenterModel.orgStractureUrlAr = '';
    // }
  }
  // upload(): void {
  //   this.progress = 0;
  //   for (let index = 0; index < this.imagesArray.length; index++) {
  //     this.uploadService
  //       .upload(this.imagesArray[index].fileName, 'AboutInnovationCenter')
  //       .pipe(
  //         finalize(() => {
  //           if (this.attachmentList.length > 0) {
  //             if (this.aboutInnovationCenterModel != null) {
  //               const imageUrl_OrganizationEnInstance = this.returnImageUrl(
  //                 'OrganizationEnInstance'
  //               );
  //               this.aboutInnovationCenterModel.orgStractureUrlEn =
  //                 imageUrl_OrganizationEnInstance !== undefined
  //                   ? imageUrl_OrganizationEnInstance
  //                   : null;

  //               const imageUrl_OrganizationArInstance = this.returnImageUrl(
  //                 'OrganizationArInstance'
  //               );
  //               this.aboutInnovationCenterModel.orgStractureUrlAr =
  //                 imageUrl_OrganizationArInstance !== undefined
  //                   ? imageUrl_OrganizationArInstance
  //                   : null;
  //               const imageUrl_DirectorEnInstance =
  //                 this.returnImageUrl('DirectorEnInstance');
  //               this.aboutInnovationCenterModel.orgStractureUrlEn =
  //                 imageUrl_DirectorEnInstance !== undefined
  //                   ? imageUrl_DirectorEnInstance
  //                   : null;
  //               const imageUrl_StrategyEnInstance =
  //                 this.returnImageUrl('StrategyEnInstance');
  //               this.aboutInnovationCenterModel.strategyImageUrlEn =
  //                 imageUrl_StrategyEnInstance !== undefined
  //                   ? imageUrl_StrategyEnInstance
  //                   : null;
  //               const imageUrl_StrategyArInstance =
  //                 this.returnImageUrl('StrategyArInstance');
  //               this.aboutInnovationCenterModel.orgStractureUrlEn =
  //                 imageUrl_StrategyArInstance !== undefined
  //                   ? imageUrl_StrategyArInstance
  //                   : null;
  //               const imageUrl_VisionEnInstance =
  //                 this.returnImageUrl('VisionEnInstance');
  //               this.aboutInnovationCenterModel.ourVisionImageUrlEn =
  //                 imageUrl_VisionEnInstance !== undefined
  //                   ? imageUrl_VisionEnInstance
  //                   : null;
  //               const imageUrl_VisionArInstance =
  //                 this.returnImageUrl('VisionArInstance');
  //               this.aboutInnovationCenterModel.ourVisionImageUrlAr =
  //                 imageUrl_VisionArInstance !== undefined
  //                   ? imageUrl_VisionArInstance
  //                   : null;

  //               const imageUrl_MissionEnInstance =
  //                 this.returnImageUrl('MissionEnInstance');
  //               this.aboutInnovationCenterModel.ourVisionImageUrlAr =
  //                 imageUrl_MissionEnInstance !== undefined
  //                   ? imageUrl_MissionEnInstance
  //                   : null;

  //               const imageUrl_MissionArInstance =
  //                 this.returnImageUrl('MissionArInstance');
  //               this.aboutInnovationCenterModel.ourVisionImageUrlAr =
  //                 imageUrl_MissionArInstance !== undefined
  //                   ? imageUrl_MissionArInstance
  //                   : null;
  //             }

  //             this._addAboutInnovation();
  //             this.imagesArray = [];
  //           } else {
  //             this._addAboutInnovation();
  //             this.imagesArray = [];
  //           }
  //         })
  //       )

  //       .subscribe({
  //         next: (event: any) => {
  //           if (event.type === HttpEventType.UploadProgress) {
  //             this.progress = Math.round((100 * event.loaded) / event.total);
  //           } else if (event instanceof HttpResponse) {
  //             this.message = event.body.message;
  //             for (let attm of event.body.data as { url: string }[]) {
  //               const attachment = {
  //                 imageUrl: attm.url,
  //                 instanceName: this.imagesArray[index].instanceName,
  //               };
  //               this.attachmentList.push(attachment);
  //             }
  //             //this.fileInfos = this.uploadService.getFiles();
  //           }
  //         },
  //         error: (err: any) => {
  //           this.progress = 0;
  //           if (err.error && err.error.message) {
  //             this.message = err.error.message;
  //           } else {
  //             this.message = 'Could not upload the file!';
  //           }
  //         },
  //       });
  //   }
  // }

  // returnImageUrl(instanceName: string): string | undefined {
  //   let imageUrl: string | undefined;

  //   this.attachmentList.forEach(
  //     (element: { instanceName: string; imageUrl: string | undefined }) => {
  //       if (element.instanceName === instanceName) {
  //         imageUrl = element.imageUrl; // Assuming imageUrl is the property representing the URL
  //       }
  //     }
  //   );

  //   return imageUrl;
  // }
}
