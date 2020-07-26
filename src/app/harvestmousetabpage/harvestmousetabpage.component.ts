import { Component, OnInit, AfterViewInit, ViewChildren, ViewChild, ElementRef, QueryList } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataproviderService } from '../service/dataprovider.service';
import { ToastmessageService, SuccessColor, ErrorColor } from '../service/toastmessage.service';
import { harvestMouseFileUploadUrl } from '../service/dataprovider.service';
import { HarvestmousepageComponent } from '../harvestmousepage/harvestmousepage.component';
import { HarvestMouse } from '../interface/harvestmouse';
import { MatTableDataSource } from '@angular/material/table';
import { BottomsheetService } from '../service/bottomsheet.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DiagService } from '../service/diag.service';
import { MatDialog } from '@angular/material/dialog';



interface TabConfig {
   filterString: string[],
   tabName: string,
   datasource: MatTableDataSource<HarvestMouse>,
   harvestMouseList: HarvestMouse[],
   tabComponent: HarvestmousepageComponent
}

@Component({
   selector: 'app-harvestmousetabpage',
   templateUrl: './harvestmousetabpage.component.html',
   styleUrls: ['./harvestmousetabpage.component.scss']
})
export class HarvestmousetabpageComponent implements OnInit, AfterViewInit {
   // Reference the fileInput html element in the template
   @ViewChild('fileInput') fileInputButton: ElementRef;

   // Qeury set for all the HarvestmousepageComponent directives
   // with tab id
   @ViewChildren('tab') tabList: QueryList<HarvestmousepageComponent>;

   loaded: boolean;
   trackedLoadedTabCom: number = 0;

   tabConfig: TabConfig[] =
      [
         {
            tabName: 'Male',
            filterString: ['gender,4:M'],
            datasource: new MatTableDataSource<HarvestMouse>(),
            harvestMouseList: [],
            tabComponent: null
         },
         {
            tabName: 'Female',
            filterString: ['gender,4:F'],
            datasource: new MatTableDataSource<HarvestMouse>(),
            harvestMouseList: [],
            tabComponent: null
         },
      ]

   activeTabConfig: TabConfig;

   groupSelectedEnabled: boolean;

   // selected harvested mouse
   selectedHarvestedMouse: HarvestMouse[];

   constructor(
      private dataprovider: DataproviderService,
      private toastservice: ToastmessageService,
      private diagservice: DiagService,
      private _snackBar: MatSnackBar,
      private bottomsheetservice: BottomsheetService,
      private bottomSheet: MatBottomSheet,
      private diaglog: MatDialog
   ) { 
      this.showInProgress();
   }

   ngOnInit(): void {}

   /*
   Funtion name: ngAfterViewInit
   Description: Based on the document,Respond after Angular checks the component's
                views and child views / the view that a directive is in.
                Called after the ngAfterViewInit() and every subsequent 
                ngAfterContentChecked().
   */
   ngAfterViewInit(): void{
      // Convert view children query set to array
      this.tabList.toArray().forEach(
         // For each of found HarvestedMouse Component
         curTabCom =>
         {
            // For each of the tab config
            this.tabConfig.forEach(
               tabConfigEle => {
                  let tabNameFromTabConfig:string = tabConfigEle.tabName;
                  
                  // If the found HarvestedMouse has the same tabName
                  // as the tabConfig, assign the tabComponent
                  // to this tabConfig
                  if( tabNameFromTabConfig == curTabCom.tabName )
                  {
                     tabConfigEle.tabComponent = curTabCom;
                  }
               }
            )
         }
      )

      // Fresh All the mouse lists in each of the tabs
      this.refreshMouseListsAllTabs();
   }

   /*
   Function name: fileInputChange
   Description: This is the callback function when the input file event
                changed is triggered
   */
   fileInputChange(event: any) {
      let file: File = event.target.files[0];
      this.showInProgress();
      this.dataprovider.fileUploadRequest(file, harvestMouseFileUploadUrl).subscribe(
         data => {
            this.toastservice.openSnackBar(
               this._snackBar, 'Imported Success', 'Dismiss', SuccessColor
            )
            // Fresh All the mouse lists in each of the tabs
            this.refreshMouseListsAllTabs();
            // clear the file cache
            this.fileInputButton.nativeElement.value = "";
            this.InProgressDone();
         },
         error => {
            this.toastservice.openSnackBar(
               this._snackBar, 'Something wrong', 'Dismiss', ErrorColor
            )
            // clear the file cache
            this.fileInputButton.nativeElement.value = "";
            this.InProgressDone();
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

   /*
   Function name: refreshMouseListsAllTabs
   Description: This is the method refresh all the tabs with existing
                datasource assign to the tabConfig
   */
   refreshMouseListsAllTabs() {
      this.tabConfig.forEach(
         tabConfig => {
            this.GetMouseTabList(
               tabConfig
            );
         }
      );

      this.activeTabConfig = this.tabConfig[0];
   }

   /*
   Function name: GetMouseList
   Description: This function trigger get method to get the mouse list
                and populate to the table
   */
   GetMouseTabList(tabConfig: TabConfig) {
      // Load the harvested mouse list when the page is loaded
      this.showInProgress();
      this.dataprovider.getHarvestMouseList(
         tabConfig.filterString
      ).subscribe(
         data => {
            let the_data = <HarvestMouse[]>data;
            tabConfig.harvestMouseList = the_data;
            tabConfig.datasource = new MatTableDataSource<HarvestMouse>(
               tabConfig.harvestMouseList);
            tabConfig.tabComponent.InsertDataSource(tabConfig.datasource);
            tabConfig.tabComponent.refreshSelected();
            this.trackedLoadedTabCom = this.trackedLoadedTabCom + 1;
            if(this.trackedLoadedTabCom == this.tabList.length)
            {
               this.toastservice.openSnackBar(
                  this._snackBar, 'Loaded list completed', 'Dismiss', SuccessColor
               )
            }

            this.InProgressDone();
         },
         error => {
            this.toastservice.openSnackBar(
               this._snackBar, 'Loaded list completed', 'Dismiss', ErrorColor
            )
         }
      );
   }

   /*
   Funtion name: selectedTabChange
   Description: This function will be triggered when the switching to the new tab
   */
   selectedTabChange(event: MatTabChangeEvent){
      let tabName = event.tab.textLabel;
      this.tabConfig.forEach(
         tabConfigEle => {
            if(tabConfigEle.tabName == tabName)
            {
               this.activeTabConfig = tabConfigEle;
               this.selectionEventTrigger(this.activeTabConfig.tabComponent.getSelectedRows());
               this.activeTabConfig.tabComponent.refreshSelected();
            }
         }
      )
   }

   /*
   Funtion name: openBottomSheetClick
   Description: This function will be triggered when the bottom sheet open button
                is clicked
   */
   openBottomSheetClick() 
   {
      this.bottomsheetservice.openBottomSheet(
         this.bottomSheet,
         this.activeTabConfig.tabComponent.displayedColumnInfo,
         this.activeTabConfig.tabComponent.displayedColumns
      )
   }

   selectionEventTrigger(harvestdMouse){
      this.selectedHarvestedMouse = harvestdMouse.selected;

      if(this.selectedHarvestedMouse &&
         this.selectedHarvestedMouse.length > 0){
         this.groupSelectedEnabled = true;
      }
      else{
         this.groupSelectedEnabled = false;
      }
   }

   GroupDeleted(){
      this.diagservice.openConfirmationDialog(
         this.diaglog,
         this.selectedHarvestedMouse
      ).subscribe(result => {
         if(result){
            this.showInProgress();
            this.dataprovider.deleteHarvestedMouseRequest(
               this.selectedHarvestedMouse
            ).subscribe(
               data => {
                  console.log(data);
                  this.refreshMouseListsAllTabs();
                  this.toastservice.openSnackBar(
                     this._snackBar,
                     "Deleted successfully",
                     "Dismiss",
                     SuccessColor
                  )
                  this.groupSelectedEnabled = false;
                  this.InProgressDone();
               },
               error => {
                  console.log(error);
                  this.toastservice.openSnackBar(
                     this._snackBar,
                     "Encountered Error",
                     "Dismiss",
                     ErrorColor
                  )
                  this.InProgressDone();
               }
            )
         }
      });
   }

   showInProgress(){
      this.loaded = true;
   }

   InProgressDone(){
      this.loaded = false;
   }
}