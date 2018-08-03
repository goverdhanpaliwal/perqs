import { NgModule } from '@angular/core';
import { LocationsListMapPage } from './locationsListMap';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    LocationsListMapPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationsListMapPage),
  ],
  exports: [
    LocationsListMapPage
  ]
})
export class LocationsListMapPageModule {}
