import applyChanges from 'devextreme/data/apply_changes';

function reducer(state: any, { type, payload }: { type: string; payload: any }): any {
  let newData: any = null;
  switch (type) {
    case 'Saving':
      if (!payload.data) payload.data = {};

      newData = applyChanges(state.data, [payload.data], { keyExpr: payload.key });

      return {
        ...state,
        data: newData,
        detailData: null,
        changes: [],
        editRowKey: null,
      };
    case 'Set_Changes':

      return {
        ...state,
        changes: payload.changes,
        isValid: payload.isValid,
      };
    case 'Set_Key':
      return {
        ...state,
        editRowKey: payload,
      };
    case 'Set_Valid':
      return {
        ...state,
        isValid: payload,
      };
    default:
      return state;
  }
}

function checkIsValid(row: any): boolean {
  let result = true;
  if (row.type === 'insert' || row.isNewRow === true) {
    result = row.data.Name && row.data.Name !== '' && row.data.Subjects && row.data.Subjects.length !== 0 && Object.prototype.hasOwnProperty.call(row.data, 'Name');
  } else if (row.type === 'update') {
    if (Object.prototype.hasOwnProperty.call(row.data, 'Name')) result = row.data.Name !== '';
    if (Object.prototype.hasOwnProperty.call(row.data, 'Subjects')) result = result && row.data.Subjects.length !== 0;
  }
  return result;
}

export {
  reducer,
  checkIsValid,
};
