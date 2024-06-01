import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FilePondModule } from 'ngx-filepond';
import { ToastrService } from 'ngx-toastr';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import {
  DubaiResidencyCentenaryModel,
  DubaiResidencyCentenaryPointsLineModel,
  DubaiResidencyCentenaryPointsMainModel,
} from 'src/app/_models/FutureFocused/dubaiResidancy';
import { DubaiResidencayService } from 'src/app/_services/_futureFocused/dubai-residencay.service';

@Component({
  selector: 'app-idea-pioneer',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './idea-pioneer.component.html',
  styleUrl: './idea-pioneer.component.css',
})
export class IdeaPioneerComponent {
  ideaPionnerModel: any;
}
