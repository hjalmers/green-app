import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KycRoutingModule } from './kyc-routing.module';
import { KycComponent } from './kyc.component';
import { CoreModule } from "../../core/core.module";
import { SharedModule } from "../../shared/shared.module";


@NgModule({
  declarations: [
    KycComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    KycRoutingModule
  ]
})
export class KycModule { }
