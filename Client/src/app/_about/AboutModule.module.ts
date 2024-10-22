// app/_about/about.module.ts
import { NgModule } from '@angular/core';
import { SharedModule } from '../_modules/shared.module';
import { AboutInnovatonCenterAddEditComponent } from './about_innovation_center/about-innovaton-center-add-edit/about-innovaton-center-add-edit.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    MatTabsModule,
    // other module imports
  ],
  declarations: [
    AboutInnovatonCenterAddEditComponent,

    // other components in the about module
  ],
})
export class AboutModule {}
