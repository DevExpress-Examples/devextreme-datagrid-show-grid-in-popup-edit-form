<template>
  <DxDataGrid :data-source="dataSource" key-expr="ID" :show-borders="true" :on-saving="onSaving">
    <DxColumn data-field="Name">
      <DxRequiredRule/>
    </DxColumn>
    <DxColumn
      data-field="Subjects"
      :cell-template="cellTemplate"
      edit-cell-template="subjectsEditor"
    />

    <DxEditing
      mode="popup"
      :allow-adding="true"
      :allow-updating="true"
      :allow-deleting="true"
    >
      <DxPopup :show-title="true" title="Student" :width="800" :height="400" />

      <DxForm :col-count="1" />
    </DxEditing>

    <template #subjectsEditor="{ data: cellInfo }">
      <SubjectsEditorComponent
        :data-source="cellInfo.value? JSON.parse(JSON.stringify(cellInfo.value)) : []"
        :on-saved="(e) => onSubjectsSaved(e, cellInfo.setValue)"
        :on-initialized="getNestedGridInstance"
      />
    </template>
  </DxDataGrid>
</template>
<script>
import DxDataGrid, {
  DxColumn,
  DxEditing,
  DxPopup,
  DxForm,
  DxRequiredRule
} from "devextreme-vue/data-grid";
import { students } from "./data.js";
import SubjectsEditorComponent from "./components/SubjectsEditorComponent.vue";
import notify from 'devextreme/ui/notify';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPopup,
    DxForm,
    DxRequiredRule,
    SubjectsEditorComponent,
  },
  data() {
    return {
      dataSource: students,
      nestedGridInstance: null
    };
  },
  methods: {
    cellTemplate(container, options) {
      const noBreakSpace = "\u00A0";
      const text = (options.value || [])
        .map((element) => element.SubjectName)
        .join(", ");
      container.textContent = text || noBreakSpace;
      container.title = text;
    },
    onSubjectsSaved(e, setValue) {
      var subjectsData = e.component.option("dataSource");
      setValue(subjectsData);
    },
    getNestedGridInstance(e) {
      this.nestedGridInstance = e.component;
    },
    onSaving(e) {
      if (this.nestedGridInstance) {
        e.promise = this.nestedGridInstance.saveEditData().done(() => {
          const isNestedGridEmpty = e.changes.filter(change => change.type !== "remove" && (!change.data.Subjects || change.data.Subjects.length < 1)).length > 0;
          e.cancel = this.nestedGridInstance.hasEditData() || isNestedGridEmpty;
          if (isNestedGridEmpty) {
            notify("The 'Subjects' field is required.", "error");
          }
        });
      }
    }
  },
};
</script>
