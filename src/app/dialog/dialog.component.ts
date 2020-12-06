import { Component, Inject, ViewChild, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HarvestMouse } from '../interface/harvestmouse';
import { MatAccordion } from '@angular/material/expansion';
import { HarvestedMouseDataproviderService, ResponseFrame } from '../service/dataprovider.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

export interface DialogConfirmationData {
  harvestedMouse: HarvestMouse[];
}

export interface DialogSingleEditData {
  harvestedMouse: HarvestMouse;
}

export interface DataOption {
  name: string;
  listOfData: any;
  filteredOptions: Observable<string[]>;
  control: FormControl;
}

export interface resultSingleEdit {
  harvestedMouse: HarvestMouse,
  result: boolean
}

@Component({
  selector: 'app-dialog-confirmation',
  templateUrl: './dialog.confirmation.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogConfirmationComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfirmationData) { }

}

@Component({
  selector: 'app-dialog-simple-confirmation',
  templateUrl: './dialog.simple.confirmation.component.html',
  styleUrls: ['./dialog.simple.component.scss']

})
export class DialogSimpleConfirmationComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmationComponent>) { }

}

@Component({
  selector: 'app-dialog-single-edit',
  templateUrl: './dialog.single.edit.component.html',
  styleUrls: ['./dialog.single.edit.component.scss']
})
export class DialogSingleEditComponent implements OnInit {

  harvestedMouse: HarvestMouse;
  origHarvestedMouse: HarvestMouse;
  dataOptionList: DataOption[] = [];
  dataOptionDefinedList: string[] = [
    "MouseLine",
    "GenoType",
    "PhenoType",
    "Handler",
    "ProjectTitle",
    "Experiement"
  ]
  dummyDataOption: DataOption = {
    name: 'dummy',
    listOfData: [],
    filteredOptions: new Observable<string[]>(),
    control: new FormControl()
  }
  endDate: Date;
  birthDate: Date;

  @ViewChild("accordion", { static: true }) accordion: MatAccordion;
  // Workaround for angular component issue #13870
  disableAnimation = true;

  constructor(
    public dialogRef: MatDialogRef<DialogSingleEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogSingleEditData,
    private dialog: MatDialog,
    public harvesteddataproviderService: HarvestedMouseDataproviderService) {
    this.origHarvestedMouse = data.harvestedMouse;
    this.harvestedMouse = Object.assign({}, data.harvestedMouse);
    this.birthDate = new Date(this.harvestedMouse.birth_date);
    this.endDate = new Date(this.harvestedMouse.end_date);
  }
  ngOnInit(): void {
    this.initDataOption();

    this.harvesteddataproviderService.getDataList().subscribe(
      (result) => {
        let responseFrame: ResponseFrame = <ResponseFrame>result;
        if (responseFrame.result != 0) {
          this.getDataOptionByName('MouseLine').listOfData = JSON.parse(JSON.stringify(responseFrame.payload['mouseLineList']));
          this.getDataOptionByName('GenoType').listOfData = JSON.parse(JSON.stringify(responseFrame.payload['genoTypeList']));
          this.getDataOptionByName('PhenoType').listOfData = JSON.parse(JSON.stringify(responseFrame.payload['phenoTypeList']));
          this.getDataOptionByName('Handler').listOfData = JSON.parse(JSON.stringify(responseFrame.payload['handlerList']));
          this.getDataOptionByName('ProjectTitle').listOfData = JSON.parse(JSON.stringify(responseFrame.payload['projectTitleList']));
          this.getDataOptionByName('Experiement').listOfData = JSON.parse(JSON.stringify(responseFrame.payload['experiementList']));
          this.dataOptionList.forEach(
            optionElement => {
              optionElement.filteredOptions = optionElement.control.valueChanges.pipe(
                startWith(''),
                map(value => this._filter(value, optionElement))
              )
            });
          this.getDataOptionByName('ProjectTitle').control.disable();
        }
      }
    );
  }

  private _filter(value: string, dataOption: DataOption): string[] {
    const filterValue = value.toLowerCase();
    if (dataOption.listOfData) {
      return dataOption.listOfData.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    }
    else {
      return dataOption.listOfData;
    }
  }

  getDataOptionByName(name: string): DataOption {
    let theData: DataOption = this.dummyDataOption;
    this.dataOptionList.forEach(
      optionElement => {
        if (optionElement.name === name) {
          theData = optionElement;
        }
      });
    return theData;
  }

  initDataOption() {

    this.dataOptionDefinedList.forEach(
      name => {
        this.dataOptionList.push(
          {
            name: name,
            listOfData: [],
            filteredOptions: new Observable<string[]>(),
            control: new FormControl()
          }
        )
      });
  }

  ngAfterViewInit(): void {
    // timeout required to avoid the dreaded 'ExpressionChangedAfterItHasBeenCheckedError'
    setTimeout(() => this.disableAnimation = false);
  }

  consolidateData(): resultSingleEdit {
    return {
      harvestedMouse: this.harvestedMouse,
      result: this.checkDataModifed()
    }
  }

  CloseConfirm() {
    if (this.checkDataModifed()) {
      const dialogRef = this.dialog.open(DialogSimpleConfirmationComponent, {
        width: '400px'
      });

      dialogRef.afterClosed().subscribe(
        result => {
          console.log(result);
          if (result) {
            this.dialog.closeAll();
          }
        }
      );
    }
    else {
      this.dialog.closeAll();
    }
  }
  appendLeadingZeroes(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n
  }

  checkDataModifed() {
    this.harvestedMouse.birth_date = this.birthDate.getFullYear() + "-" + this.appendLeadingZeroes((this.birthDate.getMonth() + 1)) + "-" + this.appendLeadingZeroes(this.birthDate.getDate());
    this.harvestedMouse.end_date = this.endDate.getFullYear() + "-" + this.appendLeadingZeroes((this.endDate.getMonth() + 1)) + "-" + this.appendLeadingZeroes(this.endDate.getDate());
    let origJSONObj = JSON.stringify(this.origHarvestedMouse);
    let JSONObj = JSON.stringify(this.harvestedMouse);
    return origJSONObj !== JSONObj;
  }
}
