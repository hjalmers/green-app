import { Injectable } from '@angular/core';
import { KycFormModule } from "../kyc-form.module";
import { HttpClient } from "@angular/common/http";
import { catchError, tap } from "rxjs";
import { KycState } from "../state/kyc.service";
import { Kyc } from "../interfaces/kyc";

@Injectable({
  providedIn: KycFormModule
})
export class KycFormService {

  constructor(private http: HttpClient, private state: KycState) {
    // get initial state when service is initialized
    this.get().subscribe()
  }

  /** Save - Persist KYC form state
   * @param state - form state to save
   * @returns updated state as observable
   */
  save(state: Kyc) {
    this.state.setLoading();
    return this.http.post<Kyc>('/api/kyc', state).pipe(
      tap(res => {
        // update state
        this.state.setLoading(false);
        this.state.set(res);
      }),
      catchError(err => {
        this.state.setLoading(false);
        throw err;
      })
    )
  }

  /** Get - KYC form state
   * @returns state as observable
   */
  get() {
    this.state.setLoading();
    return this.http.get<Kyc>('/api/kyc').pipe(
      tap(res => {
        // update state
        this.state.setLoading(false);
        this.state.set(res)
      }),
      catchError(err => {
        this.state.setLoading(false);
        throw err;
      })
    )
  }
}
