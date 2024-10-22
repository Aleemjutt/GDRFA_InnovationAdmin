import { ModuleWithProviders, NgModule } from '@angular/core';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from './_modules/shared.module';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { ErrorsInterceptor } from './_interceptors/errors.interceptor';
import { SideBarComponent } from './layout/side-bar/side-bar.component';
import { LogInComponent } from './log-in/log-in.component';
import { UsersListComponent } from './_users/users-list/users-list.component';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from './MultiTranslateHttpLoader';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import * as FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import * as FilepondPluginImageEdit from 'filepond-plugin-image-edit';
import * as FilepondPluginImagePreview from 'filepond-plugin-image-preview';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { applicationStateCheckInterceptor } from './_interceptors/application-state-check.interceptor';
import { RecursiveMenuComponent } from './recursive-menu/recursive-menu.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AboutModule } from './_about/AboutModule.module';
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
    RecursiveMenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    //AccordionModule.forRoot(),
    FormsModule,
    SharedModule,
    AboutModule,
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
              { prefix: './assets/il8n/Home/', suffix: '.json' },
              { prefix: './assets/il8n/common/', suffix: '.json' },
              { prefix: './assets/il8n/login/', suffix: '.json' },
              { prefix: './assets/il8n/menu/', suffix: '.json' },
              {
                prefix: './assets/il8n/aboutUs/aboutInnovationCenter/',
                suffix: '.json',
              },
              { prefix: './assets/il8n/aboutUs/agenda/', suffix: '.json' },
              { prefix: './assets/il8n/aboutUs/archives/', suffix: '.json' },
              { prefix: './assets/il8n/aboutUs/awards/', suffix: '.json' },
              { prefix: './assets/il8n/aboutUs/credits/', suffix: '.json' },
              {
                prefix: './assets/il8n/aboutUs/innovationConsulting/',
                suffix: '.json',
              },
              { prefix: './assets/il8n/aboutUs/membership/', suffix: '.json' },
              { prefix: './assets/il8n/aboutUs/partners/', suffix: '.json' },
              { prefix: './assets/il8n/consultingRequest/', suffix: '.json' },
              {
                prefix:
                  './assets/il8n/creativeSupport/DiplomaInCreativeSupport/',
                suffix: '.json',
              },
              {
                prefix: './assets/il8n/creativeSupport/JoinProgram/',
                suffix: '.json',
              },
              {
                prefix: './assets/il8n/futureFocused/dubaiResidancy/',
                suffix: '.json',
              },
              {
                prefix: './assets/il8n/futureFocused/establishedChallengies/',
                suffix: '.json',
              },
              { prefix: './assets/il8n/idea/ideaJurney/', suffix: '.json' },
              { prefix: './assets/il8n/idea/ideaPioneers/', suffix: '.json' },
              { prefix: './assets/il8n/idea/myThoughts/', suffix: '.json' },
              { prefix: './assets/il8n/idea/targetCompain/', suffix: '.json' },
              { prefix: './assets/il8n/idea/submityourIdea/', suffix: '.json' },
              {
                prefix: './assets/il8n/innovationPossibilites/',
                suffix: '.json',
              },

              {
                prefix:
                  './assets/il8n/intellectualProperty/overViewofIntelllectualProperty/',
                suffix: '.json',
              },
              {
                prefix:
                  './assets/il8n/intellectualProperty/registerPropertiesList/',
                suffix: '.json',
              },
              {
                prefix:
                  './assets/il8n/intellectualProperty/typeofIntellectualProperty/',
                suffix: '.json',
              },
              { prefix: './assets/il8n/knowledge/goverment/', suffix: '.json' },
              {
                prefix: './assets/il8n/knowledge/innovationBrief/',
                suffix: '.json',
              },
              {
                prefix: './assets/il8n/knowledge/researchCenterAndStudies/',
                suffix: '.json',
              },
              {
                prefix: './assets/il8n/knowledge/version/',
                suffix: '.json',
              },

              {
                prefix: './assets/il8n/researchCenter/',
                suffix: '.json',
              },

              {
                prefix: './assets/il8n/settings/users/',
                suffix: '.json',
              },
              //#endregion User Profile *** End***
            ],
          });
        },
        deps: [HttpClient],
      },
    }),

    BsDatepickerModule.forRoot(),
    MatTabsModule,
    //RouterModule.forRoot(routes),
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
