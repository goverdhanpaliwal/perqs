import { NgModule } from '@angular/core';
import { LocationDetail1 } from './locationDetail1';
import { IonicPageModule } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';


@NgModule({
  declarations: [
    LocationDetail1,
  ],
  imports: [
    IonicPageModule.forChild(LocationDetail1),
    Ionic2RatingModule
  ],
  exports: [
    LocationDetail1
  ]
})
export class LocationDetail1Module {}
