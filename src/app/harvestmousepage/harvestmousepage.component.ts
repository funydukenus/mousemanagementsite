import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { HarvestedMouseDataproviderService, ResponseFrame } from '../service/dataprovider.service';
import { ToastmessageService, SuccessColor, ErrorColor } from '../service/toastmessage.service';
import { HarvestMouse } from '../interface/harvestmouse';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { ColumnInfo } from '../interface/columninfo';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { DiagService } from '../service/diag.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-harvestmousepage',
  templateUrl: './harvestmousepage.component.html',
  styleUrls: ['./harvestmousepage.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
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

  // Identification of current rab
  @Input() tabName: string;

  // Length of the list
  @Input() listNum: number;

  // Used to disable paginator when requesting server data
  @Input() pageDisabled: Boolean;

  @Output() dataFreshEventRequired = new EventEmitter<any>();

  @Output() selectionEvent = new EventEmitter<SelectionModel<HarvestMouse>>();

  @Output() pageChangedEvent = new EventEmitter<PageEvent>();

  dataSource: MatTableDataSource<HarvestMouse>;

  harvestMouseList: HarvestMouse[];
  // flag indicated the textarea has been modified
  IsTextAreaModifed: boolean;

  // original textarea text
  originalText: string;

  // Used to track which row has been expaneded
  // Used the element to keep track of the row
  expandedElement: HarvestMouse | null;

  // Keep track of the selected models
  selection = new SelectionModel<HarvestMouse>(true, []);

  // columns of the table
  displayedColumns: string[] = [
    //'id',
    'position',
    'physical_id',
    'handler',
    'gender',
    'mouseline',
    'genotype',
    'birth_date',
    'end_date',
    'cog',
    'phenotype',
    // 'project_title',
    'experiment',
    // 'comment'
  ]

  // This will store each of the column info
  displayedColumnInfo: ColumnInfo[] = [

  ]

  // Used to control accessbility of the button
  submitDisabled: boolean = false;

  constructor(
    private harvestedMouseDataproviderService: HarvestedMouseDataproviderService,
    private toastService: ToastmessageService,
    private diagService: DiagService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.IsTextAreaModifed = false;
  }

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
  Function name: insertDataSource
  Description: This function allows the external data source insert into
               table in this component
  */
  insertDataSource(dataSource, totalLength) {
    this.dataSource = dataSource;
    this.dataSource.sort = this.sort;
  }

  /*
  Function name: refreshSelected
  Description: This function removes all the selected row
  */
  refreshSelected() {
    this.selection.selected.forEach(item => {
      this.selection.deselect(item)
    });
  }

  /*
  Function name: getSelectedRows
  Description: This function gets the seleced row
  */
  getSelectedRows() {
    return this.selection;
  }

  /*
  Function name: drop
  Description: This function will be called when the column header drop
               event trigger
  */
  drop(event: CdkDragDrop<string[]>) {
    // remove the first selection column
    let positionColumnName = this.displayedColumns.shift();
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    // add back the first selection column
    this.displayedColumns.unshift(positionColumnName);
    // Render the rows based on the new column order
    this.table.renderRows();
  }

  /*
  Function name: onRowClicked
  Description: This function will be called when the row is clicked
  */
  onRowClicked(element: HarvestMouse) {
    this.submitDisabled = false;
    if (this.expandedElement === element) {
      if (this.originalText) {
        if (this.originalText != this.expandedElement.comment) {
          this.diagService.openSimpleConfirmationDialog(
            this.dialog
          ).subscribe(result => {
            if (result) {
              // mimic the close button clicked
              this.restoreAndClearCommment();
            }
          });
        }
        else {
          this.restoreAndClearCommment();
        }
      } else {
        this.restoreAndClearCommment();
      }
    }
    else {
      if (this.originalText) {
        if (this.originalText != this.expandedElement.comment) {
          this.diagService.openSimpleConfirmationDialog(
            this.dialog
          ).subscribe(result => {
            if (result) {
              this.restoreComment(element);
            }
          });
        } else {
          this.restoreComment(element);
        }
      } else {
        this.restoreComment(element);
      }
    }
  }
  /*
  Function name: CloseButtonClick
  Description: This function will be called when the close button
               in the expanded section is clicked
  */
  closeButtonClick() {
    if (this.originalText) {
      if (this.originalText != this.expandedElement.comment) {
        this.diagService.openSimpleConfirmationDialog(
          this.dialog
        ).subscribe(result => {
          if (result) {
            // mimic the close button clicked
            this.restoreAndClearCommment();
          }
        });
      }
      else {
        this.restoreAndClearCommment();
      }
    } else {
      this.restoreAndClearCommment();
    }
  }

  appendLeadingZeroes(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n
  }

  /*
  Function name: editOnClick
  Description: This function will be called when the edit button is clicked
  */
  editOnClick() {
    this.diagService.openSingleEditDialog(
      this.dialog,
      this.expandedElement).subscribe(
        result => {
          if (result) {
            var birth_date = new Date(result.harvestedMouse.birth_date);
            var end_date = new Date(result.harvestedMouse.end_date);
            console.log(birth_date);
            console.log(end_date);
            result.harvestedMouse.birth_date = birth_date.getFullYear() + "-" +
              this.appendLeadingZeroes((birth_date.getMonth() + 1)) + "-" +
              this.appendLeadingZeroes(birth_date.getDate());
            result.harvestedMouse.end_date = end_date.getFullYear() + "-" +
              this.appendLeadingZeroes((end_date.getMonth() + 1)) + "-" +
              this.appendLeadingZeroes(end_date.getDate());
            let harvestMouseList: HarvestMouse[] = [];
            harvestMouseList.push(result.harvestedMouse);
            this.submitDisabled = true;
            this.harvestedMouseDataproviderService.updateHarvestedMouseRequest(
              harvestMouseList
            ).subscribe(
              (result) => {
                let responseFrame: ResponseFrame = <ResponseFrame>result;

                this.submitDisabled = false;

                if (responseFrame.result != 0) {
                  this.displayToastMsg(
                    "Mouse updated successfully",
                    SuccessColor
                  );
                  this.dataFreshEventRequired.emit();
                } else {
                  this.displayToastMsg(
                    responseFrame.payload,
                    ErrorColor
                  );
                }

              },
              (error) => {
                this.submitDisabled = false;
                this.displayToastMsg(
                  "Network Error",
                  ErrorColor
                );
              }
            );
          }
        }
      )
  }

  /*
  Function name: restoreAndClearCommment
  Description: This function will reset all the values regarding the comment
  */
  restoreAndClearCommment() {
    if (this.originalText) {
      this.expandedElement.comment = this.originalText;
    }
    this.expandedElement = null;
    this.IsTextAreaModifed = false;
    this.originalText = null;
  }

  /*
  Function name: restoreComment
  Description: This function restore any changes in the current expanded comment
               section
  */
  restoreComment(element: HarvestMouse) {
    this.restoreAndClearCommment();
    this.expandedElement = element;
    // if the originalText is null,
    // means it is first enter the current expanded mode
    // assign the current comment to it
    // if not means it is still at current expaneded mode
    this.originalText = this.expandedElement.comment;
  }

  /*
  Function name: isAllSelected
  Description: Whether the number of selected elements matches the total number of rows.
  */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /*
  Function name: masterToggle
  Description:  Selects all rows if they are not all selected; otherwise clear selection.
  */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));

    this.selectionEvent.emit(this.selection);
  }

  /*
  Function name: selectionEventChange
  Description: Trigger when the checkbox state changed
  */
  selectionEventChange(event, row) {
    if (event) {
      this.selection.toggle(row);
      this.selectionEvent.emit(this.selection);
    }
  }

  /*
  Function name: deleteOnClick
  Description:  This function will be called when the delete button is clicked
  */
  deleteOnClick() {
    let harvestMouseList: HarvestMouse[] = [];
    harvestMouseList.push(this.expandedElement);

    this.diagService.openConfirmationDialog(
      this.dialog,
      harvestMouseList
    ).subscribe(result => {
      if (result) {
        this.submitDisabled = true;
        this.harvestedMouseDataproviderService.deleteHarvestedMouseRequest(
          harvestMouseList
        ).subscribe(
          (result) => {
            let responseFrame: ResponseFrame = <ResponseFrame>result;
            this.submitDisabled = false;
            if (responseFrame.result != 0) {
              this.dataFreshEventRequired.emit();
              this.displayToastMsg(
                "Mouse deleted successfully",
                SuccessColor
              );
            } else {
              this.displayToastMsg(
                responseFrame.payload,
                SuccessColor
              );
            }
          },
          (error) => {
            this.submitDisabled = false;
            this.displayToastMsg(
              "Network Error",
              SuccessColor
            );
          }
        )
      }
    });
  }

  /*
  Function name: commentAreaChanged
  Description:  This function will be called when something typed in the textarea
  */
  commentAreaChanged() {
    this.IsTextAreaModifed = true;
  }

  /*
  Function name: confirmOnClick
  Description:  This function will be called when confirm button is clicked
  */
  confirmOnClick() {
    let harvestMouseList: HarvestMouse[] = [];
    harvestMouseList.push(this.expandedElement);
    this.submitDisabled = true;
    this.harvestedMouseDataproviderService.updateHarvestedMouseRequest(
      harvestMouseList
    ).subscribe(
      (result) => {
        let responseFrame: ResponseFrame = <ResponseFrame>result;
        
        if (responseFrame.result != 0) {
          this.dataFreshEventRequired.emit();
          this.displayToastMsg(
            "Comment updated successfully",
            SuccessColor
          );
        } else {
          this.displayToastMsg(
            responseFrame.payload,
            ErrorColor
          );
        }
        this.IsTextAreaModifed = false;
        this.originalText = this.expandedElement.comment;
      },
      (error) => {
        this.submitDisabled = false;
        this.displayToastMsg(
          "Network Error",
          ErrorColor
        );
      }
    );
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

  /*
  Function name: pageChanged
  Description: Trigger when page changed event occured
  */
  pageChanged(event: PageEvent){
    this.pageChangedEvent.emit(event);
  }

}
