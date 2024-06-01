import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { FilePondModule } from 'ngx-filepond';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccordionModule } from 'ngx-bootstrap/accordion';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    BsDropdownModule.forRoot(),
    DataTablesModule,
    NgSelectModule,
    TabsModule.forRoot(),
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
  ],

  exports: [
    BsDropdownModule,
    ToastrModule,
    NgxSpinnerModule,
    DataTablesModule,
    NgSelectModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    TabsModule,
    FilePondModule,
    BsDatepickerModule,
    AccordionModule,
  ],
})
export class SharedModule {}
