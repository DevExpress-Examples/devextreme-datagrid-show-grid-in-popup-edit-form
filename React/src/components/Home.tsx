import React, {
  useState, useRef, useContext, createContext, useCallback,
} from 'react';
import DataGrid, {
  Column, Editing, Popup, Form, ToolbarItem, ValidationRule,
  type DataGridRef,
  type DataGridTypes,
} from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';
import { getStudentRows, getStudents } from '../sevices/employee';
import type { StudentRow, Subject, Student } from '../sevices/employee';

interface EditContextShape {
  editingSubjectsRef: React.MutableRefObject<Subject[]>;
  setSubjectsRef: (subjects: Subject[]) => void;
  saveDisabled: boolean;
  setSaveDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  gridRef: React.MutableRefObject<DataGridRef | null>;
}
const EditContext = createContext<EditContextShape | null>(null);

export function HomeComponent(): JSX.Element {
  const gridRef = useRef<DataGridRef>(null);
  const [data, setData] = useState<StudentRow[]>(getStudentRows());
  const [students] = useState<Student[]>(getStudents());
  const editingSubjectsRef = useRef<Subject[]>([]);
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [editingKey, setEditingKey] = useState<string | number | null>(null);

  const subjectsCellRender = useCallback(({ data: rowData }: { data: StudentRow }): JSX.Element => {
    if (!rowData.Subjects || rowData.Subjects.length === 0) return <span />;
    const text = rowData.Subjects.map((s: Subject) => s.Name).join(', ');
    return <span>{text}</span>;
  }, []);

  const onSaving = useCallback((e: DataGridTypes.SavingEvent) => {
    if (!e.changes) return;
    if (e.changes[0]) {
      if (e.changes[0].data) {
        e.changes[0].data.Subjects = editingSubjectsRef.current;
      } else {
        e.changes[0].data = { Subjects: editingSubjectsRef.current };
      }
      return;
    }
    if (editingKey !== null) {
      e.changes.push({ type: 'update', key: editingKey, data: { Subjects: editingSubjectsRef.current } });
    }
  }, [editingKey]);

  const onEditingStart = useCallback((e: DataGridTypes.EditingStartEvent) => {
    setEditingKey(e.key);
    const copy = e.data?.Subjects ? JSON.parse(JSON.stringify(e.data.Subjects)) : [];
    editingSubjectsRef.current = copy;
    setSaveDisabled(copy.length === 0 && !e.data?.ID);
  }, []);

  const onInitNewRow = useCallback(() => {
    setEditingKey(null);
    editingSubjectsRef.current = [];
    setSaveDisabled(true);
  }, []);

  const setSubjectsRefCallback = useCallback((subjects: Subject[]) => {
    editingSubjectsRef.current = subjects;
  }, []);

  const contextValue = React.useMemo<EditContextShape>(() => ({
    editingSubjectsRef,
    setSubjectsRef: setSubjectsRefCallback,
    saveDisabled,
    setSaveDisabled,
    gridRef,
  }), [setSubjectsRefCallback, saveDisabled, setSaveDisabled]);

  const onSaved = useCallback(() => {
    const gridWidget = gridRef.current?.instance?.();
    const dsItems = gridWidget?.option('dataSource');
    if (Array.isArray(dsItems)) {
      setData([...dsItems]);
    }
  }, []);

  const studentsLookup = React.useMemo(() => ({
    dataSource: students,
    valueExpr: 'ID',
    displayExpr: 'Name',
    allowClearing: true,
  }), [students]);

  return (
    <div>
      <EditContext.Provider value={contextValue}>
        <DataGrid
          ref={gridRef}
          dataSource={data}
          keyExpr="ID"
          showBorders={true}
          onSaving={onSaving}
          onSaved={onSaved}
          onEditingStart={onEditingStart}
          onInitNewRow={onInitNewRow}
        >
          <Editing mode="popup" allowAdding={true} allowDeleting={true} allowUpdating={true}>
            <Popup showTitle={true} title="Student Subjects" width={800} height={460}>
              <ToolbarItem toolbar="bottom" location="after" component={SaveToolbarButton} />
              <ToolbarItem toolbar="bottom" location="after" component={CancelToolbarButton} />
            </Popup>
            <Form colCount={1}>
            </Form>
          </Editing>

          <Column
            dataField="StudentID"
            caption="Student Name"
            width={200}
            lookup={studentsLookup}
          >
            <ValidationRule type="required" message="Student Name is required!" />
          </Column>
          <Column
            dataField="Subjects"
            caption="Subjects"
            cellRender={subjectsCellRender}
            editCellComponent={SubjectsEditCell}
            allowSorting={false}
          />
        </DataGrid>
      </EditContext.Provider>
    </div>
  );
}

function CancelToolbarButton(): JSX.Element | null {
  const ctx = useContext(EditContext);
  if (!ctx) return null;

  const handleCancelClick = useCallback((): void => {
    ctx?.gridRef.current?.instance?.().cancelEditData();
  }, [ctx]);

  return <Button text="Cancel" onClick={handleCancelClick} />;
}

function SaveToolbarButton(): JSX.Element | null {
  const ctx = useContext(EditContext);
  if (!ctx) return null;

  const handleSaveClick = useCallback((): void => {
    ctx?.gridRef.current?.instance?.().saveEditData();
  }, [ctx]);

  return <Button text="Save" type="default" disabled={ctx.saveDisabled} onClick={handleSaveClick} />;
}

function SubjectsEditCell(): JSX.Element | null {
  const ctx = useContext(EditContext);
  if (!ctx) return null;
  const { editingSubjectsRef, setSubjectsRef, setSaveDisabled } = ctx;

  const dataSourceRef = useRef<Subject[]>([...editingSubjectsRef.current]);
  const gridRef = useRef<DataGridRef>(null);
  const [isEditing, setIsEditing] = useState(false);

  const syncToRef = useCallback((subjects: Subject[]) => {
    setSubjectsRef(subjects);
  }, [setSubjectsRef]);

  const updateSaveStateOnly = useCallback((subjects: Subject[]) => {
    const shouldDisable = subjects.length === 0 || isEditing;
    setSaveDisabled(shouldDisable);
  }, [setSaveDisabled, isEditing]);

  const onEditingStart = useCallback(() => {
    setIsEditing(true);
    setSaveDisabled(true);
  }, [setSaveDisabled]);

  const onRowValidating = useCallback((e: DataGridTypes.RowValidatingEvent) => {
    if (!e.isValid) {
      setSaveDisabled(true);
    }
  }, [setSaveDisabled]);

  const onSaved = useCallback((e: DataGridTypes.SavedEvent) => {
    setTimeout(() => {
      const gridInstance = e.component;
      const dataSource = gridInstance.option('dataSource');
      if (Array.isArray(dataSource)) {
        const updatedSubjects = [...dataSource];
        dataSourceRef.current = updatedSubjects;
        syncToRef(updatedSubjects);
        setIsEditing(false);
        updateSaveStateOnly(updatedSubjects);
      }
    }, 0);
  }, [syncToRef, updateSaveStateOnly]);

  const onEditCanceled = useCallback(() => {
    setIsEditing(false);
    updateSaveStateOnly(dataSourceRef.current);
  }, [updateSaveStateOnly]);

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        ref={gridRef}
        dataSource={dataSourceRef.current}
        keyExpr="Code"
        height={250}
        repaintChangesOnly={true}
        onEditingStart={onEditingStart}
        onRowValidating={onRowValidating}
        onSaved={onSaved}
        onEditCanceled={onEditCanceled}
      >
        <Column dataField="Code" caption="Code" width={120}>
          <ValidationRule type="required" />
        </Column>
        <Column dataField="Name" caption="Name">
          <ValidationRule type="required" />
        </Column>
        <Column dataField="Units" caption="Units" width={100}>
          <ValidationRule type="required" message="Units is required" />
          <ValidationRule type="pattern" pattern={/^[1-9]{1}$/} message="Units must be more than 1 and less than 9" />
        </Column>
        <Editing
          mode="row"
          allowAdding={true}
          allowDeleting={true}
          allowUpdating={true}
        />
      </DataGrid>
    </div>
  );
}

