import { NgModule } from '@angular/core';
import { Guide } from './guide';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    Guide,
  ],
  imports: [
    IonicPageModule.forChild(Guide),
  ],
  exports: [
    Guide
  ]
})
export class GuideModule {}
