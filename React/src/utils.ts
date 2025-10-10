import type { DataChange } from 'devextreme/ui/data_grid';
import type { Employee } from './types';

export interface GridState {
  data: Employee[];
  changes: DataChange<Employee, number>[];
  editRowKey: number | null;
  isValid: boolean;
}

export type GridAction =
  | { type: 'Saving'; payload: { change: DataChange<Employee, number>; key: keyof Employee } }
  | { type: 'Set_Changes'; payload: { changes: DataChange<Employee, number>[]; isValid: boolean } }
  | { type: 'Set_Key'; payload: number | null }
  | { type: 'Set_Valid'; payload: boolean };

export type ChangeLike =
  | (Pick<DataChange<Employee, number>, 'type' | 'data'> & { isNewRow?: boolean })
  | undefined;

export function reducer(state: GridState, action: GridAction): GridState {
  switch (action.type) {
    case 'Saving': {
      const { change, key } = action.payload;
      const updatedData = applyGridChange(state.data, change, key);
      return {
        data: updatedData,
        changes: [],
        editRowKey: null,
        isValid: false,
      };
    }
    case 'Set_Changes':
      return {
        ...state,
        changes: action.payload.changes,
        isValid: action.payload.isValid,
      };
    case 'Set_Key':
      return {
        ...state,
        editRowKey: action.payload,
      };
    case 'Set_Valid':
      return {
        ...state,
        isValid: action.payload,
      };
    default:
      return state;
  }
}

export function checkIsValid(change: ChangeLike): boolean {
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
  change: DataChange<Employee, number>,
  keyField: keyof Employee,
): Employee[] {
  const keyValue = change.key as Employee[typeof keyField] | undefined;

  if (change.type === 'insert') {
    const changeData = (change.data ?? {}) as Partial<Employee>;
    const rawKey = changeData[keyField];
    const generatedKey = typeof rawKey === 'number'
      ? rawKey
      : Math.max(0, ...data.map((employee) => employee.ID)) + 1;

    return [
      ...data,
      {
        ID: generatedKey,
        Name: changeData.Name ?? '',
        Subjects: (changeData.Subjects ?? []).map((subject) => ({ ...subject })),
      },
    ];
  }

  if (change.type === 'update' && typeof keyValue === 'number') {
    return data.map((employee) => {
      if (employee[keyField] !== keyValue) {
        return employee;
      }

      const changeData = (change.data ?? {}) as Partial<Employee>;
      const nextSubjects = (changeData.Subjects ?? employee.Subjects).map((subject) => ({
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
