import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HarvestedMouseDataproviderService, harvestMouseFileUploadUrl, ResponseFrame } from '../service/dataprovider.service';
import { EventEmiterService } from '../service/event.emmiter.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastmessageService, SuccessColor, ErrorColor, WarningColor } from '../service/toastmessage.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatProgressBar } from '@angular/material/progress-bar';


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
          this.FileUploadIndicator = percentDone + " % Done";
        }
        if (result.type === HttpEventType.Sent) {
          this.FileUploadIndicator = "Start sending";
          this.uploadingInProgress = true;
          this.progressBarValue = 0;
        }

        if (result instanceof HttpResponse) {
          let responseFrame: ResponseFrame = <ResponseFrame>result.body;
          if (responseFrame.result != 0) {
            this.FileUploadIndicator = "Upload complete";
            this.showStartParsingButton = true;
          }
          else {
            this.FileUploadIndicator = "Error occur, Please upload again";
            this.showStartParsingButton = false;
            this.displayToastMsg(
              responseFrame.payload,
              ErrorColor
            )
          }
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
    this.showInProgress();
    this.harvestedMouseDataproviderService.startParsingRequest().subscribe(
      (result) => {
        let responseFrame: ResponseFrame = <ResponseFrame>result;
        this.inProgressDone();

        if (responseFrame.result != 0) {
          this.mouseDebugMsg = responseFrame.payload;
          this.parsingIndicator = "Parsing done";

          if (this.mouseDebugMsg === "") {
            this.displayToastMsg(
              "Parse successful!",
              SuccessColor
            );
          } else {
            this.displayToastMsg(
              "Partial Parse. Please refer to the debug window for more details",
              WarningColor
            );
          }
        } else {
          this.displayToastMsg(
            responseFrame.payload,
            ErrorColor
          );
        }

      },
      (error) => {
        this.inProgressDone();
        this.displayToastMsg(
          "Network Error",
          ErrorColor
        );
      }
    )
  }

  showInProgress() {
    this.loaded = true;
  }

  inProgressDone() {
    this.loaded = false;
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
