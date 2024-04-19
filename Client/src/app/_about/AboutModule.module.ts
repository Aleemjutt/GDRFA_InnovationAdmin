// app/_about/about.module.ts
import { NgModule } from '@angular/core';
import { AboutInnovationCenterComponent } from './about_innovation_center/about-innovation-center.component';
import { SharedModule } from '../_modules/shared.module';
import { AboutInnovatonCenterAddEditComponent } from './about_innovation_center/about-innovaton-center-add-edit/about-innovaton-center-add-edit.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AboutInnovationCenterComponent,
    AboutInnovatonCenterAddEditComponent,

    // other components in the about module
  ],
  imports: [
    SharedModule,
    FormsModule,

    // other module imports
  ],
})
export class AboutModule {}
