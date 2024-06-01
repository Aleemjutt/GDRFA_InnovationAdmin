// app/_about/about.module.ts
import { NgModule } from '@angular/core';
import { SharedModule } from '../_modules/shared.module';
import { AboutInnovatonCenterAddEditComponent } from './about_innovation_center/about-innovaton-center-add-edit/about-innovaton-center-add-edit.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AboutInnovatonCenterAddEditComponent,

    // other components in the about module
  ],
  imports: [
    SharedModule,
    FormsModule,
    TranslateModule,
    // other module imports
  ],
})
export class AboutModule {}
