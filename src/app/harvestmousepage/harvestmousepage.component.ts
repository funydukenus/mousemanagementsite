import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Input } from '@angular/core';
import { DataproviderService } from '../service/dataprovider.service';
import { ToastmessageService } from '../service/toastmessage.service';
import { HarvestMouse } from '../interface/harvestmouse';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

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

   dataSource: MatTableDataSource<HarvestMouse>;

   harvestMouseList: HarvestMouse[];

   // Identification of current rab
   @Input() tabName: string;

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
   Function name: InsertDataSource
   Description: This function allows the external data source insert into
                table in this component
   */
   InsertDataSource( dataSource )
   {
      this.dataSource = dataSource;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
   }
}
