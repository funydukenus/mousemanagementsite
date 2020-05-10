import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
   providedIn: 'root'
})
export class ToastmessageService {

   constructor() { }

   /*
   Funtion name: openSnackBar
   Description: This function opens up the snack bar and disapear after 2s
   */
   openSnackBar(snackerBar: MatSnackBar, message: string, action: string, ) {
      snackerBar.open(message, action, {
         duration: 2000,
         panelClass: ['blue-snackbar']
      });
   }
}