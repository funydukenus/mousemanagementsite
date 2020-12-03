import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HarvestedMouseDataproviderService, harvestMouseFileUploadUrl } from '../service/dataprovider.service';
import { EventEmiterService } from '../service/event.emmiter.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastmessageService, SuccessColor, ErrorColor, WarningColor } from '../service/toastmessage.service';
import { HttpEventType } from '@angular/common/http';
import { MatProgressBar } from '@angular/material/progress-bar';

interface ErrorMsg {
  error_msg: string
}

@Component({
  selector: 'app-uploadcsvpage',
  templateUrl: './uploadcsvpage.component.html',
  styleUrls: ['./uploadcsvpage.component.scss']
})
export class UploadcsvpageComponent implements OnInit {
  // Reference the fileInput html element in the template
  @ViewChild('fileInput') fileInputButton: ElementRef;
  @ViewChild('fileuploadprogress') fileUploadProgress: MatProgressBar;
  loaded: boolean;
  FileUploadIndicator: string = "";
  uploadingInProgress: Boolean = false;
  progressBarValue: number = 0;

  showStartParsingButton: Boolean = false;
  parsingIndicator: string = "Press to Start";
  mouseDebugMsg: string = "";

  constructor(
    private harvestedMouseDataproviderService: HarvestedMouseDataproviderService,
    private toastService: ToastmessageService,
    private snackBar: MatSnackBar,
  ) {

  }

  ngOnInit(): void {
  }

  /*
  Function name: fileInputChange
  Description: This is the callback function when the input file event
  changed is triggered
  */
  fileInputChange(event: any) {
    let file: File = event.target.files[0];
    // this.showInProgress();
    this.harvestedMouseDataproviderService.fileUploadRequest(file, harvestMouseFileUploadUrl).subscribe(
      (result) => {
        if (result.type === HttpEventType.Response) {
          this.FileUploadIndicator = "Upload complete";
          this.showStartParsingButton = true;
          this.progressBarValue = 100;
        }
        if (result.type === HttpEventType.UploadProgress) {
          let percentDone: number = Math.round(100 * result.loaded / result.total);
          this.progressBarValue = percentDone;
          console.log(this.progressBarValue);
          this.FileUploadIndicator = percentDone + " % Done";
        }
        if (result.type === HttpEventType.Sent) {
          this.FileUploadIndicator = "Start sending";
          this.uploadingInProgress = true;
          this.progressBarValue = 0;
        }
      }
    )
  }

  /*
  Function name: uploadButtonClick
  Description: This is the callback function when the button is clicked
  to mimic the file upload input event
  */
  uploadButtonClick() {
    if (this.fileInputButton) {
      this.fileInputButton.nativeElement.click();
    }
  }

  startParsing() {
    this.parsingIndicator = "Parsing...";
    this.harvestedMouseDataproviderService.startParsingRequest().subscribe(
      (data) => {
        let msg = <ErrorMsg>data;
        this.mouseDebugMsg = msg.error_msg;
        this.parsingIndicator = "Parsing done";
        if (this.mouseDebugMsg === "") {
          this.toastService.openSnackBar(
            this.snackBar,
            "Parse successful!",
            "Dismiss",
            SuccessColor
          )
        } else {
          this.toastService.openSnackBar(
            this.snackBar,
            "Partial Parse. Please refer to the debug window for more details",
            "Dismiss",
            WarningColor
          )
        }
      },
      (error) => {
        this.toastService.openSnackBar(
          this.snackBar,
          "Something wrong! Please contact adminstrator",
          "Dismiss",
          SuccessColor
        )
      }
    )
  }

  showInProgress() {
    this.loaded = true;
  }

  inProgressDone() {
    this.loaded = false;
  }
}
