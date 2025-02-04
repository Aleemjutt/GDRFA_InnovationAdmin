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
import { IntellectualPropertyIndexService } from 'src/app/_services/_intellectualProperty/intellectual-property-index.service';
import { UploadServiceService } from 'src/app/_services/upload-service.service';

@Component({
  selector: 'app-overintellectual-property-index',
  standalone: true,
  imports: [CommonModule, FormsModule, FilePondModule, TranslateModule],
  templateUrl: './overintellectual-property-index.component.html',
  styleUrl: './overintellectual-property-index.component.css',
})
export class OverintellectualPropertyIndexComponent implements OnInit {
  constructor(
    public globalService: GlobalServiceService,
    private intellectualService: IntellectualPropertyIndexService,
    private toasterService: ToastrService,
    private uploadService: UploadServiceService
  ) {}
  overViewPropertyModel: any;
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
    if (this.overViewPropertyModel) {
      this.overViewPropertyModel.url = '';
      this.overViewPropertyModel.urlBase64 = '';
    }
  }

  _add() {
    this.intellectualService._add(this.overViewPropertyModel).subscribe({
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
    this.intellectualService._details().subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success || StatusCodes.update) {
          this.overViewPropertyModel = response.data;
        } else {
          this.toasterService.error(response.message);
        }
      },
    });
  }

  _validateModel(): boolean {
    // return this.globalService.validateModel(this.interviewViewModel, [
    //   'nameAr',
    //   'nameEn',
    // ]);

    return this.globalService.validateModel(this.overViewPropertyModel, [
      { key: 'aboutDescriptionEn' },
      { key: 'aboutDescriptionAr' },
      { key: 'descriptionEn' },
      { key: 'descriptionAr' },
    ]);
  }

  add() {
    if (this._validateModel()) {
      if (this.file != null) {
        this.upload(this.file, 1);
      } else {
        // Handle the case where no file is selected.
        this._add();
      }
    } else {
      this.toasterService.error(
        this.globalService.getRequiredFiledErrorMessage()
      );
    }
  }

  upload(file: File | undefined, type: number): void {
    this.progress = 0;

    if (file) {
      this.currentFile = file;

      this.uploadService
        .upload(this.currentFile, 'IntectuallProperties')
        .pipe(
          finalize(() => {
            if (this.attachmentList.length > 0) {
              this.overViewPropertyModel.url = this.attachmentList[0].imageUrl;
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
