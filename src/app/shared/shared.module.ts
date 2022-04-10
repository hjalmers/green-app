import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { NggDropdownModule } from "@sebgroup/green-angular";
import {HttpClientModule} from "@angular/common/http";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    NggDropdownModule
  ],
  exports: [
    ReactiveFormsModule,
    HttpClientModule,
    NggDropdownModule
  ]
})
export class SharedModule { }
