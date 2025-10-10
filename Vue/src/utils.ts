import type { DxDataGridTypes } from 'devextreme-vue/data-grid';

import type { Employee, Subject } from './types.js';

type GridChange = DxDataGridTypes.DataChange<Employee, number>;

type ChangeLike = (Pick<GridChange, 'type' | 'data'> & { isNewRow?: boolean }) | undefined;

function checkIsValid(change: ChangeLike): boolean {
  if (!change) {
    return false;
  }

  const changeData = (change.data ?? {}) as Partial<Employee>;
  const hasNameProp = Object.prototype.hasOwnProperty.call(changeData, 'Name');
  const hasSubjectsProp = Object.prototype.hasOwnProperty.call(changeData, 'Subjects');
  const nameValue = (changeData.Name ?? '').toString().trim();
  const subjectsValue = Array.isArray(changeData.Subjects) ? changeData.Subjects : [];

  if (change.type === 'insert' || change.isNewRow === true) {
    return hasNameProp && nameValue !== '' && subjectsValue.length > 0;
  }

  if (change.type === 'update') {
    let result = true;

    if (hasNameProp) {
      result = nameValue !== '';
    }

    if (hasSubjectsProp) {
      result = result && subjectsValue.length > 0;
    }

    return result;
  }

  return true;
}

function applyGridChange(
  data: Employee[],
  change: GridChange,
  keyField: keyof Employee,
): Employee[] {
  const keyValue = change.key as Employee[typeof keyField] | undefined;

  if (change.type === 'insert') {
    const changeData = (change.data ?? {}) as Partial<Employee>;
    const rawKey = changeData[keyField];
    const generatedKey = typeof rawKey === 'number'
      ? rawKey
      : Math.max(0, ...data.map((employee) => employee.ID)) + 1;

    const nextSubjects = (changeData.Subjects ?? []).map((subject: Subject) => ({
      ...subject,
    }));

    return [
      ...data,
      {
        ID: generatedKey,
        Name: changeData.Name ?? '',
        Subjects: nextSubjects,
      },
    ];
  }

  if (change.type === 'update' && typeof keyValue === 'number') {
    return data.map((employee) => {
      if (employee[keyField] !== keyValue) {
        return employee;
      }

      const changeData = (change.data ?? {}) as Partial<Employee>;
      const nextSubjects = (changeData.Subjects ?? employee.Subjects).map((subject: Subject) => ({
        ...subject,
      }));

      return {
        ...employee,
        ...changeData,
        Subjects: nextSubjects,
      };
    });
  }

  if (change.type === 'remove' && typeof keyValue === 'number') {
    return data.filter((employee) => employee[keyField] !== keyValue);
  }

  return data;
}

export { applyGridChange, checkIsValid };
export type { ChangeLike, GridChange };
