import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserModule } from '@angular/platform-browser';
import { FilePondModule } from 'ngx-filepond';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    BsDropdownModule.forRoot(),
    DataTablesModule,
    NgSelectModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      closeButton: true,
    }),

    NgxSpinnerModule.forRoot({
      //type: 'line-scale-party',
      type: 'custom',
    }),
    NgxChartsModule,
    BrowserAnimationsModule,
    FilePondModule,
    BsDatepickerModule.forRoot(),
    AccordionModule.forRoot(),
    CommonModule,
    //TranslateModule,
  ],

  exports: [
    BsDropdownModule,
    ToastrModule,
    NgxSpinnerModule,
    DataTablesModule,
    NgSelectModule,
    NgxChartsModule,
    BrowserAnimationsModule,

    FilePondModule,
    BsDatepickerModule,
    AccordionModule,
    //TranslateModule,
  ],
})
export class SharedModule {}
