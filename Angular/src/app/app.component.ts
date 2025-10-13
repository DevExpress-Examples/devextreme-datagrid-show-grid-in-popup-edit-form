import { Component, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import {
  Service, Student, Subject, StudentSubject,
} from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Service],
})
export class AppComponent {
  @ViewChild('mainGrid', { static: false }) mainGrid: any = DxDataGridComponent;

  title = 'Student Subjects Management';

  dataSource: any;

  students: Student[] = [];

  subjects: Subject[] = [];

  canBeSaved = false;

  popupInstance: any;

  key: any;

  constructor(private readonly service: Service) {
    this.students = service.getStudents();
    this.dataSource = new DataSource({
      store: {
        type: 'array',
        key: 'ID',
        data: service.getStudentSubjects(),
      },
    });
  }

  onInitNewRow(e: any): void {
    this.subjects = [];
  }

  onEditingStart(e: any): void {
    this.subjects = [...e.data.Subjects || []];
  }

  onEditorPreparing(e: any): void {
    this.canBeSaved = e.row?.isNewRow || false;
    this.key = e.row?.key;
  }

  onPopupContentReady(e: any): void {
    this.popupInstance = e.component;
    if (this.canBeSaved) {
      e.component.option('toolbarItems[0].disabled', true);
      this.canBeSaved = false;
    }
  }

  onSubjectEditingStart(e: any): void {
    if (this.popupInstance) {
      this.popupInstance.option('toolbarItems[0].disabled', true);
    }
  }

  onSubjectRowValidating(e: any): void {
    if (this.popupInstance) {
      if (e.isValid) {
        this.popupInstance.option('toolbarItems[0].disabled', false);
      } else {
        this.popupInstance.option('toolbarItems[0].disabled', true);
      }
    }
  }

  onSubjectSaved(e: any): void {
    this.subjects = e.component.getDataSource().items();
    if (this.popupInstance) {
      if (this.subjects.length > 0) {
        this.popupInstance.option('toolbarItems[0].disabled', false);
      } else {
        this.popupInstance.option('toolbarItems[0].disabled', true);
      }
    }
  }

  onSaving(e: any): void {
    if (e.changes[0]) {
      if (e.changes[0].data) {
        e.changes[0].data.Subjects = this.subjects;
      }
      return;
    }
    e.changes.push({
      data: { Subjects: this.subjects },
      key: this.key,
      type: 'update',
    });
  }

  customizeText = (cellInfo: any): string => {
    if (cellInfo.value && cellInfo.value.length > 0) {
      return (cellInfo.value as Subject[]).reduce((text: string, subject: Subject) => `${text}${subject.Name}, `, '').slice(0, -2);
    }
    return '';
  };
}
