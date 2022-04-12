import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {Observable, of, Subject, take, takeUntil} from "rxjs";
import {KycFormService} from "../../shared/features/kyc-form/services/kyc-form.service";
import {KycState} from "../../shared/features/kyc-form/state/kyc.service";
import {Kyc} from "../../shared/features/kyc-form/interfaces/kyc";

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KycComponent implements OnDestroy {

  unsubscribe$ = new Subject();
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

  isLoading$ = this.kycState.isLoading();

  constructor(private _fb: FormBuilder,
              private kycFormService: KycFormService,
              private kycState: KycState,
              private _cdr: ChangeDetectorRef) {
    this.kycState.get()
      .pipe(
        take(1)
      ).subscribe(state => this.setupForm(state))
  }

  setupForm(state: Kyc) {
    this.kycFormGroup = this._fb.group({
      firstName: [state.firstName || '', [ Validators.required, Validators.minLength(2) ]],
      lastName: [state.lastName || '', [ Validators.required ]],
      occupation: [state.occupation || '', [ Validators.required ]],
    });
    // since we use OnPush - mark the view as changed so that it can be checked again
    this._cdr.markForCheck();
  }

  save() {
    // only submit data if it's valid
    if(this.kycFormGroup?.valid) {
      this.kycFormService
        .save(this.kycFormGroup?.value)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(state => {
          console.log('Success! Form data has been saved!', state)
        }, error => {
          console.log('Error! Form data was not saved!', error)
        })
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
