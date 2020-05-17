import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Input } from '@angular/core';
import { DataproviderService } from '../service/dataprovider.service';
import { ToastmessageService } from '../service/toastmessage.service';
import { HarvestMouse } from '../interface/harvestmouse';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { ColumnInfo } from '../interface/columninfo';
import { TableHeaderConverter } from '../pipe/tableheader.pipe';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
   selector: 'app-harvestmousepage',
   templateUrl: './harvestmousepage.component.html',
   styleUrls: ['./harvestmousepage.component.scss'],
   animations: [
      trigger('detailExpand', [
        state('collapsed, void', style({height: '0px', minHeight: '0'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ],
})
export class HarvestmousepageComponent implements OnInit {

   // Reference the sort html element in the template
   @ViewChild(MatSort, { static: true }) sort: MatSort;

   // Reference the paginator html element in the template
   @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

   // Reference to the table
   @ViewChild('table') table: MatTable<HarvestMouse>;

   dataSource: MatTableDataSource<HarvestMouse>;

   harvestMouseList: HarvestMouse[];

   // Identification of current rab
   @Input() tabName: string;

   // Used to track which row has been expaneded
   // Used the element to keep track of the row
   expandedElement: HarvestMouse | null;

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
      // 'comment'
   ]

   // This will store each of the column info
   displayedColumnInfo: ColumnInfo[] = [

   ]

   constructor(
      private dataprovider: DataproviderService,
      private toastservice: ToastmessageService,
      private cdr: ChangeDetectorRef,
      private _snackBar: MatSnackBar
   ) { }

   ngOnInit(): void {
      this.displayedColumns.forEach(
         name => {
            this.displayedColumnInfo.push(
               {
                  columnaName: name,
                  display: true
               }
            )
         }
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

   /*
   Function name: drop
   Description: This function will be called when the column header drop
                event trigger
   */
   drop(event: CdkDragDrop<string[]>) {
      moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
      this.table.renderRows();
    }
}
