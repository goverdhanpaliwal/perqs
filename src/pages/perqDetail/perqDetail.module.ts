import { NgModule } from '@angular/core';
import { PerqDetail } from './perqDetail';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    PerqDetail,
  ],
  imports: [
    IonicPageModule.forChild(PerqDetail),
  ],
  exports: [
    PerqDetail
  ]
})
export class PerqDetailModule {}
