import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { NggDropdownModule } from "@sebgroup/green-angular";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NggDropdownModule
  ],
  exports: [
    ReactiveFormsModule,
    NggDropdownModule
  ]
})
export class SharedModule { }
