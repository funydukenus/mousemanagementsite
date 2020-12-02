import { Component, OnInit, OnChanges, ViewEncapsulation } from '@angular/core';
import { EventEmiterService } from '../service/event.emmiter.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountInfoProviderService } from '../service/dataprovider.service';
import { ToastmessageService, ErrorColor } from '../service/toastmessage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private accountInfoProvider: AccountInfoProviderService,
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
  Function name: OnClickSubmit
  Description: This function trigger when the sumbit button is clicked
   */
  OnClickSubmit(data) {
    this.hasUserClickedSubmit = true;
    if (this.form.valid) {
      this.submitButtonTxt = "Validating...";
      this.isLoading = true;
      this.accountInfoProvider.validateUserInfo(
        this.usernameValue,
        this.passwordValue
      ).subscribe(
        (result) => {
          this.isLoading = false;
          this.submitButtonTxt = "Done";
          localStorage.setItem('username', this.usernameValue);
          this.router.navigate(['']);
        },
        (error) => {
          this.isLoading = false;
          this.submitButtonTxt = "Get Me In";
          if (error.status == 401) {
            this.toastService.openSnackBar(
              this.snackBar, 'Username or Password is incorrect', 'Dismiss', ErrorColor
            )
          }
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
  resetAllValidation() {
    this.abnormalDetected = false;
    this.hasUserClickedSubmit = false;
  }

}
