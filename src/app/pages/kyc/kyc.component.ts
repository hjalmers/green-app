import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KycComponent {

  @ViewChild('kycForm') kycForm?: FormGroupDirective;

  kycFormGroup?: FormGroup;
  occupations$: Observable<any> = of([
    {
      key: 'Unemployed',
      value: 'unemployed'
    },
    {
      key: 'Studying',
      value: 'studying'
    }, {
      key: 'Employed',
      value: 'employed'
    }, {
      key: 'Self employed',
      value: 'self_employed'
    }]);

  constructor(private _fb: FormBuilder) {
    this.setupForm();
  }

  setupForm() {
    this.kycFormGroup = this._fb.group({
      firstName: ['', [ Validators.required, Validators.minLength(2) ]],
      lastName: ['', [ Validators.required ]],
      occupation: ['', [ Validators.required ]],
    });
  }

  save() {
    console.log(this.kycFormGroup?.value)
  }
}
