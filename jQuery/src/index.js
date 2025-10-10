$(() => {
  let canBeSaved;
  let popupInstance;
  let key;
  let subjects;

  const dataGrid = $('#data-grid').dxDataGrid({
    dataSource: studentSubject,
    keyExpr: 'ID',
    columns: [
      {
        dataField: 'StudentID',
        caption: 'Student Name',
        lookup: {
          allowClearing: true,
          dataSource: students,
          valueExpr: 'ID',
          displayExpr: 'Name',
        },
      },
      {
        dataField: 'Subjects',
        cellTemplate(container, options) {
          let text;
          if (options.value) {
            text = options.value.reduce((string, obj) => `${string}${obj.Name}, `, '').slice(0, -2);
            container.text(text);
          }
        },
        editCellTemplate(cellElement, cellInfo) {
          return $('<div>').dxDataGrid({
            dataSource: subjects,
            keyExpr: 'Code',
            editing: {
              allowAdding: true,
              allowUpdating: true,
              allowDeleting: true,
            },
            columns: [
              {
                dataField: 'Code',
                validationRules: [{ type: 'required' }],
              },
              {
                dataField: 'Name',
                validationRules: [{ type: 'required' }],
              },
              {
                dataField: 'Units',
                validationRules: [
                  {
                    type: 'required',
                    message: 'Units is required',
                  },
                  {
                    type: 'pattern',
                    pattern: '^[1-9]{1}$',
                    message: 'Units must be more than 1 and less than 9',
                  },
                ],
              },
            ],
            onEditingStart(e) {
              popupInstance.option('toolbarItems[0].disabled', true);
            },
            onRowValidating(e) {
              if (e.isValid) {
                popupInstance.option('toolbarItems[0].disabled', false);
              } else {
                popupInstance.option('toolbarItems[0].disabled', true);
              }
            },
            onSaved(e) {
              subjects = e.component.getDataSource().items();
              if (e.component.getDataSource().items().length > 0) {
                popupInstance.option('toolbarItems[0].disabled', false);
              } else {
                popupInstance.option('toolbarItems[0].disabled', true);
              }
            },
          });
        },
      },
    ],
    editing: {
      mode: 'popup',
      allowAdding: true,
      allowDeleting: true,
      allowUpdating: true,

      form: {
        items: [
          {
            dataField: 'StudentID',
            colCount: 1,
            colSpan: 2,
            validationRules: [
              {
                type: 'required',
                message: 'Student Name is required!',
              },
            ],
          },
          {
            dataField: 'Subjects',
            colCount: 1,
            colSpan: 2,
          },
        ],
      },
      popup: {
        onContentReady(e) {
          popupInstance = e.component.instance();
          if (canBeSaved) {
            e.component.option('toolbarItems[0].disabled', true);
            canBeSaved = false;
          }
        },
      },
    },
    onEditingStart(e) {
      subjects = [...e.data.Subjects];
    },
    onEditorPreparing(e) {
      canBeSaved = e.row.isNewRow;
      key = e.row.key;
    },
    onInitNewRow(e) {
      subjects = [];
    },

    onSaving(e) {
      if (e.changes[0]) {
        if (e.changes[0].data) e.changes[0].data.Subjects = subjects;
        return;
      }
      e.changes.push({ data: { Subjects: subjects }, key, type: 'update' });
    },
  }).dxDataGrid('instance');
});
