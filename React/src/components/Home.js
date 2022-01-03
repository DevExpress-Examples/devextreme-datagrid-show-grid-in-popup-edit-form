import React, { useCallback, useMemo, useContext, useReducer, useRef } from 'react';


import DataGrid, {
    Column,
    Editing,
    Popup,
    Form,
    ValidationRule,
    ToolbarItem
} from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';

import 'devextreme-react/text-area';
import { getEmployees } from '../sevices/employees';

import { reducer, checkIsValid } from "../utils";

const initialState = {
    data: getEmployees(),
    disabled: false,
    changes: [],
    detailData: null,
    editRowKey: null,
    isLoading: false
};


const DataContext = React.createContext({});

export const HomeComponent = () => {
    const gridRef = useRef(null);
    const [state, dispatch] = useReducer(reducer, initialState);
    const customizeText = useCallback((cellInfo) => {
        if (cellInfo.value) {
            let cellText = "";
            cellInfo.value.forEach((subject) => {
                cellText += subject.SubjectName + ',';
            })
            return cellText.slice(0, cellText.length - 1);
        }
        return cellInfo.valueText;
    }, []);

    const onSaving = useCallback((e) => {
        e.cancel = true;
        dispatch({ type: "Saving", payload: { data: e.changes[0], key: "ID" } });
    }, []);

    const onChangesChange = useCallback((changes) => {
        let validationResult = true;
        if (changes.length)
            validationResult = checkIsValid(changes[0]);
        dispatch({ type: "Set_Changes", payload: { changes: changes, isValid: validationResult } });
    }, []);

    const onEditRowKeyChange = useCallback((editRowKey) => {
        dispatch({ payload: editRowKey, type: "Set_Key" });
    }, []);
    const cancelClickHandler = useCallback((args) => {
        let gridInstance = gridRef.current.instance;
        gridInstance.cancelEditData();
    }, [])
    const saveClickHandler = useCallback((args) => {
        let gridInstance = gridRef.current.instance;
        gridInstance.saveEditData();
    }, [])

    const onEditorPreparing = useCallback((e) => {
        if (e.parentType === "dataRow") {
            let result = checkIsValid(e.row);
            dispatch({ type: "Set_Valid", payload: result });
        }
    }, [])
    const contextValues = { action: dispatch, state, cancelClickHandler, saveClickHandler };
    return (
        <div id="data-grid-demo">
            <DataContext.Provider value={contextValues} >
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
                        allowUpdating={true}>
                        <Popup showTitle={true} width={800} height={400} >
                            <ToolbarItem
                                component={SaveButton}
                                location="after"
                                toolbar="bottom"
                            />
                            <ToolbarItem
                                component={CancelButton}
                                location="after"
                                toolbar="bottom"
                            />
                        </Popup>
                        <Form colCount={1} />
                    </Editing>
                    <Column dataField="Name" caption="Title" width={90}>
                        <ValidationRule type="required" />
                    </Column>
                    <Column dataField="Subjects" caption="Subject Names" editCellComponent={SubjectEditor} allowSorting={false} customizeText={customizeText} />
                </DataGrid>
            </DataContext.Provider>
        </div>)
}
const CancelButton = (props) => {
    const { cancelClickHandler } = useContext(DataContext);
    return (<Button
        text="Cancel"
        onClick={cancelClickHandler}
    ></Button>)
}
const SaveButton = (props) => {
    const { state, saveClickHandler } = useContext(DataContext);
    return (<Button
        text="Save"
        disabled={!state.isValid}
        onClick={saveClickHandler}
    ></Button>)
}

const SubjectEditor = ({ data }) => {
    const { state, action } = useContext(DataContext);

    const changes = state.changes
    const subjects = useMemo(() => {
        let results = changes[0] && changes[0].data && changes[0].data.Subjects ?
            changes[0].data.Subjects :
            data.data.Subjects ? [...data.data.Subjects] : [];
        return results;
    }, [changes, data]);

    const onSaved = useCallback((e) => {
        let validationResult = true;
        
        if (changes.length === 0)
            changes.push({ data: { Subjects: subjects }, key: state.editRowKey, type: "update" })
        else
            changes[0].data.Subjects = subjects;

        validationResult = checkIsValid(changes[0]);
        action({
            type: "Set_Changes",
            payload: {
                changes: changes,
                isValid: validationResult
            }
        });
    }, [action, changes, subjects, state.editRowKey]);
    return (
        <div>
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
    )
}


