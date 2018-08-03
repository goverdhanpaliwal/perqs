import { Component } from '@angular/core';

import { PerqsList } from '../perqsList/perqsList';
import { LocationsList } from '../locationsList/locationsList';
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = PerqsList;
  tab3Root = LocationsList;
  tab4Root = ProfilePage;

  constructor() {

  }
}
