# Angular tutorial

**In this tutorial we're going to:**

- Create a new Angular project using Angular CLI
- Add Green Angular (SEB:s design system)
- Implement a project structure with feature modules and lazy loaded routes
- Implement reactive forms with error handling and validation
- Add a service for api calls
- Add local proxy and mock server for local development without backend
- Implement a simple state store using RxJs

## Prerequisites

- Node.js
- Angular Cli

Visit [angular.io/guide/setup-local](https://angular.io/guide/setup-local) for more info.

### Before we begin
If you'd like to follow along this tutorial and compare your app with the "final" version, clone this repo and jump to a specific step using `git checkout ':/step-*'`. 
E.g. if you'd like to jump to step 8 juste do:

```
git checkout ':/step-8'
```

## Part 1 - Creating a new app with Green

In this part we'll create a new project/app and add Green Angular which is SEB:s new Design System with components built for Angular. 

### Step 1 - Generate a new Angular app

Open a terminal and navigate to the directory where you want to create the app. If you're planing on using Github, I'd recommend using a folder which corresponds to the organisation were the repo will be hosted eg. If your app is called `green-app` and you plan on adding the repository to the organisation `foo` you should create a folder called `foo` and run the following command from that directory:

```
ng new green-app
```

When prompted, reply to the questions below with the following answers:
```
Would you like to add Angular routing? Yes
Which stylesheet format would you like to use? SCSS
```

Navigate to the project `cd green-app` and start it by running `npm start`, then open a browser and navigate to http://localhost:4200 to view the app.

### Step 2 - Add Green Angular

Install latest version using npm and save it as dependency:
```
npm i @sebgroup/green-angular --save
```

Once installed, open `styles.scss` located in the `src` folder and add the following line to add the scss (css) needed to use SEB Green:

```scss
@use '~@sebgroup/chlorophyll/scss';
```

***Note:** in previous versions you had to set the font path like this: `@use '~@sebgroup/chlorophyll/scss' with ($font-path: '../fonts')`but it's not necessary anymore.*

Open `app.component.html` and replace the contents with the following:

```html
<div class="container-fluid">
  <h1 class="my-4">Green App</h1>
  <router-outlet></router-outlet>
  <button type="button">Secondary button</button>
</div>
```

If we go back the browser we should now see a header with correct font as well a secondary button styled correctly.

## Part 2 - Project structure

To create a lean app and to improve [FCP](https://web.dev/fcp/) (First Contentful Paint) as well as [LCP](https://web.dev/lcp/) (Largest Contentful Paint) it's considered best practice to divide the app into separate bundles. The goal is to make the main bundle small while at the same time present something meaningful to the user. We can achieve this by keeping the `app.module.ts` clean and instead add features and dependencies to other modules that are loaded separately when needed and asked for by the user. A small `app.module` typically means a lower LCP as we're only loading what the user/view needs (if done right). If we add everything to `app.module` everything needs to be loaded before the browser can display any content.

One common way to do it, is to scope each module to a specific domain, feature, part of the app or a page. Some modules will be shared and reused while others will only be used and referenced once.
Angular.io has some good articles on [feature modules](https://angular.io/guide/feature-modules) as well as [different types of modules](https://angular.io/guide/module-types) if you want to dive deeper.


### Step 3 - Add lazy loaded module for first page

We're going to start by adding a module for our first page `kyc` and lazy load it using the angular router when users navigate to `/kyc`.

```
ng g module pages/kyc --module app.module  --routing --route kyc
```

***Note:** View more info on how to [generate modules](https://angular.io/cli/generate#module) over att angular.io*.

Remove the following part from `app.component.html` as we don't want the button there anymore.
```html
<button type="button">Secondary button</button>
```
Navigate to http://localhost:4200/kyc and view our new page.


### Step 4 - Add core module
We're going to begin with creating a core module that will contain everything that is essential for the app to start. Depending on the nature of the app this module could be added to `app.module` straight away, but typically you'd add it to all the other modules that rely on these core services, interceptors, guards etc. that the whole app needs and uses. Don't forget to export things you add to a module that will be re-used.
```
ng g module core
```

Add the new core module to `kyc.modue.ts`.

Our simple app won't import or export anything from the core module, but we'll create it anyway as it will be used when the app grows.

### Step 5 - Add shared module
The shared module contains shared features, components, pipes and services etc. a bit similar to core but things added to shared are not used by all modules, and they're not necessarily imported and exported by the main `shared.module.ts` if it's provided. I'd recommend keeping the main `shared.module.ts` small too and export less used and referenced modules as separate modules that will need to be imported by all modules who need them. It's nice to put them in the same shared folder though just to stick with the convention of splitting code into core, shared and specific single usage. 
```
ng g module shared
```

We're going to import `ReactiveFormsModule` as well as `NggDropdownModule` to our new `shared.module.ts`.

## Part 3 - Adding a form
It's time to add our form, for this tutorial we'll be using [reactive forms](https://angular.io/guide/reactive-forms) as it's the most versatile option and great when working with dynamic forms.
We've already imported the module to our shared module so the next step will be adding a form.

### Step 6 - Add reactive form
Well begin by declaring our form in `kyc.component.ts`:

```ts
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
```

The most important part here is the [form builder](https://angular.io/api/forms/FormBuilder) that we'll use to create our form. We'll begin with a single form control for first name that we declare using the form builder service using `.group` to get a new form group. We'll also add some validators (required and min length). Angular has a lot of built in validators for the most common things but it's also possible to create own validators [here's a good article](https://blog.angular-university.io/angular-custom-validators/) on the topic.

We'll also create a function for setting up the form that could be used to re-initiate the form or pass options to it when setting it up.

We'll also add a ViewChild for our form to be able to access the form group. Last thing to note is `changeDetection: ChangeDetectionStrategy.OnPush` which means change detection will only run when inputs are updated or when explicitly run or marked for check, we do this to improve performance.


Next up is the markup for our form, open `kyc.component.html` and add this:

```html
<div class="card">
  <header>
    <h2>KYC Form</h2>
  </header>
  <main>
    <form *ngIf="kycFormGroup" 
          #kycForm="ngForm"
          [formGroup]="kycFormGroup"
          id="kycForm"
    >
      <!-- Form group for first name-->
      <div *ngIf="kycFormGroup.get('firstName') as firstName" class="form-group">
        <label for="firstName_input">First name</label>
        <input id="firstName_input"
               formControlName="firstName"
               type="text"
               aria-describedby="firstName_info"
               [class.is-valid]="kycForm['submitted'] && firstName.valid"
               [class.is-invalid]="kycForm['submitted'] && firstName.invalid"
        />
        <span class="form-info" id="firstName_info">
          <!-- Hint text when not submitted -->
          <ng-container *ngIf="!kycForm['submitted']">Enter first name</ng-container>
          <ng-container *ngIf="kycForm['submitted']">
            <!-- Text when submitted and valid -->
            <ng-container *ngIf="firstName.valid">First name looks correct</ng-container>
            <!-- Text when form control contains one or more errors -->
            <ng-container *ngIf="firstName.errors as errors">
              <!-- Text for each error (only one will be displayed at a time) -->
              <ng-container *ngIf="errors['required']">Enter your first name</ng-container>
              <ng-container *ngIf="errors['minlength'] as minLength">Enter at least {{minLength?.requiredLength}} characters</ng-container>
            </ng-container>
          </ng-container>
        </span>
      </div>
    </form>
  </main>
</div>
```

We'll being with one control and the most important bits here are `[formGroup]="kycFormGroup"` on `form` as well as `formControlName="firstName"` on our `input`. These are the only things required to bind our form with the view. We bind `ngForm` to `#kycForm` to be able to access the submitted state provided by the ngForm directive. By default, form groups `.form-group` blocks will stack on top of each other when using Green, it's possible to align them horizontally too but for custom layouts I'd recommend using the flexbox grid provided by Green (same as Bootstrap) or define a css-grid (more on that in another tutorial). 

### Step 7 - Add more controls

We'll continue and add some more form controls to `kyc.component.ts`.

```ts
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

}

```

We use rxjs and `of()` to mimic the behaviour of an observable i.e. the behaviour we'd get if the options were fetched from a backend.  

```html
      <!-- Form group for last name-->
      <div *ngIf="kycFormGroup.get('lastName') as lastName" class="form-group">
        <label for="lastName_input">Last name</label>
        <input id="lastName_input"
               formControlName="lastName"
               type="text"
               aria-describedby="lastName_info"
               [class.is-valid]="kycForm['submitted'] && lastName.valid"
               [class.is-invalid]="kycForm['submitted'] && lastName.invalid"
        />
        <span class="form-info" id="lastName_info">
          <!-- Hint text when not submitted -->
          <ng-container *ngIf="!kycForm['submitted']">Enter last name</ng-container>
          <ng-container *ngIf="kycForm['submitted']">
            <!-- Text when submitted and valid -->
            <ng-container *ngIf="lastName.valid">Last name looks correct</ng-container>
            <!-- Text when form control contains one or more errors -->
            <ng-container *ngIf="lastName.errors as errors">
              <!-- Text for each error (only one will be displayed at a time) -->
              <ng-container *ngIf="errors['required']">Enter your last name</ng-container>
            </ng-container>
          </ng-container>
        </span>
      </div>
      <!-- Form group for occupation -->
      <div *ngIf="kycFormGroup.get('occupation') as occupation" class="form-group">
        <ngg-dropdown formControlName="occupation"
                      text="Select occupation"
                      [options]="occupations$ | async"
                      label="Occupation"
                      [valid]="occupation.valid && kycForm.submitted"
                      [invalid]="occupation.invalid && kycForm.submitted"
        >
          <!-- Info text when not submitted -->
          <ng-container data-form-info *ngIf="!kycForm['submitted']">Select occupation</ng-container>
          <!-- Info text when submitted -->
          <ng-container data-form-info *ngIf="kycForm['submitted']">
            <!-- Text when form control contains one or more errors -->
            <ng-container *ngIf="occupation.errors as errors">
              <!-- Text for each error (only one will be displayed at a time) -->
              <ng-container *ngIf="errors['required']">Select your occupation</ng-container>
            </ng-container>
          </ng-container>
        </ngg-dropdown>
      </div>
```
We add the new controls after our first one (note that we could expand on this and use `ngFor` to loop through a list of controls.)

For debugging purposes we'll add this too:

```html
<!-- FOR DEMO & DEBUG PURPOSE ONLY -->
<code>
  <h5 class="mb-0">Form data</h5>
  <div>
    Submitted: {{kycForm?.submitted}}
    Invalid: {{kycFormGroup?.invalid}}
  </div>
  <h5 class="mb-0">Values</h5>
  <div>
    {{kycFormGroup?.value | json}}
  </div>
  <h5 class="mb-0">Errors</h5>
  <div *ngFor="let f of kycFormGroup?.controls | keyvalue">
    {{f.key}}:{{f.value.errors | json}}
  </div>
</code>
```
### Step 8 - Add submit action and global form error

**Add save action to** `kyc.component.ts`

```ts
  save() {
    console.log(this.kycFormGroup?.value)
  }
```

Handle form submit by binding submit action of form using `(submit)="save()"` (forms will by default be submitted with enter key when form has focus as well as when submit buttons are clicked).

**Add an alert to our main content in our card:**
```html
<div role="alert" class="danger" *ngIf="kycForm?.invalid && kycForm?.submitted">
      <main>
        <h3>Error!</h3>
        <p>
          The form contains one or more errors, please correct them before proceeding.
        </p>
      </main>
    </div>
```

**And a card footer:**
```html
<footer>
  <button type="reset" form="kycForm">Reset</button>
  <button type="submit" form="kycForm" [disabled]="kycForm?.submitted && kycFormGroup?.invalid">Save</button>
</footer>
```
## Part 4 - Connect form with backend

### Step 9 - Add form service

Add `HttpClientModule` to `shared.module.ts` (and export it).

Generate a shared module for our kyc form feature and import it to `kyc.module.ts`:
```
ng g module shared/features/kyc-form
```

**Generate an interface:**
```
ng g interface shared/features/kyc-form/interfaces/kyc
```

We'll start with something simple and basic to describe our form data:

```ts
export interface Kyc {
  firstName: string;
  lastName: string;
  occupation: string;
}
```

We also need a service which will take care of the communication with our backend.
```
ng g service shared/features/kyc-form/services/kyc-form
```

```ts
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

```

It's a pretty basic setup, the only thing to note here is that we'll provide this service through our `KycFormModule` that we just created. This allows webpack to tree shake our app and bundle our service together with the module that will use it (we'll still get a singleton, but it won't be part of `app.module.ts` or available to the whole app).

***Note:** Read more on [providers](https://angular.io/guide/providers) over att angular.io.*

Next up is our kyc component (`kyc.component.ts`).

**Add our new service to the constructor:**
```ts
constructor(private _fb: FormBuilder, private kycFormService: KycFormService)
```

**And update the save function to use our new service:**
 
```ts
save() {
    // only submit data if it's valid
    if(this.kycFormGroup?.valid) {
      this.kycFormService
        .save(this.kycFormGroup?.value)
        .subscribe(state => {
          console.log('Success! Form data has been saved!', state)
        }, error => {
          console.log('Error! Form data was not saved!', error)
        })
    }
  }
```

If we try submitting the form, we'll notice it won't work since we haven't connected it with a backend.

### Step 10 - Add proxy and mock backend

Since we don't have a real backend for this tutorial we're going to use a mock server (this is useful during development even with a real backend in place as it can be used for testing purposes too).
We're going to use [json server](https://github.com/typicode/json-server) for this.

**Install and add it as dev dependency:**
```
npm i json-server --save-dev
```
Create a file called `db.json` at the root with the following contents:

```json
{
  "kyc": {}
}
```

Add npm script to `package.json` for starting server (well use a delay of 2000ms by default):
```
"start-json-server": "json-server --watch db.json --delay 2000"
```

Create a file called `proxy.config.js` with the following contents:

```js
// For more proxy options and examples view => https://github.com/chimurai/http-proxy-middleware

// Our local instance of json-server
const LOCAL_BACKEND_HOST = 'http://localhost:3000';

/** Configuration
 * Please note that you need to re-run npm start inorder for changes to be applied
 */

// Default proxy config
let PROXY_CONFIG = [
    {
        context: ['/api'],
        target: LOCAL_BACKEND_HOST,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
            '^/api': '/' // rewrite path
        },
        // re-write request headers, useful for CORS
        // onProxyReq(proxyReq, req, res) {
        //   proxyReq.setHeader('origin', 'https://www.foo-bar.com');
        // }
    }
];

module.exports = PROXY_CONFIG;
```

With the above config we'll forward all requests to `/api` to our `LOCAL_BACKEND_HOST` which could be a real server but in our case we're targeting our mock server.

Last step is to let angular know that we want to use this configuration, open `angular.json` and modify the serve config, so it looks like this:
```json
"serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "browserTarget": "green-app:build:production",
              "proxyConfig": "proxy.config.js"
            },
            "development": {
              "browserTarget": "green-app:build:development",
              "proxyConfig": "proxy.config.js"
            }
          },
          "defaultConfiguration": "development"
        },
```

Restart our dev server (run `npm start` again) as well as `npm run start-json-server` to start our mock server, the submit/save should now reply correctly to our post. The state will be saved to `db.json` so if we want to clear the data we can just modify that file.

### Step 11 - Add state service
For this app we're not only interested in posting data to the backend, we're also interested in showing the users current progress. We'll do this by fetching a state persisted through our backend, and in the front we'll implement a simple state store to hold a single source of truth (SSOT) about the state. As the app grows it might be worth looking into state management frameworks like [NgRx](https://ngrx.io/), [Akita](https://datorama.github.io/akita/) etc. (there are a lot of them). Most of them build on redux of flux patterns, NgRx is the most popular one, I prefer Akita but in the end it's just a matter of taste and they pretty much do the same thing.

However, in most cases you'll do just fine with RxJs (which you already have a dependency to with Angular).

**Generate a new service to handle state:**
```
ng g service shared/features/kyc-form/state/kyc
```

We'll start with something simple:

```ts
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
```

Next step is to update our `KycFormService` to use our new state service:

```ts
import { Injectable } from '@angular/core';
import { KycFormModule } from "../kyc-form.module";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";
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
    return this.http.post<Kyc>('/api/kyc', state).pipe(
      tap(res => {
        // update state
        this.state.set(res);
      })
    )
  }

  /** Get - KYC form state
   * @returns state as observable
   */
  get() {
    return this.http.get<Kyc>('/api/kyc').pipe(
      tap(res => {
        // update state
        this.state.set(res)
      })
    )
  }
}
```

We update the state when we get the response from our backend.

### Step 12 - Load state

We'll update `kyc.component.ts` and tell it to get last state from our state service.

**Update the constructor:**

```ts
constructor(private _fb: FormBuilder,
              private kycFormService: KycFormService,
              private kycState: KycState,
              private _cdr: ChangeDetectorRef) {
    this.kycState.get()
      .pipe(
        take(1)
      ).subscribe(state => this.setupForm(state))
  }
```

We inject `ChangeDetectorRef` to be able to run change detection manually. We'll also subscribe to the kyc state and set up the form once we get the initial state (note that we use `take(1)` to stop subscribing once we get the initial value). 

**Update setup form:**

```ts
setupForm(state: Kyc) {
    this.kycFormGroup = this._fb.group({
      firstName: [state.firstName || '', [ Validators.required, Validators.minLength(2) ]],
      lastName: [state.lastName || '', [ Validators.required ]],
      occupation: [state.occupation || '', [ Validators.required ]],
    });
    // since we use OnPush - mark the view as changed so that it can be checked again
    this._cdr.markForCheck();
  }
```

We pass an initial state and use it when declaring our form controls.

The form will now fetch and display the last state that we saved. The state service could quite easily be extended to support multiple pages too. We have some minor issues left to deal with before wrapping up. One thing you might notice is that it's possible to submit the form multiple times, and we're currently not handling loading state.

### Step 13 - Add loading state and prevent multiple requests

We'll begin with `KycState` and a new variable as well as two more functions:

**New variable:**
```ts
  private _isLoading = new BehaviorSubject(false);
```

**New functions:**
```ts
/** Set loading - set loading to indicate that state is being updated
   * @param loading - boolean for if state is loading or not
   */
  setLoading(loading: boolean = true) {
    this._isLoading.next(loading);
  }

  /** Is loading - is state being updated
   * @returns loading state as observable
   */
  isLoading() {
    return this._isLoading.asObservable();
  }
```

Next up is or `KycFormService` which we need to modify, so it looks like this:

```ts
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
```

Last but not least, we'll need to update our form component.

In `kyc.component.ts` add:

**New variables:**

```ts
  unsubscribe$ = new Subject();
  isLoading$ = this.kycState.isLoading();
```

**Modify save method:**

```ts
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
```

Add takeUntil to unsubscribe when component is destroyed (if we navigate away form the route, pending http requests will be cancelled).


**Implement OnDestroy:**

```ts
ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
```

To be continued...
