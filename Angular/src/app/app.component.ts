import { Component, ViewChild } from '@angular/core';
import { DxDataGridComponent } from "devextreme-angular";
import DataSource from "devextreme/data/data_source"
import { Service } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service]
})
export class AppComponent {
  @ViewChild("mainGrid", { static: false }) mainGrid: any = DxDataGridComponent;
  title = 'project';
  dataSource: any;
  allValid: any;
  subjects: any = [];
  rowData: any = [];
  constructor(service: Service) {
    this.dataSource = new DataSource({
      store: {
        type: "array",
        key:"ID",
        data: service.getEmployees()
      }
    });
  }
  onInitNewRow(e: any) {
    this.subjects = [];
    e.data.Subjects = this.subjects;
  }
  onEditingStart(e: any) {
    this.rowData["key"] = e.key;
    this.subjects = e.data.Subjects.slice();
  }
  onEditorPreparing(e: any) {
    if (e.dataField === "Name" && e.parentType === "dataRow") {
      this.rowData["name"] = e.row.data.Name;
      this.allValid = !e.row.data.Name || e.row.data.Name === "" && e.row.data.hasOwnProperty("Name") || this.subjects.length === 0;
    }
  }
  
  onEditorPreparingSub(e: any) {
    if (e.parentType === "dataRow") {
      if (!e.row.data.SubjectCode || e.row.data.SubjectCode === "" ||
        !e.row.data.SubjectName || e.row.data.SubjectName === "" ||
        !e.row.data.Section || e.row.data.Section === "" || e.component.hasEditData()) 
        this.allValid = true;
      else
        this.allValid = false;
    }

  }

  customizeText(cellInfo: any) {
    if (cellInfo.value) {
      cellInfo.valueText = "";
      cellInfo.value.map((subject: any) => {
        cellInfo.valueText += subject.SubjectCode + ',';
      })
      cellInfo.valueText = cellInfo.valueText.slice(0, -1);
      return cellInfo.valueText;
    }
  }

  setCellValue(newData: any, value: any) {
    let column = (<any>this);
    column.defaultSetCellValue(newData, value);
  }

  saveButton = () => {
    this.mainGrid.instance.saveEditData();
    this.mainGrid.instance.refresh();
  }

  cancelButton = () => {
    this.mainGrid.instance.cancelEditData();
  }

  onRowValidating(e: any) {
    this.allValid = e.brokenRules.length > 0 ? true : false;
  }

  onRowRemoved(e: any) {
    setTimeout(() => {
      this.allValid = this.subjects.length === 0 ? true : false;
    })

  }

  onSaving(e: any) {
    if (e.changes[0]) {
      e.changes[0] = {
        data: {
          ID: this.rowData["key"],
          Name: this.rowData["name"],
          Subjects: this.subjects
        },
        key: this.rowData["key"],
        type: "update"
      }
    } else {
      e.changes.push({
        data: {
          ID: this.rowData["key"],
          Name: this.rowData["name"],
          Subjects: this.subjects
        },
        key: this.rowData["key"],
        type: "update"
      })
    }
  }
}
