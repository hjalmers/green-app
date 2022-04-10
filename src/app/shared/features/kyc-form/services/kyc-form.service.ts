import { Injectable } from '@angular/core';
import { KycFormModule } from "../kyc-form.module";
import { HttpClient } from "@angular/common/http";
import { Kyc } from "../interfaces/kyc";

@Injectable({
  providedIn: KycFormModule
})
export class KycFormService {

  constructor(private http: HttpClient) {
    // get initial state when service is initialized
    this.get().subscribe()
  }

  /** Save - Persist KYC form state
   * @param state - form state to save
   * @returns updated state as observable
   */
  save(state: Kyc) {
    return this.http.post<Kyc>('/api/kyc', state);
  }

  /** Get - KYC form state
   * @returns state as observable
   */
  get() {
    return this.http.get<Kyc>('/api/kyc');
  }
}