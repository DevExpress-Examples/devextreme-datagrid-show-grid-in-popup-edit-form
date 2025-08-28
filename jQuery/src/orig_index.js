$(()=>{
    let canBeSaved;
    let popup_instance;
    let ctr = 0;
    let key;
    let current_subjects;
    let subjects;
    let subjectsSaved; 
    let changes = [];

    $("#dataGrid").dxDataGrid({
        dataSource: student_subject,
        keyExpr: "ID",
        columns: [
            {
                dataField: "StudentID",
                caption: "Student Name",
                lookup: {
                    allowClearing: true,
                    dataSource: students,
                    valueExpr: "ID",
                    displayExpr: "Name"
                },
            },
            {
                dataField: "Subjects",
                cellTemplate: function(container, options){
                    let text;
                    if(options.value){
                      text = options.value.reduce((string, obj) => {
                          return string + obj.Name + ", "; 
                      }, "").slice(0, -2);
                      container.text(text);  
                    }
                },
                editCellTemplate: function(cellElement, cellInfo){
                    return $("<div>").dxDataGrid({
                        dataSource: subjects,
                        keyExpr: "Code",
                        editing:{   
                            allowAdding:true,
                            allowUpdating:true,
                            allowDeleting:true,
                        },
                        columns: [
                            {
                                dataField: "Code",
                                validationRules: [{ type: "required" }],
                            }, 
                            {
                                dataField: "Name",
                                validationRules: [{ type: "required" }],
                            }, 
                            {
                                dataField: "Units",
                                validationRules: [
                                    { 
                                        type: "required" ,
                                        message: "Units is required"
                                    },
                                    { 
                                        type: "pattern" ,
                                        pattern: "^[1-9]{1}$",
                                        message: "Units must be more than 1 and less than 9"
                                    },
                                ],
                            }
                        ], 
                        onEditingStart: function(e){
                          popup_instance.option("toolbarItems[0].disabled", true);
                        },
                        onRowValidating: function(e){
                            if(e.isValid){
                                popup_instance.option("toolbarItems[0].disabled", false);
                            }
                            else{
                                popup_instance.option("toolbarItems[0].disabled", true);
                            }
                        },
                        onSaved: function(e){
                            subjects = e.component.getDataSource().items();
                            if(e.component.getDataSource().items().length > 0){
                              popup_instance.option("toolbarItems[0].disabled", false);  
                            }
                            else{
                              popup_instance.option("toolbarItems[0].disabled", true);
                            }
                        },
                    });
                }
            },
        ],
        editing: {
            mode: "popup",
            allowAdding: true,
            allowDeleting: true,
            allowUpdating: true,

            form: {
                items: [{
                    dataField: "StudentID",
                    colCount: 1,
                    colSpan: 2,
                    validationRules: [{
                        type: "required",
                        message: "Student Name is required!"
                    }],
                }, {
                    dataField: "Subjects",
                    colCount: 1,
                    colSpan: 2,
                }],
            },
            popup: {  
                onContentReady:function(e){
                    popup_instance = e.component.instance();
                    if(canBeSaved){
                        e.component.option("toolbarItems[0].disabled", true);
                        canBeSaved = false
                    }
                }  
            }  
        },
        onEditingStart: function(e){
            subjects = [...e.data.Subjects];
        },
        onEditorPreparing: function(e){
            canBeSaved = e.row.isNewRow;
            key = e.row.key;
        },
        onInitNewRow: function(e){
          subjects = [];
        },
        
        onSaving: function(e){
          if(e.changes[0]){
             if(e.changes[0].data) e.changes[0].data.Subjects = subjects;
             return;
          }
          e.changes.push({data: {Subjects:subjects},key: key,type: "update"});  
        }
    });
});

var students = [
    {
        ID: 1,
        Name: "Jose Mari Gabon",
    },
    {
        ID: 2,
        Name: "Kurt Ronald Tan",
    },
    {
        ID: 3,
        Name: "Michael Mendiola",
    },
    {
        ID: 4,
        Name: "Zach Familara",
    },
    {
        ID: 5,
        Name: "Alexandra Marie Morano",
    },
    {
        ID: 6,
        Name: "Elmar Jo Simpas",
    },
];

var student_subject = [
    {
        ID: 1,
        StudentID: 1,
        Subjects: [
        ]
    },
    {
        ID: 2,
        StudentID: 3,
        Subjects: [
            {
                Name: "Team Sports",
                Code: "PE4",
                Units: 2
            },
            {
                Name: "Integral Calculus",
                Code: "MATH224",
                Units: 4
            },
        ]
    },
    {
        ID: 3,
        StudentID: 4,
        Subjects: [
            {
                Name: "Computer Workshop 4",
                Code: "COE222",
                Units: 2
            },
            {
                Name: "Philippine Literature",
                Code: "LIT1",
                Units: 3
            },
        ],
    },
];