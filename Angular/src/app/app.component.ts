import { Component, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import type { DataChange } from 'devextreme/common/grids';
import type {
  EditingStartEvent,
  EditorPreparingEvent,
  InitNewRowEvent,
  RowRemovedEvent,
  RowValidatingEvent,
  SavingEvent,
} from 'devextreme/ui/data_grid';
import {
  Employee,
  Subject,
  SubmitButtonOptions,
  CancelButtonOptions,
  CustomizeTextInfo,
} from './app.types';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('mainGrid', { static: false }) mainGrid!: DxDataGridComponent;

  title = 'Angular';

  dataSource: DataSource<Employee, number>;

  allValid = false;

  subjects: Subject[] = [];

  rowData: { key?: number; name?: string } = {};

  private readonly employees: Employee[];

  submitButtonOptions: SubmitButtonOptions = {
    text: 'Save',
    disabled: this.allValid,
    onClick: this.saveButton.bind(this),
  };

  cancelButtonOptions: CancelButtonOptions = {
    text: 'Cancel',
    onClick: this.cancelButton.bind(this),
  };

  constructor(private readonly appService: AppService) {
    this.employees = this.appService.getEmployees();
    this.dataSource = new DataSource<Employee, number>({
      store: {
        type: 'array',
        key: 'ID',
        data: this.employees,
      },
    });
  }

  onInitNewRow(e: InitNewRowEvent<Employee, number>): void {
    this.subjects = [];
    e.data.Subjects = this.subjects;
  }

  onEditingStart(e: EditingStartEvent<Employee, number>): void {
    this.rowData.key = typeof e.key === 'number' ? e.key : this.rowData.key;
    const currentSubjects = e.data.Subjects ?? [];
    this.subjects = [...currentSubjects];
  }

  onEditorPreparing(e: EditorPreparingEvent<Employee, number>): void {
    if (e.dataField === 'Name' && e.parentType === 'dataRow' && e.row?.data) {
      const { Name } = e.row.data;
      this.rowData.name = Name;
      const hasNameProperty = Object.prototype.hasOwnProperty.call(e.row.data, 'Name');
      const isNameMissing = !Name || Name === '';
      this.allValid = (isNameMissing && hasNameProperty) || this.subjects.length === 0;
      this.updateButtonState();
    }
  }

  onEditorPreparingSub(e: EditorPreparingEvent<Subject, string>): void {
    if (e.parentType === 'dataRow' && e.row?.data) {
      const { SubjectCode, SubjectName, Section } = e.row.data;
      const hasPendingEdits = e.component.hasEditData();
      const hasEmptyValue = !SubjectCode || SubjectCode === ''
        || !SubjectName || SubjectName === ''
        || !Section || Section === '';
      this.allValid = hasEmptyValue || hasPendingEdits;
      this.updateButtonState();
    }
  }

  customizeText(cellInfo: CustomizeTextInfo<Subject[]>): string {
    const value = cellInfo.value ?? [];
    if (value.length > 0) {
      const subjectNames = value.map((subject: Subject) => subject.SubjectName);
      return subjectNames.join(', ');
    }
    return cellInfo.valueText ?? '';
  }

  setCellValue(
    this: { defaultSetCellValue: (data: Record<string, unknown>, newValue: unknown) => void },
    newData: Record<string, unknown>,
    value: unknown,
  ): void {
    this.defaultSetCellValue(newData, value);
  }

  saveButton(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.mainGrid.instance.saveEditData();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.mainGrid.instance.refresh();
    notify('Data saved successfully', 'success', 2000);
  }

  cancelButton(): void {
    this.mainGrid.instance.cancelEditData();
  }

  onRowValidating(e: RowValidatingEvent<Subject, string>): void {
    const brokenRules = e.brokenRules ?? [];
    this.allValid = brokenRules.length > 0;
    this.updateButtonState();
  }

  onRowRemoved(_: RowRemovedEvent<Subject, string>): void {
    setTimeout(() => {
      this.allValid = this.subjects.length === 0;
      this.updateButtonState();
    });
  }

  onSaving(e: SavingEvent<Employee, number>): void {
    const changes: DataChange<Employee, number>[] = e.changes;
    const [firstChange] = changes;

    if (firstChange) {
      const data = (firstChange.data ?? {}) as Partial<Employee>;
      data.Subjects = [...this.subjects];
      if (!data.Name && this.rowData.name) {
        data.Name = this.rowData.name;
      }
      if (typeof this.rowData.key === 'number' && firstChange.type !== 'insert') {
        firstChange.key = this.rowData.key;
        data.ID = this.rowData.key;
      }
      firstChange.data = data;
      return;
    }

    if (typeof this.rowData.key !== 'number') {
      return;
    }

    const updateChange: DataChange<Employee, number> = {
      data: {
        ID: this.rowData.key,
        Name: this.rowData.name ?? '',
        Subjects: [...this.subjects],
      },
      key: this.rowData.key,
      type: 'update',
    };

    changes.push(updateChange);
  }

  private updateButtonState(): void {
    this.submitButtonOptions = {
      ...this.submitButtonOptions,
      disabled: this.allValid,
    };
  }
}
