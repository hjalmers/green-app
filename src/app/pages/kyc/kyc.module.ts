import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KycRoutingModule } from './kyc-routing.module';
import { KycComponent } from './kyc.component';
import { CoreModule } from "../../core/core.module";
import { SharedModule } from "../../shared/shared.module";
import { KycFormModule } from "../../shared/features/kyc-form/kyc-form.module";


@NgModule({
  declarations: [
    KycComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    KycFormModule,
    KycRoutingModule
  ]
})
export class KycModule { }
