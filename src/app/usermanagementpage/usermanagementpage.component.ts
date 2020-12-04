import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { User } from '../interface/user';
import { AccountInfoProviderService, ResponseFrame } from '../service/dataprovider.service';
import { EventEmiterService } from '../service/event.emmiter.service';
import { ToastmessageService, SuccessColor, ErrorColor } from '../service/toastmessage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-usermanagementpage',
  templateUrl: './usermanagementpage.component.html',
  styleUrls: ['./usermanagementpage.component.scss']
})
export class UsermanagementpageComponent implements OnInit {

  // Contains the user info retrieved from the server
  userInfoContent: User[] = [];

  // Disable input
  preventInputChanged: Boolean = false;

  // Reference to the form object
  form: FormGroup;
  hasUserClickedSubmit: Boolean = false;

  // Reference submit button
  submitButtonTxt: string = "Create";

  // username and password field attribute
  WarningTxt: string = 'Username cannot be empty';
  AbnormalDetected: Boolean = false;

  triggered: Boolean = true;

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  constructor(
    private accountInfoProvider: AccountInfoProviderService,
    private toastService: ToastmessageService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
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

  ngOnInit(): void {
    // Retrieving the user content by calling
    // the server interface in the dataprovider class
    this.retrieveAllUserInfo();
  }

  retrieveAllUserInfo(): void {
    this.accountInfoProvider.getAllUserInfo().subscribe(
      (result) => {
        let responseFrame: ResponseFrame = <ResponseFrame>result;
        if (responseFrame.result != 0) {
          this.userInfoContent = <User[]>JSON.parse(<string>responseFrame.payload)['user_list'];
        } else {
          this.displayToastMsg(
            responseFrame.payload,
            ErrorColor
          )
        }
      },
      (error) => {
        this.userInfoContent = [];
        this.displayToastMsg(
          "Network Error:" + error,
          ErrorColor
        )
      }
    )
  }

  isUserActive(user: User): Boolean {
    return user.is_active;
  }

  deleteUser(user: User) {
    this.preventInputChanged = true;
    this.accountInfoProvider.deleteUser(user.username).subscribe(
      (result) => {
        let responseFrame: ResponseFrame = <ResponseFrame>result;
        if (responseFrame.result != 0) {
          this.displayToastMsg(
            "Delete user successful",
            SuccessColor
          );
        } else {
          this.displayToastMsg(
            responseFrame.payload,
            ErrorColor
          );
        }
        this.preventInputChanged = false;
        this.retrieveAllUserInfo();
      },
      (error) => {
        this.userInfoContent = [];
        this.displayToastMsg(
          "Network Error:" + error,
          ErrorColor
        );
        this.preventInputChanged = false;
      }
    );
  }

  toggleChangeEvent(event: MatSlideToggleChange, user: User): void {
    let oldValue: Boolean = user.is_active;
    user.is_active = event.checked;
    this.preventInputChanged = true;
    this.accountInfoProvider.toggleActivityUser(user).subscribe(
      (result) => {
        let responseFrame: ResponseFrame = <ResponseFrame>result;

        this.preventInputChanged = false;
        // If the response has no issue
        if (responseFrame.result != 0) {
          this.displayToastMsg(
            "Toggled Success",
            SuccessColor
          );

        } else {
          this.displayToastMsg(
            responseFrame.payload,
            ErrorColor
          );
        }
        this.retrieveAllUserInfo();
      },
      (error) => {
        this.preventInputChanged = false;
        this.displayToastMsg(
          "Network Error:" + error,
          ErrorColor
        );
      }
    )

  }

  convertLoginDisplay(loginTime: string): string {
    if (loginTime === "None") {
      return "Not yet Login before";
    }

    return loginTime;
  }

  getFullName(user: User): string {
    let fullname: string = user.lastname + " " + user.firstname;
    fullname = fullname.length > 20 ? fullname.slice(0, 20) + '..' : fullname;
    return fullname;
  }

  /*
  Function name: resetAllValidation
  Description: Reset all the attributes for input abnormal detection
   */
  resetAllValidation() {
    this.AbnormalDetected = false;
    this.hasUserClickedSubmit = false;
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
        this.form.get("lastname").value
      ).subscribe(
        (result) => {
          let responseFrame: ResponseFrame = <ResponseFrame>result;

          if (responseFrame.result != 0) {
            this.submitButtonTxt = "Creating";
            this.displayToastMsg(
              "User created success",
              SuccessColor
            );
            this.retrieveAllUserInfo();
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
          this.WarningTxt = "Username cannot be empty";
          this.AbnormalDetected = true;
        }
      }
      else if (this.form.get("email").errors) {
        if (this.form.get("email").errors.required) {
          this.WarningTxt = "Email cannot be empty";
          this.AbnormalDetected = true;
        }
        else if (this.form.get("email").errors.pattern) {
          this.WarningTxt = "Must comply with email format";
          this.AbnormalDetected = true;
        }
      }
      else if (this.form.get("firstname").errors) {
        if (this.form.get("firstname").errors.required) {
          this.WarningTxt = "First Name cannot be empty";
          this.AbnormalDetected = true;
        }
      }
      else if (this.form.get("lastname").errors) {
        if (this.form.get("lastname").errors.required) {
          this.WarningTxt = "Last Name cannot be empty";
          this.AbnormalDetected = true;
        }
      }
    }
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
