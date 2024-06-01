import { CommonModule } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FilePondOptions } from 'filepond';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FilePondModule } from 'ngx-filepond';
import { ToastrService } from 'ngx-toastr';
import { Observable, finalize } from 'rxjs';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { GovernmentModel } from 'src/app/_models/knowledge/goverment';
import { ResponseResult, StatusCodes } from 'src/app/_models/responseResult';
import { GovermentService } from 'src/app/_services/knowledge/goverment.service';
import { InnovationVersionsService } from 'src/app/_services/knowledge/innovation-versions.service';
import { UploadServiceService } from 'src/app/_services/upload-service.service';

@Component({
  selector: 'app-goverment',
  standalone: true,
  imports: [FormsModule, FilePondModule, CommonModule,TranslateModule],
  templateUrl: './goverment.component.html',
  styleUrl: './goverment.component.css',
})
export class GovermentComponent implements OnInit {
  pondFiles: FilePondOptions['files'] = [];
  govermentModel: GovernmentModel;
  govermentList: any;
  modalRef?: BsModalRef;
  fb: any;
  progress: number | undefined;
  currentFile: File | undefined;
  message: any;
  selectedFiles?: FileList;
  attachmentList: any = [];
  fileInfos?: Observable<any>;
  file: File | undefined;
  attachmentFile: File | undefined;
  attachment: any;
  imagesArray: any = [];

  constructor(
    private tosterService: ToastrService,
    private uploadService: UploadServiceService,
    private govementService: GovermentService,
    public globalService: GlobalServiceService
  ) {
    this.govermentModel = {
      id: 0,
      link: '',
      urlEn: null, // Set a default value for discuss from the Discuss enum
      urlEnBase64: null, // Provide appropriate default value or structure for ResearchAndStudiesCategories
      urlAr: null, // Provide appropriate default value or structure for ResearchAndStudiesCategories
      urlArBase64: null,
      description: null,
    };
  }
  ngOnInit(): void {
    this.pondFiles;
    this.details();
  }

  pondOptions: FilePondOptions = {
    allowMultiple: false,
    labelIdle: 'Drop files here...',
    //allo: ['image/jpeg, image/png'],
    //acceptedFileTypes: ['image/jpeg, image/png'],
    allowReorder: true,
  };

  pondOptionsBook: FilePondOptions = {
    allowMultiple: true,
    labelIdle: 'Drop files here...',
    //allo: ['image/jpeg, image/png'],
    //acceptedFileTypes: ['image/jpeg, image/png'],
    allowReorder: true,
  };

  pondHandleInit() {}

  pondHandleAddFile(event: any, instanceName: string) {
    //const file: File | null = event.file;

    const file_ = event.file.file;

    this.imagesArray.push({
      fileName: file_,
      instance: instanceName,
      Name: file_.name,
      ext: file_.type,
    });
  }
  pondHandleActivateFile() {}
  pondHandleRemoveFile(event: any) {
    const removedFile = event.file;
    const index = this.imagesArray.findIndex(
      (item: { fileName: any }) => item.fileName === removedFile.file
    );

    if (index !== -1) {
      this.imagesArray.splice(index, 1);
    }
  }

  details() {
    this.govementService._details().subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success) {
          this.govermentModel = response.data;
        }
      },
    });
  }
  upload(type: number): void {
    this.progress = 0;

    const totalImages = this.imagesArray.length;
    let uploadedImages = 0;
    if (this.imagesArray.length > 0) {
      for (let index = 0; index < totalImages; index++) {
        this.uploadService
          .upload(this.imagesArray[index].fileName, 'InnovationBrief')
          .pipe(
            finalize(() => {
              uploadedImages++;
              if (uploadedImages === totalImages) {
                for (var _attachment of this.attachmentList) {
                  if (_attachment.instanceName == 'BannerEn') {
                    this.govermentModel.urlEn = _attachment.url;
                  } else if (_attachment.instanceName == 'BannerAr') {
                    this.govermentModel.urlAr = _attachment.url;
                  }
                }

                if (type == 0) {
                  this.addWithFile();
                } else {
                  this._update();
                }
              }
            })
          )
          .subscribe({
            next: (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round((100 * event.loaded) / event.total);
              } else if (event instanceof HttpResponse) {
                this.message = event.body.message;
                for (let attm of event.body.data as {
                  url: string;
                  name: string;
                  extension: string;
                  instanceName: string;
                }[]) {
                  if (attm !== null) {
                    //if (
                    //  this.imagesArray[index].instance === 'agendDownloadFile'
                    //) {
                    // Check if an attachment with the same fileName already exists in the agendaAttachmentModels array
                    const existingAttachment = this.attachmentList.find(
                      (a: { fileName: string }) => a.fileName === attm.name
                    );

                    if (!existingAttachment) {
                      // Create a new agendaAttachment
                      const newAttachment = {
                        fileName: attm.name,
                        url: attm.url,
                        ext: attm.extension,
                        urlBase64: '',
                        instanceName: this.imagesArray[index].instance, //attm.instanceName,
                      };

                      // Push the new attachment to the agendaAttachmentModels array
                      this.attachmentList.push(newAttachment);
                    }

                    // Set agendaAttachment properties (outside the condition to avoid duplicating code)
                    this.attachment.fileName = attm.name;
                    this.attachment.url = attm.url;
                    this.attachment.ext = attm.extension;
                    this.attachment.instanceName =
                      this.imagesArray[index].instance;
                    //}
                  }
                }
                this.fileInfos = this.uploadService.getFiles();
              }
            },
            error: (err: any) => {
              this.progress = 0;
              if (err.error && err.error.message) {
                this.message = err.error.message;
              } else {
                this.message = 'Could not upload the file!';
              }
              this.currentFile = undefined;
            },
          });
      }
    } else {
      if (type == 0) {
        this.addWithFile();
      } else {
        this._update();
      }
    }

    this.selectedFiles = undefined;
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

  update() {
    if (this.imagesArray != null && this.imagesArray.length > 0) {
      this.upload(1);
    } else {
      // Handle the case where no file is selected.
      this._update();
    }
  }

  add() {
    if (this.imagesArray != null && this.imagesArray.length > 0) {
      this.upload(0);
    } else {
      // Handle the case where no file is selected.
      this.addWithFile();
    }
  }
  addWithFile() {
    this.govementService._add(this.govermentModel).subscribe({
      next: (response: ResponseResult) => {
        if (
          response.statusCode == StatusCodes.success ||
          StatusCodes.add ||
          StatusCodes.update
        ) {
          this.details();
          this.tosterService.success(response.message);

          this.file = undefined;
          this.imagesArray = [];
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  _update() {
    this.govementService._add(this.govermentModel).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success || StatusCodes.update) {
          this.tosterService.success(response.message);
          this.details();
          this.file = undefined;
          this.imagesArray = [];
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }

  removeImage(instanceName: string) {
    if (this.govermentModel) {
      if (instanceName == 'BannerEn') {
        this.govermentModel.urlEn = '';
        this.govermentModel.urlEnBase64 = '';
      } else {
        this.govermentModel.urlAr = '';
        this.govermentModel.urlArBase64 = '';
      }
    }
  }
}
