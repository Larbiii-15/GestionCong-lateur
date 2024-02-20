import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { RouterModule } from '@angular/router';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { EditModal } from './edit-modal';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ReactiveFormsModule,
    //Tab2PageRoutingModule,
    RouterModule.forChild([{path:'', component: Tab2Page}])
  ],
  declarations: [Tab2Page, EditModal]
  //entryComponents: [EditModal]
})
export class Tab2PageModule {}
