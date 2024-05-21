import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilePondOptions } from 'filepond';
import { FilePondModule } from 'ngx-filepond/lib/ngx-filepond.module';
import { ToastrService } from 'ngx-toastr/toastr/toastr.service';
import { Observable } from 'rxjs';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { ResponseResult, StatusCodes } from 'src/app/_models/responseResult';
import { CreativeSupportService } from 'src/app/_services/_creativeSupport/creative-support.service';

@Component({
  selector: 'app-diploma-creative-support',
  standalone: true,
  imports: [CommonModule, FormsModule, FilePondModule],
  templateUrl: './diploma-creative-support.component.html',
  styleUrl: './diploma-creative-support.component.css',
})
export class DiplomaCreativeSupportComponent implements OnInit {
  creativeDiploma: any;
  pondFiles: FilePondOptions['files'] = [];
  constructor(
    public globalService: GlobalServiceService,

    private creativeSupport: CreativeSupportService,
    private toasterService: ToastrService
  ) {}

  progress: number | undefined;
  currentFile: File | undefined;
  message: any;
  selectedFiles?: FileList;
  attachmentList: any = [];
  fileInfos?: Observable<any>;
  file: File | undefined;
  attachment: any;
  ngOnInit(): void {
    this.getDetails;
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

  add() {
    this.creativeSupport.add(this.creativeDiploma).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success || StatusCodes.update) {
          this.getDetails();
        } else {
          this.toasterService.error(response.message);
        }
      },
    });
  }

  getDetails() {
    this.creativeSupport.getIdeaDetails().subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == StatusCodes.success || StatusCodes.update) {
          this.creativeDiploma = response.data;
        } else {
          this.toasterService.error(response.message);
        }
      },
    });
  }
}
