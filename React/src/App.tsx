import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import DataGrid, {
  Column,
  Editing,
  Form,
  Popup,
  ToolbarItem,
  ValidationRule,
} from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';
import 'devextreme-react/text-area';
import notify from 'devextreme/ui/notify';
import type {
  ColumnCustomizeTextArg,
  DataChange,
  EditorPreparingEvent,
  SavedEvent,
  SavingEvent,
  ColumnEditCellTemplateData,
} from 'devextreme/ui/data_grid';
import './App.css';
import { getEmployees } from './services/employees';
import type { Employee, Subject } from './types';
import {
  checkIsValid,
  reducer,
  type ChangeLike,
  type GridAction,
  type GridState,
} from './utils';

interface GridContextValue {
  state: GridState;
  dispatch: React.Dispatch<GridAction>;
  cancelClickHandler: () => void;
  saveClickHandler: () => void;
}

const GridContext = createContext<GridContextValue | undefined>(undefined);

const initialState: GridState = {
  data: getEmployees(),
  changes: [],
  editRowKey: null,
  isValid: false,
};

function App(): JSX.Element {
  const gridRef = useRef<any>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const cancelClickHandler = useCallback(() => {
    const instance = gridRef.current?.instance?.();
    instance?.cancelEditData();
  }, []);

  const saveClickHandler = useCallback(() => {
    const instance = gridRef.current?.instance?.();
    instance?.saveEditData();
  }, []);

  const customizeText = useCallback((cellInfo: ColumnCustomizeTextArg): string => {
    if (!Array.isArray(cellInfo.value)) {
      return cellInfo.valueText ?? '';
    }

    const subjectNames = cellInfo.value
      .map((subject: Subject) => subject.SubjectName)
      .join(', ');

    return subjectNames;
  }, []);

  const onSaving = useCallback(
    (e: SavingEvent<Employee, number>): void => {
      const [change] = e.changes;
      if (!change) {
        return;
      }

      const normalizedChange: DataChange<Employee, number> = {
        ...change,
        data: {
          ...change.data,
          Subjects: (change.data?.Subjects ?? []).map((subject: Subject) => ({ ...subject })),
        },
      };

      if (typeof normalizedChange.key !== 'number' && typeof state.editRowKey === 'number') {
        normalizedChange.key = state.editRowKey;
      }

      dispatch({
        type: 'Saving',
        payload: {
          change: normalizedChange,
          key: 'ID',
        },
      });
      e.cancel = true;
      notify('Data saved successfully', 'success', 2000);
    },
    [dispatch, state.editRowKey],
  );

  const onChangesChange = useCallback(
    (changes: DataChange<Employee, number>[]): void => {
      const validationResult = checkIsValid(changes[0]);
      dispatch({
        type: 'Set_Changes',
        payload: {
          changes,
          isValid: validationResult,
        },
      });
    },
    [dispatch],
  );

  const onEditRowKeyChange = useCallback(
    (editRowKey: number | null): void => {
      dispatch({ type: 'Set_Key', payload: editRowKey });
    },
    [dispatch],
  );

  const onEditorPreparing = useCallback(
    (e: EditorPreparingEvent<Employee, number>): void => {
      if (e.parentType !== 'dataRow') {
        return;
      }

      const validationSource: ChangeLike = e.row
        ? {
          type: e.row.isNewRow ? 'insert' : 'update',
          data: e.row.data as Partial<Employee>,
          isNewRow: e.row.isNewRow,
        }
        : undefined;

      dispatch({
        type: 'Set_Valid',
        payload: checkIsValid(validationSource),
      });
    },
    [dispatch],
  );

  const contextValue = useMemo<GridContextValue>(
    () => ({
      state,
      dispatch,
      cancelClickHandler,
      saveClickHandler,
    }),
    [state, dispatch, cancelClickHandler, saveClickHandler],
  );

  return (
    <div id="app-container">
      <GridContext.Provider value={contextValue}>
        <div id="data-grid-demo">
          <DataGrid
            dataSource={state.data}
            keyExpr="ID"
            showBorders={true}
            onSaving={onSaving}
            ref={gridRef}
            onEditorPreparing={onEditorPreparing}
            repaintChangesOnly={true}
          >
            <Editing
              mode="popup"
              changes={state.changes}
              onChangesChange={onChangesChange}
              editRowKey={state.editRowKey}
              onEditRowKeyChange={onEditRowKeyChange}
              allowAdding={true}
              allowDeleting={true}
              allowUpdating={true}
            >
              <Popup showTitle={true} width={800} height={400}>
                <ToolbarItem component={SaveButton} location="after" toolbar="bottom" />
                <ToolbarItem component={CancelButton} location="after" toolbar="bottom" />
              </Popup>
              <Form colCount={1} />
            </Editing>
            <Column dataField="Name" caption="Title" width={90}>
              <ValidationRule type="required" />
            </Column>
            <Column
              dataField="Subjects"
              caption="Subject Names"
              editCellComponent={SubjectEditor}
              allowSorting={false}
              customizeText={customizeText}
            />
          </DataGrid>
        </div>
      </GridContext.Provider>
    </div>
  );
}

function useGridContext(): GridContextValue {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error('Grid context is not available');
  }
  return context;
}

function CancelButton(): JSX.Element {
  const { cancelClickHandler } = useGridContext();
  return <Button text="Cancel" onClick={cancelClickHandler} />;
}

function SaveButton(): JSX.Element {
  const { saveClickHandler, state } = useGridContext();
  return <Button text="Save" disabled={!state.isValid} onClick={saveClickHandler} />;
}

function SubjectEditor(templateData: ColumnEditCellTemplateData<Employee, number>): JSX.Element {
  const { state, dispatch } = useGridContext();
  const { changes, editRowKey } = state;

  const subjects = useMemo<Subject[]>(() => {
    const changeSubjects = changes[0]?.data?.Subjects;
    if (Array.isArray(changeSubjects)) {
      return changeSubjects;
    }

    const originalSubjects = templateData.data?.Subjects;
    if (Array.isArray(originalSubjects)) {
      return [...originalSubjects];
    }

    return [];
  }, [changes, templateData.data]);

  const onSaved = useCallback(
    (e: SavedEvent<Subject, string>): void => {
      const gridSubjects = (e.component.getDataSource()?.items() ?? []) as Subject[];
      const normalizedSubjects = gridSubjects.map((subject) => ({ ...subject }));
      const existingChange = changes[0];
      const changeType = existingChange?.type ?? (templateData.row?.isNewRow ? 'insert' : 'update');
      const nextKey = existingChange?.key ?? editRowKey ?? (templateData.row?.key as number | undefined);

      const updatedChange: DataChange<Employee, number> = existingChange
        ? {
          ...existingChange,
          data: {
            ...existingChange.data,
            Subjects: normalizedSubjects,
          },
        }
        : {
          data: {
            Subjects: normalizedSubjects,
          },
          key: nextKey,
          type: changeType,
        };

      const updatedChanges = [updatedChange, ...changes.slice(1)];
      const validationResult = checkIsValid(updatedChange);
      dispatch({
        type: 'Set_Changes',
        payload: {
          changes: updatedChanges,
          isValid: validationResult,
        },
      });
    },
    [changes, dispatch, editRowKey, templateData.row],
  );

  return (
    <div id="subject-grid">
      <DataGrid
        dataSource={subjects}
        onSaved={onSaved}
        keyExpr="SubjectCode"
        repaintChangesOnly={true}
        height={250}
      >
        <Column dataField="SubjectName">
          <ValidationRule type="required" />
        </Column>
        <Column dataField="Section">
          <ValidationRule type="required" />
        </Column>
        <Editing mode="row" allowAdding={true} allowDeleting={true} allowUpdating={true} />
      </DataGrid>
    </div>
  );
}

export default App;
