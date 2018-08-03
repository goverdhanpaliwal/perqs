import { NgModule } from '@angular/core';
import { LocationDetail } from './locationDetail';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    LocationDetail,
  ],
  imports: [
    IonicPageModule.forChild(LocationDetail),
  ],
  exports: [
    LocationDetail
  ]
})
export class LocationDetailModule {}
