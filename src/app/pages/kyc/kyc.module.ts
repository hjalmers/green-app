import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KycRoutingModule } from './kyc-routing.module';
import { KycComponent } from './kyc.component';
import { CoreModule } from "../../core/core.module";


@NgModule({
  declarations: [
    KycComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    KycRoutingModule
  ]
})
export class KycModule { }
