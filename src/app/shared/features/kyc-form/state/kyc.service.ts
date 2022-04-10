import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs";
import { KycFormModule } from "../kyc-form.module";
import { Kyc } from "../interfaces/kyc";

@Injectable({
  providedIn: KycFormModule
})
export class KycState {
  private _state$: ReplaySubject<Kyc> = new ReplaySubject(1);
  private _state: undefined | Kyc;

  constructor() {
  }

  /** Set - set state
   * @param state - new state
   */
  set(state: Kyc) {
    this._state = state;
    this._state$.next(this._state);
  }

  /** Get - get state
   * @returns state as observable (to prevent consumer from emitting new state)
   */
  get(): Observable<Kyc> {
    return this._state$.asObservable();
  }

  /** Get value - get state
   * @returns state as snapshot value
   */
  getValue(): Kyc | undefined {
    return this._state ? {...this._state} : undefined;
  }

}
