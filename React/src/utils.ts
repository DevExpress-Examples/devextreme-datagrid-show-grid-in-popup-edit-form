import applyChanges from 'devextreme/data/apply_changes';

interface StateShape {
  data: any[];
  detailData: any;
  changes: any[];
  editRowKey: string | number | null;
  isValid?: boolean;
}

interface RowData {
  data: {
    [key: string]: any;
    Name?: string;
    Subjects?: any[];
  };
  type?: 'insert' | 'update' | 'remove';
  isNewRow?: boolean;
}

type Action =
  | { type: 'Saving'; payload: { data?: any; key?: string } }
  | { type: 'Set_Changes'; payload: { changes: any[]; isValid: boolean } }
  | { type: 'Set_Key'; payload: string | number | null }
  | { type: 'Set_Valid'; payload: boolean };

function reducer(state: StateShape, action: Action): StateShape {
  switch (action.type) {
    case 'Saving': {
      if (!action.payload.data) action.payload.data = {};

      const newData = applyChanges(state.data, [action.payload.data], { keyExpr: action.payload.key });

      return {
        ...state,
        data: newData,
        detailData: null,
        changes: [],
        editRowKey: null,
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

function checkIsValid(row: RowData): boolean {
  let result = true;
  if (row.type === 'insert' || row.isNewRow === true) {
    result = Boolean(row.data.Name && row.data.Name !== '' && row.data.Subjects && row.data.Subjects.length !== 0 && Object.prototype.hasOwnProperty.call(row.data, 'Name'));
  } else if (row.type === 'update') {
    if (Object.prototype.hasOwnProperty.call(row.data, 'Name')) result = row.data.Name !== '';
    if (Object.prototype.hasOwnProperty.call(row.data, 'Subjects') && row.data.Subjects) result = result && row.data.Subjects.length !== 0;
  }
  return result;
}

export { reducer, checkIsValid };
