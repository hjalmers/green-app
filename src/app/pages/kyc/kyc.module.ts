import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KycRoutingModule } from './kyc-routing.module';
import { KycComponent } from './kyc.component';


@NgModule({
  declarations: [
    KycComponent
  ],
  imports: [
    CommonModule,
    KycRoutingModule
  ]
})
export class KycModule { }
