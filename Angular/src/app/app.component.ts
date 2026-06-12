import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { DxDataGridComponent, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import DataSource from 'devextreme/data/data_source';
import {
  Service, Student, Subject,
} from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Service],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AppComponent {
  @ViewChild('mainGrid', { static: false }) mainGrid!: DxDataGridComponent;

  title = 'Student Subjects Management';

  dataSource: DataSource;

  students: Student[] = [];

  subjects: Subject[] = [];

  canBeSaved = false;

  popupInstance: any;

  key: string | number | null = null;

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

  onInitNewRow(_e: DxDataGridTypes.InitNewRowEvent): void {
    this.subjects = [];
  }

  onEditingStart(e: DxDataGridTypes.EditingStartEvent): void {
    this.subjects = [...e.data.Subjects ?? []];
  }

  onEditorPreparing(e: DxDataGridTypes.EditorPreparingEvent): void {
    this.canBeSaved = e.row?.isNewRow ?? false;
    this.key = e.row?.key;
  }

  onPopupContentReady(e: any): void {
    this.popupInstance = e.component;
    if (this.canBeSaved) {
      e.component.option('toolbarItems[0].disabled', true);
      this.canBeSaved = false;
    }
  }

  onSubjectEditingStart(_e: DxDataGridTypes.EditingStartEvent): void {
    if (this.popupInstance) {
      this.popupInstance.option('toolbarItems[0].disabled', true);
    }
  }

  onSubjectRowValidating(e: DxDataGridTypes.RowValidatingEvent): void {
    if (this.popupInstance) {
      if (e.isValid) {
        this.popupInstance.option('toolbarItems[0].disabled', false);
      } else {
        this.popupInstance.option('toolbarItems[0].disabled', true);
      }
    }
  }

  onSubjectSaved(e: DxDataGridTypes.SavedEvent): void {
    this.subjects = e.component.getDataSource().items();
    if (this.popupInstance) {
      if (this.subjects.length > 0) {
        this.popupInstance.option('toolbarItems[0].disabled', false);
      } else {
        this.popupInstance.option('toolbarItems[0].disabled', true);
      }
    }
  }

  onSaving(e: DxDataGridTypes.SavingEvent): void {
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

  customizeText = (cellInfo: { value?: Subject[]; target?: string }): string => {
    if (cellInfo.value && cellInfo.value.length > 0) {
      return cellInfo.value.reduce((text: string, subject: Subject) => `${text}${subject.Name}, `, '').slice(0, -2);
    }
    return '';
  };
}
