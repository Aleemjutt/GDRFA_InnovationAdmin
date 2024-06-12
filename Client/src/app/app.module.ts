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
import { RouterModule, Routes } from '@angular/router';
import { DiplomaCreativeSupportComponent } from './_creativeSupport/diploma-creative-support/diploma-creative-support.component';
import { OverintellectualPropertyIndexComponent } from './_intellectualProperty/overintellectual-property-index/overintellectual-property-index.component';
import { InnovativeEntrepreneurshipProgramListComponent } from './_innovationPossiblities/innovative-entrepreneurship-program-list/innovative-entrepreneurship-program-list.component';
import { TargetCompainAnswerListComponent } from './_Ideas/target-compain-answer-list/target-compain-answer-list.component';
import { authGuard } from './_guards/auth.guard';
import { EstablishedChallengedAnswerListComponent } from './_futureFocused/established-challenged-answer-list/established-challenged-answer-list.component';
import { EstabishingDubaiFutureListComponent } from './_futureFocused/estabishing-dubai-future-list/estabishing-dubai-future-list.component';
import { DubaiResidencyListsComponent } from './_futureFocused/dubai-residency-lists/dubai-residency-lists.component';
import { TargetCompainsListComponent } from './_Ideas/target-compains-list/target-compains-list.component';
import { IdeatListComponent } from './_Ideas/ideat-list/ideat-list.component';
import { IdeaPoineerssListComponent } from './_Ideas/idea-poineerss-list/idea-poineerss-list.component';
import { AwardsListsComponent } from './_about/awards/awards-lists/awards-lists.component';
import { MembershipDetailsComponent } from './_about/membership/membership-details/membership-details.component';
import { AwardsDetailsComponent } from './_about/awards/awards-details/awards-details.component';
import { AwardsAddEditComponent } from './_about/awards/awards-add-edit/awards-add-edit.component';
import { MembershipListsComponent } from './_about/membership/membership-lists/membership-lists.component';
import { MembershipAddComponent } from './_about/membership/membership-add/membership-add.component';
import { MembershipAddEditComponent } from './_about/membership/membership-add-edit/membership-add-edit.component';
import { RecursiveMenuComponent } from './recursive-menu/recursive-menu.component';
registerPlugin(
  FilePondPluginFileValidateType,
  FilepondPluginImageEdit,
  FilepondPluginImagePreview
);

// const routes: Routes = [
//   { path: '', component: HomeComponent },
//   {
//     path: 'home',
//     component: HomeComponent,
//   },
//   {
//     path: 'about/edit',
//     component: AboutInnovatonCenterAddEditComponent,
//     //canActivate: [authGuard],
//   },
//   {
//     path: 'about/details',
//     component: AboutInnovatonCenterDetailsComponent,
//     //canActivate: [authGuard],
//   },
//   {
//     path: '',
//     runGuardsAndResolvers: 'always',
//     canActivate: [authGuard],
//     children: [
//       {
//         path: 'memberships',
//         component: MembershipListsComponent,
//       },
//       { path: 'memberships/create', component: MembershipAddComponent },

//       //{ path: 'post/create', component: CreateComponent },
//       { path: 'memberships/:id/edit', component: MembershipAddEditComponent },

//       // { path: 'memberships/details', component: MembershipDetailsComponent },
//       // {
//       //   path: 'memberships/AddEdit',
//       //   component: MembershipAddEditComponent,
//       //   //canDeactivate: [preventUnsavedChangesGuard],
//       // },
//     ],
//   },
//   { path: 'memberships/:id/view', component: MembershipDetailsComponent },

//   {
//     path: '',
//     runGuardsAndResolvers: 'always',
//     canActivate: [authGuard],
//     children: [
//       {
//         path: 'awards',
//         component: AwardsListsComponent,
//       },
//       { path: 'awards/details', component: AwardsDetailsComponent },
//       {
//         path: 'awards/edit',
//         component: AwardsAddEditComponent,
//         //canDeactivate: [preventUnsavedChangesGuard],
//       },
//     ],
//   },

//   ///******** Idea Start********///
//   {
//     path: 'idea/list',
//     component: IdeatListComponent,
//     //canDeactivate: [preventUnsavedChangesGuard],
//   },

//   {
//     path: 'idea/poineersList',
//     component: IdeaPoineerssListComponent,
//     //canDeactivate: [preventUnsavedChangesGuard],
//   },

//   {
//     path: 'idea/targetCompainList',
//     component: TargetCompainsListComponent,
//     //canDeactivate: [preventUnsavedChangesGuard],
//   },

//   {
//     path: 'futureFocused/dubaiResidencyList',
//     component: DubaiResidencyListsComponent,
//     //canDeactivate: [preventUnsavedChangesGuard],
//   },

//   {
//     path: 'futureFocused/establishingFutureFocusedList',
//     component: EstabishingDubaiFutureListComponent,
//     //canDeactivate: [preventUnsavedChangesGuard],
//   },

//   {
//     path: '',
//     runGuardsAndResolvers: 'always',
//     canActivate: [authGuard],
//     children: [
//       {
//         path: 'establisehdAnswerlist/:id',
//         component: EstablishedChallengedAnswerListComponent,
//       },
//     ],
//   },

//   {
//     path: '',
//     runGuardsAndResolvers: 'always',
//     canActivate: [authGuard],
//     children: [
//       {
//         path: 'targetCompainAnswer/:id',
//         component: TargetCompainAnswerListComponent,
//       },
//     ],
//   },

//   {
//     path: 'innovationPossibilities/innovativeEntrepreneurshipList',
//     component: InnovativeEntrepreneurshipProgramListComponent,
//     //canDeactivate: [preventUnsavedChangesGuard],
//   },

//   ///******** Idea End********///

//   {
//     path: 'creativeSupport/diplomaInCreativeSupport',
//     component: DiplomaCreativeSupportComponent,
//     //canDeactivate: [preventUnsavedChangesGuard],
//   },

//   ///******** Intellectual Properties Start********///

//   {
//     path: 'intellectualProperty/overView',
//     component: OverintellectualPropertyIndexComponent,
//     //canDeactivate: [preventUnsavedChangesGuard],
//   },

//   ///******** Intellectual Properties Start********///
//   {
//     path: 'users/userList',
//     component: UsersListComponent,
//     //canDeactivate: [preventUnsavedChangesGuard],
//   },

//   { path: '**', component: HomeComponent, pathMatch: 'full' },
// ];

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
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),

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
