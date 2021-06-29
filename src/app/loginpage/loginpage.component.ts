import { Component, OnInit, OnChanges, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { EventEmiterService } from '../service/event.emmiter.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountInfoProviderService, ResponseFrame } from '../service/dataprovider.service';
import { ToastmessageService, ErrorColor } from '../service/toastmessage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserInfoProviderService } from '../service/user-info-provider.service';
import { User } from '../interface/user';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginpageComponent implements OnInit {

  // Reference to the form object
  form: FormGroup;
  hasUserClickedSubmit: Boolean = false;

  // Reference submit button
  submitButtonTxt: string = "Get Me In";

  // username and password field attribute
  warningTxt: string = 'Username cannot be empty';
  abnormalDetected: Boolean = false;
  usernameValue: string = '';
  passwordValue: string = '';

  // Loading trigger indication
  isLoading: Boolean = false;
  triggered: Boolean = true;

  // submit button
  @ViewChild('submitButton') submitButton: ElementRef;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private accountInfoProvider: AccountInfoProviderService,
    private userInfoProviderService: UserInfoProviderService,
    private snackBar: MatSnackBar,
    private toastService: ToastmessageService) {
  }

  ngOnInit(): void {

    // Setup FormControl for input validation
    this.form = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, Validators.required],
    });

    // Setup observer for value change event
    this.form.valueChanges.subscribe(
      userForm => {
        this.resetAllValidation();
        this.usernameValue = userForm.username;
        this.passwordValue = userForm.password;
      }
    )
  }

  /*
  Function name: loginButtonClick
  Description: This function trigger when the sumbit button is clicked
   */
  loginButtonClick(data) {
    this.hasUserClickedSubmit = true;
    if (this.form.valid) {
      this.submitButtonTxt = "Validating...";
      this.isLoading = true;
      this.accountInfoProvider.validateUserInfo(
        this.usernameValue,
        this.passwordValue
      ).subscribe(
        (result) => {
          let responseFrame: ResponseFrame = <ResponseFrame>result;
          this.resetUiAfterValidation();

          if(responseFrame.result !== 0){
            let user: User;
            user = <User>JSON.parse(<string>responseFrame.payload);

            this.userInfoProviderService.setCurrentUser(user);
            this.router.navigate(['']);
          } else {
            this.resetAllValidation();
            this.displayToastMsg(
              responseFrame.payload,
              ErrorColor
            )
          }
        },
        (error) => {
          this.resetUiAfterValidation();
          this.displayToastMsg(
            'Network Error: ' + error,
            ErrorColor
          )
        }
      )
    }
    else {
      if (!this.usernameValue || !this.passwordValue) {
        this.warningTxt = "Username or Password cannot be empty";
        this.abnormalDetected = true;
      }
    }
  }

  /*
  Function name: resetAllValidation
  Description: Reset all the attributes for input abnormal detection
   */
  resetAllValidation(): void{
    this.abnormalDetected = false;
    this.hasUserClickedSubmit = false;
  }

  /*
  Function name: resetUiAfterValidation
  Description: Reset all UI changes after account validation
   */
  resetUiAfterValidation(): void{
    this.isLoading = false;
    this.submitButtonTxt = "Get Me In";
  }

  /*
  Function name: displayToastMsg
  Description: Display the toast msg in this components
   */
  displayToastMsg(msg: string, color: string): void{
    this.toastService.openSnackBar(
      this.snackBar, msg, 'Dismiss', color
    );
  }

  mimicSubmitButtonEvent():void{
    this.submitButton.nativeElement.click();
  }

}
