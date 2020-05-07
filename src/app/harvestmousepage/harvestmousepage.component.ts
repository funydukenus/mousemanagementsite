import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { DataproviderService } from '../service/dataprovider.service';
import { ToastmessageService } from '../service/toastmessage.service';
import { HarvestMouse } from '../interface/harvestmouse';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

import { harvestMouseFileUploadUrl } from '../service/dataprovider.service';

@Component({
   selector: 'app-harvestmousepage',
   templateUrl: './harvestmousepage.component.html',
   styleUrls: ['./harvestmousepage.component.scss']
})
export class HarvestmousepageComponent implements OnInit {

   // Reference the sort html element in the template
   @ViewChild(MatSort, { static: true }) sort: MatSort;

   // Reference the paginator html element in the template
   @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
   
   // Reference the fileInput html element in the template
   @ViewChild('fileInput') fileInputButton: ElementRef;

   harvestMouseList: HarvestMouse[];
   dataSource: MatTableDataSource<HarvestMouse>;

   // columns of the table
   displayedColumns: string[] = [
      //'id',
      'handler',
      'gender',
      'mouseLine',
      'genoType',
      'birthDate',
      'endDate',
      'confirmationOfGenoType',
      'phenoType',
      'projectTitle',
      'experiment',
      'comment'
   ]

   constructor(
      private dataprovider: DataproviderService,
      private toastservice: ToastmessageService,
      private cdr: ChangeDetectorRef,
      private _snackBar: MatSnackBar
   ) { }

   ngOnInit(): void {

      // Load the harvested mouse list when the page is loaded
      this.dataprovider.getHarvestMouseList().subscribe(
         data => {
            let the_data = <HarvestMouse[]>data;
            this.harvestMouseList = the_data;
            this.dataSource = new MatTableDataSource(this.harvestMouseList);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.cdr.detectChanges();
         }
      );
      this.toastservice.openSnackBar(
         this._snackBar, 'You are in HarvestMouseTable section', 'Dismiss'
      )
   }

   /*
   Function name: applyFilter
   Description: This is the callback function when the filter text input
                event changed trigger
   */
   applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue;

      if (this.dataSource.paginator) {
         this.dataSource.paginator.firstPage();
      }
   }

   /*
   Function name: fileInputChange
   Description: This is the callback function when the input file event
                changed is triggered
   */
   fileInputChange(event: any) {
      let file: File = event.target.files[0];

      this.dataprovider.fileUploadRequest(file, harvestMouseFileUploadUrl).subscribe(
         data => {
            this.toastservice.openSnackBar(
               this._snackBar, 'Imported Success', 'Dismiss'
            )
            // Load the harvested mouse list when the page is loaded
            this.dataprovider.getHarvestMouseList().subscribe(
               data => {
                  let the_data = <HarvestMouse[]>data;
                  this.harvestMouseList = the_data;
                  this.dataSource = new MatTableDataSource(this.harvestMouseList);
                  this.dataSource.sort = this.sort;
                  this.dataSource.paginator = this.paginator;
                  this.cdr.detectChanges();
               }
            );
         },
         error => {
            this.toastservice.openSnackBar(
               this._snackBar, 'Something wrong', 'Dismiss'
            )
         }
      );
   }
   /*
   Function name: uploadButtonClick
   Description: This is the callback function when the button is clicked
                to mimic the file upload input event
   */
   uploadButtonClick() {
      this.fileInputButton.nativeElement.click();
   }
}
