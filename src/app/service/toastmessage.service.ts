import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
   providedIn: 'root'
})
export class ToastmessageService {

   constructor() { }

   openSnackBar(snackerBar: MatSnackBar, message: string, action: string, ) {
      snackerBar.open(message, action, {
         duration: 2000,
         panelClass: ['blue-snackbar']
      });
   }
}