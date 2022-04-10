import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KycComponent {

  @ViewChild('kycForm') kycForm?: FormGroupDirective;

  kycFormGroup?: FormGroup;
  constructor(private _fb: FormBuilder) {
    this.setupForm();
  }

  setupForm() {
    this.kycFormGroup = this._fb.group({
      firstName: ['', [ Validators.required, Validators.minLength(2) ]],
    });
  }

}
