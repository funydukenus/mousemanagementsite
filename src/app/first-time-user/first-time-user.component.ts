import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountInfoProviderService, ResponseFrame } from '../service/dataprovider.service';
import { EventEmiterService } from '../service/event.emmiter.service';
import { ErrorColor, SuccessColor, ToastmessageService } from '../service/toastmessage.service';
import { UserInfoProviderService } from '../service/user-info-provider.service';

@Component({
  selector: 'app-first-time-user',
  templateUrl: './first-time-user.component.html',
  styleUrls: ['./first-time-user.component.scss']
})
export class FirstTimeUserComponent implements OnInit {

  // Reference to the form object
  form: FormGroup;
  hasUserClickedSubmit: Boolean = false;

  // Reference submit button
  submitButtonTxt: string = "Update";

  // username and password field attribute
  warningTxt: string = 'Username cannot be empty';
  abnormalDetected: Boolean = false;
  passwordValue: string = '';

  // Loading trigger indication
  isLoading: Boolean = false;

  triggered: Boolean = true;

  isValid: Boolean = true;

  // Save current new user info
  secretKey: string;
  username: string;

  redirecedTimer;
  
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private accountInfoProvider: AccountInfoProviderService,
    private userInfoProviderService: UserInfoProviderService,
    private snackBar: MatSnackBar,
    private toastService: ToastmessageService) {

  }

  ngOnInit(): void {
    // Setup FormControl for input validation
    // Setup FormControl for input validation
    this.form = this.formBuilder.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern(this.emailPattern)]],
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]]
    });


    // Setup observer for value change event
    this.form.valueChanges.subscribe(
      () => {
        this.resetAllValidation();
      }
    )
  }

  /*
  Function name: OnClickSubmit
  Description: This function trigger when the sumbit button is clicked
   */
  OnClickSubmit(data) {
    this.hasUserClickedSubmit = true;
    if (this.form.valid) {
      this.submitButtonTxt = "Creating and sending...";
      this.accountInfoProvider.createNewUser(
        this.form.get("username").value,
        this.form.get("email").value,
        this.form.get("firstname").value,
        this.form.get("lastname").value,
        true
      ).subscribe(
        (result) => {
          let responseFrame: ResponseFrame = <ResponseFrame>result;

          if (responseFrame.result != 0) {
            this.submitButtonTxt = "Creating";
            this.displayToastMsg(
              "User created success, an confirmation email to create password will be send to your email",
              SuccessColor
            );
            this.userInfoProviderService.markListNotEmpty();
            this.router.navigate(['login']);
          } else {
            this.submitButtonTxt = "Creating";
            this.displayToastMsg(
              responseFrame.payload,
              ErrorColor
            );
          }
        },
        (error) => {
          this.submitButtonTxt = "Creating";
          this.displayToastMsg(
            "Network Error",
            ErrorColor
          );
        }
      );
    }
    else {
      if (this.form.get("username").errors) {
        if (this.form.get("username").errors.required) {
          this.warningTxt = "Username cannot be empty";
          this.abnormalDetected = true;
        }
      }
      else if (this.form.get("email").errors) {
        if (this.form.get("email").errors.required) {
          this.warningTxt = "Email cannot be empty";
          this.abnormalDetected = true;
        }
        else if (this.form.get("email").errors.pattern) {
          this.warningTxt = "Must comply with email format";
          this.abnormalDetected = true;
        }
      }
      else if (this.form.get("firstname").errors) {
        if (this.form.get("firstname").errors.required) {
          this.warningTxt = "First Name cannot be empty";
          this.abnormalDetected = true;
        }
      }
      else if (this.form.get("lastname").errors) {
        if (this.form.get("lastname").errors.required) {
          this.warningTxt = "Last Name cannot be empty";
          this.abnormalDetected = true;
        }
      }
    }
  }

  /*
  Function name: resetAllValidation
  Description: Reset all the attributes for input abnormal detection
   */
  resetAllValidation() {
    this.abnormalDetected = false;
    this.hasUserClickedSubmit = false;
  }

  /*
  Function name: updateUiBeforeChangePwd
  Description: Reset all the attributes for input abnormal detection
   */
  updateUiBeforeChangePwd(buttonString: string): void{
    this.isLoading = true;
    this.submitButtonTxt = buttonString;
  }

  /*
  Function name: resetAllValidation
  Description: Reset all the attributes for input abnormal detection
   */
  updateUiAfterChangePwd(buttonString: string): void{
    this.isLoading = false;
    this.submitButtonTxt = buttonString;
  }

  /*
  Function name: displayToastMsg
  Description: Display the toast msg in this components
   */
  displayToastMsg(msg: string, color: string): void {
    this.toastService.openSnackBar(
      this.snackBar, msg, 'Dismiss', color
    );
  }
}
