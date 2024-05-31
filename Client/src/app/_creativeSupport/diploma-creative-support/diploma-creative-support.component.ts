import { CommonModule } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FilePondOptions } from 'filepond';
import { FilePondModule } from 'ngx-filepond';
import { ToastrService } from 'ngx-toastr';
import { Observable, finalize } from 'rxjs';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { ResponseResult, StatusCodes } from 'src/app/_models/responseResult';
import { CreativeSupportService } from 'src/app/_services/_creativeSupport/creative-support.service';
import { UploadServiceService } from 'src/app/_services/upload-service.service';

@Component({
  selector: 'app-diploma-creative-support',
  standalone: true,
  imports: [CommonModule, FormsModule, FilePondModule, TranslateModule],
  templateUrl: './diploma-creative-support.component.html',
  styleUrl: './diploma-creative-support.component.css',
})
export class DiplomaCreativeSupportComponent implements OnInit {
  awardDetailModel: any;
  constructor(
    public globalService: GlobalServiceService,
    private creativeSupport: CreativeSupportService,
    private toasterService: ToastrService,
    private uploadService: UploadServiceService
  ) {}
  creativeDiploma: any;
  pondFiles: FilePondOptions['files'] = [];

  progress: number | undefined;
  currentFile: File | undefined;
  message: any;
  selectedFiles?: FileList;
  attachmentList: any = [];
  fileInfos?: Observable<any>;
  file: File | undefined;
  attachment: any;

  ngOnInit(): void {
    console.log('i have called');
    this.Details();
  }

  pondOptions: FilePondOptions = {
    allowMultiple: false,
    labelIdle: 'Drop files here...',
    //allo: ['image/jpeg, image/png'],
    //acceptedFileTypes: ['image/jpeg, image/png'],
    allowReorder: true,
  };

  pondHandleInit() {}

  pondHandleAddFile(event: any) {
    //const file: File | null = event.file;
    this.file = event.file.file;
  }
  pondHandleActivateFile(event: any) {}
  pondHandleRemoveFile(event: any) {}

  removeImage() {
    if (this.creativeDiploma) {
      this.creativeDiploma.url = '';
      this.creativeDiploma.urlBase64 = '';
    }
  }

  _add() {
    this.creativeSupport.add(this.creativeDiploma).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success || StatusCodes.update) {
          this.toasterService.success(response.message);
          this.Details();
        } else {
          this.toasterService.error(response.message);
        }
      },
    });
  }

  Details() {
    console.log('i am called in details');
    this.creativeSupport._getDetails().subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success || StatusCodes.update) {
          this.creativeDiploma = response.data;
        } else {
          this.toasterService.error(response.message);
        }
      },
    });
  }

  add() {
    if (this.file != null) {
      this.upload(this.file, 1);
    } else {
      // Handle the case where no file is selected.
      this._add();
    }
  }

  upload(file: File | undefined, type: number): void {
    this.progress = 0;

    if (file) {
      this.currentFile = file;

      this.uploadService
        .upload(this.currentFile, 'Diploma')
        .pipe(
          finalize(() => {
            if (this.attachmentList.length > 0) {
              this.creativeDiploma.url = this.attachmentList[0].imageUrl;
              this._add();
            }
          })
        )
        .subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              for (let attm of event.body.data as { url: string }[]) {
                const attachment = {
                  imageUrl: attm.url,
                };
                this.attachmentList.push(attachment);
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

    this.selectedFiles = undefined;
  }
}
