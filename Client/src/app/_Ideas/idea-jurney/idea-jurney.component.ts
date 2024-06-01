import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilePondModule } from 'ngx-filepond';
import { HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FilePondInitialFile, FilePondOptions } from 'filepond';
import { FilePondComponent } from 'ngx-filepond';
import { IdeaJurneyModel } from 'src/app/_models/Ideas/ideaJurney';
import { IdeajurneyService } from 'src/app/_services/_Ideas/ideajurney.service';
import { ToastrService } from 'ngx-toastr';
import { UploadServiceService } from 'src/app/_services/upload-service.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { ResponseResult } from 'src/app/_models/responseResult';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-idea-jurney',
  standalone: true,
  imports: [FormsModule, CommonModule, FilePondModule,TranslateModule],
  templateUrl: './idea-jurney.component.html',
  styleUrl: './idea-jurney.component.css',
})
export class IdeaJurneyComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm | undefined;
  @ViewChild('ideaJurneyImgEn', { static: true })
  ideaJurneyImgEn!: FilePondComponent;
  @ViewChild('ideaJurneyImgAr', { static: true })
  ideaJurneyImgAr!: FilePondComponent;
  ideaJurneyModel: IdeaJurneyModel;
  imagesArray: any = [];

  file: File | undefined;
  progress: number = 0;
  attachmentList: any = [];
  fileInfos?: Observable<any>;
  message: string = '';
  constructor(
    private ideaJurneyService: IdeajurneyService,
    private tosterService: ToastrService,
    private uploadService: UploadServiceService,
    public globalService: GlobalServiceService
  ) {
    this.ideaJurneyModel = {
      id: 0,
      ideaJurnyArUrl: '',
      ideaJurnyEnUrl: '',
      urlBase64Ar: '',
      urlBase64En: '',
    };
  }

  objInit() {
    this.ideaJurneyModel = {
      id: 0,
      ideaJurnyArUrl: '',
      ideaJurnyEnUrl: '',
      urlBase64Ar: '',
      urlBase64En: '',
    };
  }

  addIdeaJurney() {
    if (this.imagesArray.length > 0) {
      this.upload();
    } else {
      this._addIdeaJurney();
      this.getDetails();
    }
  }
  _addIdeaJurney() {
    console.log(this.ideaJurneyModel);
    this.ideaJurneyService._add(this.ideaJurneyModel).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          this.tosterService.success(response.message);
          this.imagesArray = [];
          this.objInit();
          this.getDetails();
        }
      },
    });
  }

  ngOnInit(): void {
    this.getDetails();

    console.log('Pond files updated:', this.pondFiles);
  }
  @HostListener('window:beforeunload', ['$event']) unloadNotification(
    $event: any
  ) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }

  pondOptions: FilePondOptions = {
    allowFileTypeValidation: true,
    acceptedFileTypes: ['image/*'],
    allowImagePreview: true,
  };

  pondFiles: FilePondInitialFile[] = [];

  //pondFiles: FilePondOptions['files'] = [];
  // pondFiles: { source: string; options?: any }[] = [];

  pondHandleInit() {}

  pondHandleAddFile(event: any, instanceName: string) {
    //const file: File | null = event.file;
    const file_ = event.file.file;

    this.imagesArray.push({ fileName: file_, instance: instanceName });
    console.log(`File added to ${instanceName}:`, file_.name);

    console.log(this.imagesArray);
  }

  pondHandleActivateFile(event: any) {}
  pondHandleRemoveFile(event: any) {}

  getDetails() {
    this.ideaJurneyService.getIdeaJurneyDetails().subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode === 0) {
          this.objInit();
          this.ideaJurneyModel = response.data;
        }
      },
      error: (error) => {
        console.error('Error fetching idea journey details:', error);
      },
    });
  }

  upload(): void {
    this.progress = 0;
    const totalImages = this.imagesArray.length;
    let uploadedImages = 0;

    for (let index = 0; index < totalImages; index++) {
      this.uploadService
        .upload(this.imagesArray[index].fileName, 'IdeaJurney')
        .pipe(
          finalize(() => {
            uploadedImages++;
            if (uploadedImages === totalImages) {
              // All images have been uploaded, set URLs and call _addIdeaJurney
              this.setUrlsForInstanceNames();
              this._addIdeaJurney();
              this.attachmentList = [];
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
      if (this.ideaJurneyModel != null) {
        switch (instanceName) {
          case 'ideaJurneyArInstance':
            this.ideaJurneyModel.ideaJurnyArUrl = imageUrl;
            break;
          case 'ideaJurneyEnInstance':
            this.ideaJurneyModel.ideaJurnyEnUrl = imageUrl;
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
    if (this.ideaJurneyModel) {
      if (type == 'en') {
        this.ideaJurneyModel.ideaJurnyEnUrl = '';
      } else {
        this.ideaJurneyModel.ideaJurnyArUrl = '';
      }
    }
  }
}
