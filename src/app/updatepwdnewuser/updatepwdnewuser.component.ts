import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountInfoProviderService } from '../service/dataprovider.service';
import { EventEmiterService } from '../service/event.emmiter.service';
import { ErrorColor, SuccessColor, ToastmessageService } from '../service/toastmessage.service';

@Component({
  selector: 'app-updatepwdnewuser',
  templateUrl: './updatepwdnewuser.component.html',
  styleUrls: ['./updatepwdnewuser.component.scss']
})
export class UpdatepwdnewuserComponent implements OnInit {

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

  isValid: Boolean = false;

  // Save current new user info
  secretKey: string;
  username: string;

  redirecedTimer;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private accountInfoProvider: AccountInfoProviderService,
    private snackBar: MatSnackBar,
    private toastService: ToastmessageService) {

    this.activatedRoute.queryParams.subscribe(params => {
      let secret_key = params['secret_key'];
      let username = params['username'];
      this.secretKey = secret_key;
      this.username = username;
      this.accountInfoProvider.checkSecretKey(secret_key, username).subscribe(
        result => {
          this.isValid = true;
        },

        error => {
          this.router.navigate(['**']);
        }
      );
    });
  }

  ngOnInit(): void {
    // Setup FormControl for input validation
    this.form = this.formBuilder.group({
      password: [null, Validators.required]
    });

    // Setup observer for value change event
    this.form.valueChanges.subscribe(
      userForm => {
        this.resetAllValidation();
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
      this.submitButtonTxt = "Updating...";
      this.isLoading = true;
      this.accountInfoProvider.newUserChangePassword(
        this.secretKey,
        this.username,
        this.passwordValue,
      ).subscribe(
        result => {
          this.isLoading = false;
          this.submitButtonTxt = "Done";
          this.toastService.openSnackBar(
            this.snackBar, 'Success! Redirected to login page in 3s', 'Dismiss', SuccessColor
          )
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000)
        },
        error => {
          this.isLoading = false;
          this.submitButtonTxt = "Update";
          if (error.status == 401) {
            this.toastService.openSnackBar(
              this.snackBar, 'Username or Secrete is incorrect', 'Dismiss', ErrorColor
            )
          }
        }
      )
    }
    else {
      if (!this.passwordValue) {
        this.warningTxt = "Password cannot be empty";
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
