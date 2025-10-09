import { Component, ViewChild } from '@angular/core';
import { DxDataGridComponent } from "devextreme-angular";
import DataSource from "devextreme/data/data_source";
import { Service, Student, Subject, StudentSubject } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Service]
})
export class AppComponent {
  @ViewChild("mainGrid", { static: false }) mainGrid: any = DxDataGridComponent;
  title = 'Student Subjects Management';
  dataSource: any;
  students: Student[] = [];
  subjects: Subject[] = [];
  canBeSaved: boolean = false;
  popupInstance: any;
  key: any;
  
  constructor(private service: Service) {
    this.students = service.getStudents();
    this.dataSource = new DataSource({
      store: {
        type: "array",
        key: "ID",
        data: service.getStudentSubjects()
      }
    });
  }
  onInitNewRow(e: any) {
    this.subjects = [];
  }

  onEditingStart(e: any) {
    this.subjects = [...(e.data.Subjects || [])];
  }

  onEditorPreparing(e: any) {
    this.canBeSaved = e.row?.isNewRow || false;
    this.key = e.row?.key;
  }

  onPopupContentReady(e: any) {
    this.popupInstance = e.component;
    if (this.canBeSaved) {
      e.component.option("toolbarItems[0].disabled", true);
      this.canBeSaved = false;
    }
  }

  onSubjectEditingStart(e: any) {
    if (this.popupInstance) {
      this.popupInstance.option("toolbarItems[0].disabled", true);
    }
  }

  onSubjectRowValidating(e: any) {
    if (this.popupInstance) {
      if (e.isValid) {
        this.popupInstance.option("toolbarItems[0].disabled", false);
      } else {
        this.popupInstance.option("toolbarItems[0].disabled", true);
      }
    }
  }

  onSubjectSaved(e: any) {
    this.subjects = e.component.getDataSource().items();
    if (this.popupInstance) {
      if (this.subjects.length > 0) {
        this.popupInstance.option("toolbarItems[0].disabled", false);
      } else {
        this.popupInstance.option("toolbarItems[0].disabled", true);
      }
    }
  }

  onSaving(e: any) {
    if (e.changes[0]) {
      if (e.changes[0].data) {
        e.changes[0].data.Subjects = this.subjects;
      }
      return;
    }
    e.changes.push({
      data: { Subjects: this.subjects },
      key: this.key,
      type: "update"
    });
  }

  customizeText = (cellInfo: any) => {
    if (cellInfo.value && cellInfo.value.length > 0) {
      return cellInfo.value.reduce((text: string, subject: Subject) => {
        return text + subject.Name + ", ";
      }, "").slice(0, -2);
    }
    return "";
  }
}
