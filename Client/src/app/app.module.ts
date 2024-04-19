import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from './_modules/shared.module';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { ErrorsInterceptor } from './_interceptors/errors.interceptor';
import { SideBarComponent } from './layout/side-bar/side-bar.component';
import { LogInComponent } from './log-in/log-in.component';
import { UsersListComponent } from './_users/users-list/users-list.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from './MultiTranslateHttpLoader';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import * as FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import * as FilepondPluginImageEdit from 'filepond-plugin-image-edit';
import * as FilepondPluginImagePreview from 'filepond-plugin-image-preview';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AboutModule } from './_about/AboutModule.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { applicationStateCheckInterceptor } from './_interceptors/application-state-check.interceptor';
import { InnovationConsultingAddEditComponent } from './_about/innovation_consulting/innovation-consulting-add-edit/innovation-consulting-add-edit.component';
registerPlugin(
  FilePondPluginFileValidateType,
  FilepondPluginImageEdit,
  FilepondPluginImagePreview
);

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    TestErrorComponent,
    SideBarComponent,
    LogInComponent,
    UsersListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    //AccordionModule.forRoot(),
    FormsModule,
    SharedModule,
    FilePondModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,

        useFactory: (http: HttpClient): MultiTranslateHttpLoader => {
          return new MultiTranslateHttpLoader(http, {
            resources: [
              { prefix: './assets/il8n/common/', suffix: '.json' },
              { prefix: './assets/il8n/login/', suffix: '.json' },
              { prefix: './assets/il8n/menu/', suffix: '.json' },
              { prefix: './assets/il8n/operation/', suffix: '.json' },
              { prefix: './assets/il8n/request/', suffix: '.json' },

              //#endregion User Profile *** End***
            ],
          });
        },
        deps: [HttpClient],
      },
    }),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    InnovationConsultingAddEditComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true },
    { provide: BsDropdownConfig, useValue: { autoClose: true } },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: applicationStateCheckInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  //return new TranslateHttpLoader(http, './assets/il8n/', '.json');
  //return new MultiTranslateHttpLoader(http);
}
