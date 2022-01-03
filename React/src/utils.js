import applyChanges from 'devextreme/data/apply_changes';

function reducer(state, { type, payload }) {
    let newData;
    console.log(type, payload)
    switch (type) {
        case "Saving":
            if (!payload.data)
                payload.data = {};

            newData = applyChanges(state.data, [payload.data], { keyExpr: payload.key }); //simple items

            return {
                ...state,
                data: newData,
                detailData: null,
                changes: [],
                editRowKey: null
            };
        case "Set_Changes":

            return {
                ...state,
                changes: payload.changes,
                isValid: payload.isValid
            };
        case "Set_Key":
            return {
                ...state,
                editRowKey: payload
            };
        case "Set_Valid":
            return {
                ...state,
                isValid: payload
            }
        default:
            return state;
    }

}

 function checkIsValid(row) {
    let result = true
    if (row.type === "insert" || row.isNewRow === true)
        result = row.data.Name && row.data.Name !== "" && row.data.Subjects && row.data.Subjects.length !== 0 && row.data.hasOwnProperty("Name")
    else if (row.type === "update") {
        if (row.data.hasOwnProperty("Name"))
            result = row.data.Name !== "";
        if (row.data.hasOwnProperty("Subjects"))
            result = result && row.data.Subjects.length !== 0
    }
    return result;
}

export {
    reducer,
    checkIsValid
}