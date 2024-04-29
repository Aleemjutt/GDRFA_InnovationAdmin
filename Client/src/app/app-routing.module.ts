import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { authGuard } from './_guards/auth.guard';
import { AboutInnovatonCenterAddEditComponent } from './_about/about_innovation_center/about-innovaton-center-add-edit/about-innovaton-center-add-edit.component';
import { AboutInnovatonCenterDetailsComponent } from './_about/about_innovation_center/about-innovaton-center-details/about-innovaton-center-details.component';
import { MembershipListsComponent } from './_about/membership/membership-lists/membership-lists.component';
import { MembershipAddEditComponent } from './_about/membership/membership-add-edit/membership-add-edit.component';
import { MembershipDetailsComponent } from './_about/membership/membership-details/membership-details.component';
import { AwardsListsComponent } from './_about/awards/awards-lists/awards-lists.component';
import { AwardsDetailsComponent } from './_about/awards/awards-details/awards-details.component';
import { AwardsAddEditComponent } from './_about/awards/awards-add-edit/awards-add-edit.component';
import { ArchivesListsComponent } from './_about/archives/archives-lists/archives-lists.component';
import { ArchivesDetailsComponent } from './_about/archives/archives-details/archives-details.component';
import { ArchivesAddEditComponent } from './_about/archives/archives-add-edit/archives-add-edit.component';
import { CreditsListComponent } from './_about/credits/credits-list/credits-list.component';
import { CreditsDetailsComponent } from './_about/credits/credits-details/credits-details.component';
import { CreditsAddEditComponent } from './_about/credits/credits-add-edit/credits-add-edit.component';
import { PartnersListsComponent } from './_about/partners/partners-lists/partners-lists.component';
import { PartnersAddEditComponent } from './_about/partners/partners-add-edit/partners-add-edit.component';
import { AgendaListsComponent } from './_about/agenda/agenda-lists/agenda-lists.component';
import { PartnersDetailsComponent } from './_about/partners/partners-details/partners-details.component';
import { AgendaDetailsComponent } from './_about/agenda/agenda-details/agenda-details.component';
import { InnovationConsultingDetailsComponent } from './_about/innovation_consulting/innovation-consulting-details/innovation-consulting-details.component';
import { InnovationConsultingAddEditComponent } from './_about/innovation_consulting/innovation-consulting-add-edit/innovation-consulting-add-edit.component';
import { MembershipAddComponent } from './_about/membership/membership-add/membership-add.component';
import { ReqeustListComponent } from './_consultingRequest/reqeust-list/reqeust-list.component';
import { IdeatListComponent } from './_Ideas/ideat-list/ideat-list.component';
import { IdeaPoineerssListComponent } from './_Ideas/idea-poineerss-list/idea-poineerss-list.component';
import { IdeaToolsListComponent } from './_Ideas/idea-tools-list/idea-tools-list.component';
import { IdeaJurneyComponent } from './_Ideas/idea-jurney/idea-jurney.component';
import { TargetCompainsListComponent } from './_Ideas/target-compains-list/target-compains-list.component';
import { TargetCompainAnswerListComponent } from './_Ideas/target-compain-answer-list/target-compain-answer-list.component';
import { InnovationConsultingListsComponent } from './_about/innovation_consulting/innovation-consulting-lists/innovation-consulting-lists.component';
import { EstabishingDubaiFutureListComponent } from './_futureFocused/estabishing-dubai-future-list/estabishing-dubai-future-list.component';
import { DubaiResidencyListsComponent } from './_futureFocused/dubai-residency-lists/dubai-residency-lists.component';
import { EstablishedChallengedAnswerListComponent } from './_futureFocused/established-challenged-answer-list/established-challenged-answer-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'about/edit',
    component: AboutInnovatonCenterAddEditComponent,
    //canActivate: [authGuard],
  },
  {
    path: 'about/details',
    component: AboutInnovatonCenterDetailsComponent,
    //canActivate: [authGuard],
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'memberships',
        component: MembershipListsComponent,
      },
      { path: 'memberships/create', component: MembershipAddComponent },

      //{ path: 'post/create', component: CreateComponent },
      { path: 'memberships/:id/edit', component: MembershipAddEditComponent },

      // { path: 'memberships/details', component: MembershipDetailsComponent },
      // {
      //   path: 'memberships/AddEdit',
      //   component: MembershipAddEditComponent,
      //   //canDeactivate: [preventUnsavedChangesGuard],
      // },
    ],
  },
  { path: 'memberships/:id/view', component: MembershipDetailsComponent },

  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'awards',
        component: AwardsListsComponent,
      },
      { path: 'awards/details', component: AwardsDetailsComponent },
      {
        path: 'awards/edit',
        component: AwardsAddEditComponent,
        //canDeactivate: [preventUnsavedChangesGuard],
      },
    ],
  },

  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'archives',
        component: ArchivesListsComponent,
      },
      { path: 'archives/details', component: ArchivesDetailsComponent },
      {
        path: 'archives/edit',
        component: ArchivesAddEditComponent,
        //canDeactivate: [preventUnsavedChangesGuard],
      },
    ],
  },

  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'credits',
        component: CreditsListComponent,
      },
      { path: 'credits/details', component: CreditsDetailsComponent },
      {
        path: 'credits/edit',
        component: CreditsAddEditComponent,
        //canDeactivate: [preventUnsavedChangesGuard],
      },
    ],
  },

  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'partners',
        component: PartnersListsComponent,
      },
      { path: 'partners/details', component: PartnersDetailsComponent },
      {
        path: 'partners/edit',
        component: PartnersAddEditComponent,
        //canDeactivate: [preventUnsavedChangesGuard],
      },
    ],
  },

  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'agenda',
        component: AgendaListsComponent,
      },
      { path: 'agenda/details', component: AgendaDetailsComponent },
      {
        path: 'agenda/edit',
        component: PartnersAddEditComponent,
        //canDeactivate: [preventUnsavedChangesGuard],
      },
    ],
  },
  {
    path: 'consulting/details',
    component: InnovationConsultingDetailsComponent,
  },
  {
    path: 'consulting/edit',
    component: InnovationConsultingAddEditComponent,
    //canDeactivate: [preventUnsavedChangesGuard],
  },
  {
    path: 'consulting/list',
    component: InnovationConsultingListsComponent,
    //canDeactivate: [preventUnsavedChangesGuard],
  },

  {
    path: 'consultingRequest/List',
    component: ReqeustListComponent,
    //canDeactivate: [preventUnsavedChangesGuard],
  },

  ///******** Idea Start********///
  {
    path: 'idea/list',
    component: IdeatListComponent,
    //canDeactivate: [preventUnsavedChangesGuard],
  },

  {
    path: 'idea/poineersList',
    component: IdeaPoineerssListComponent,
    //canDeactivate: [preventUnsavedChangesGuard],
  },

  {
    path: 'idea/tools',
    component: IdeaToolsListComponent,
    //canDeactivate: [preventUnsavedChangesGuard],
  },

  {
    path: 'idea/jurney',
    component: IdeaJurneyComponent,
    //canDeactivate: [preventUnsavedChangesGuard],
  },

  {
    path: 'idea/targetCompainList',
    component: TargetCompainsListComponent,
    //canDeactivate: [preventUnsavedChangesGuard],
  },

  {
    path: 'futureFocused/dubaiResidencyList',
    component: DubaiResidencyListsComponent,
    //canDeactivate: [preventUnsavedChangesGuard],
  },

  {
    path: 'futureFocused/establishingFutureFocusedList',
    component: EstabishingDubaiFutureListComponent,
    //canDeactivate: [preventUnsavedChangesGuard],
  },

  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'establisehdAnswerlist/:id',
        component: EstablishedChallengedAnswerListComponent,
      },
    ],
  },

  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'targetCompainAnswer/:id',
        component: TargetCompainAnswerListComponent,
      },
    ],
  },
  ///******** Idea End********///

  { path: '**', component: HomeComponent, pathMatch: 'full' },
  // {
  //   path: '',
  //   runGuardsAndResolvers: 'always',
  //   canActivate: [authGuard],
  //   children: [
  //     {
  //       path: 'members',
  //       component: MembersListComponent,
  //     },
  //     { path: 'members/:Id', component: MembersDetailsComponent },
  //     { path: 'lists', component: ListsComponent },
  //     { path: 'messages', component: MessagesComponent },
  //   ],
  // },

  // { path: 'users', component: UsersListComponent, canActivate: [authGuard] },
  // {
  //   path: 'rolesList',
  //   component: RolesListComponent,
  //   canActivate: [authGuard],
  // },
  // {
  //   path: 'permissionSetup',
  //   component: PermissionSettingComponent,
  //   canActivate: [authGuard],
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
