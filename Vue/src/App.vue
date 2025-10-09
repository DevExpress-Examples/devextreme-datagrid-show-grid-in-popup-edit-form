<template>
  <DxDataGrid 
    :data-source="dataSource" 
    key-expr="ID" 
    :show-borders="true" 
    :on-saving="onSaving"
    :on-editing-start="onEditingStart"
    :on-editor-preparing="onEditorPreparing"
    :on-init-new-row="onInitNewRow"
    ref="mainGrid"
  >
    <DxColumn 
      data-field="StudentID" 
      caption="Student Name"
      :width="200"
    >
      <DxLookup
        :data-source="studentsData"
        value-expr="ID"
        display-expr="Name"
        :allow-clearing="true"
      />
      <DxRequiredRule message="Student Name is required!" />
    </DxColumn>
    
    <DxColumn
      data-field="Subjects"
      caption="Subjects"
      :cell-template="subjectsCellTemplate"
      edit-cell-template="subjectsEditor"
      :allow-sorting="false"
    />

    <DxEditing
      mode="popup"
      :allow-adding="true"
      :allow-updating="true"
      :allow-deleting="true"
    >
      <DxPopup 
        :show-title="true" 
        title="Student Subjects" 
        :width="800" 
        :height="460"
        :on-content-ready="onPopupContentReady"
      >
        <DxToolbarItem
          toolbar="bottom"
          location="after"
          widget="dxButton"
          :options="saveButtonOptions"
        />
        <DxToolbarItem
          toolbar="bottom"
          location="after"
          widget="dxButton"
          :options="cancelButtonOptions"
        />
      </DxPopup>

      <DxForm :col-count="2">
        <DxItem data-field="StudentID" :col-span="2" />
        <DxItem data-field="Subjects" :col-span="2" />
      </DxForm>
    </DxEditing>

    <template #subjectsEditor="{ data: cellInfo }">
      <SubjectsEditorComponent
        :current-subjects="currentSubjects"
        :on-subjects-change="onSubjectsChange"
        :on-editing-start="onNestedEditingStart"
        :on-row-validating="onNestedRowValidating"
        :on-saved="onNestedSaved"
      />
    </template>
  </DxDataGrid>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue';
import DxDataGrid, {
  DxColumn,
  DxEditing,
  DxPopup,
  DxForm,
  DxRequiredRule,
  DxLookup,
  DxToolbarItem,
  DxItem
} from "devextreme-vue/data-grid";
import { students, studentSubjects, type Student, type Subject, type StudentSubject } from "./data";
import SubjectsEditorComponent from "./components/SubjectsEditorComponent.vue";

const dataSource = ref<StudentSubject[]>(studentSubjects);
const studentsData = ref<Student[]>(students);
const currentSubjects = ref<Subject[]>([]);
const popupInstance = ref<any>(null);
const canBeSaved = ref<boolean>(false);
const editingKey = ref<any>(null);
const mainGrid = ref<any>(null);

const saveButtonOptions = reactive({
  text: "Save",
  type: "default" as const,
  disabled: false,
  onClick: () => saveMainGrid()
});

const cancelButtonOptions = reactive({
  text: "Cancel",
  onClick: () => cancelMainGrid()
});

// Use any for DevExtreme event types to avoid complex type matching
const subjectsCellTemplate = (container: HTMLElement, options: any) => {
  if (options.value && options.value.length > 0) {
    const text = options.value.map((subject: Subject) => subject.Name).join(", ");
    container.textContent = text;
  }
};

const onEditingStart = (e: any) => {
  currentSubjects.value = [...(e.data.Subjects || [])];
};

const onEditorPreparing = (e: any) => {
  canBeSaved.value = e.row.isNewRow;
  editingKey.value = e.row.key;
};

const onInitNewRow = () => {
  currentSubjects.value = [];
};

const onPopupContentReady = (e: any) => {
  popupInstance.value = e.component.instance();
  if (canBeSaved.value) {
    updateSaveButtonState(true);
    canBeSaved.value = false;
  }
};

const onSubjectsChange = (subjects: Subject[]) => {
  currentSubjects.value = subjects;
};

const onNestedEditingStart = () => {
  updateSaveButtonState(true);
};

const onNestedRowValidating = (e: any) => {
  updateSaveButtonState(!e.isValid);
};

const onNestedSaved = (e: any) => {
  currentSubjects.value = e.component.getDataSource().items();
  const hasSubjects = currentSubjects.value.length > 0;
  updateSaveButtonState(!hasSubjects);
};

const updateSaveButtonState = (disabled: boolean) => {
  if (popupInstance.value) {
    popupInstance.value.option("toolbarItems[0].disabled", disabled);
  }
};

const saveMainGrid = () => {
  mainGrid.value?.instance.saveEditData();
};

const cancelMainGrid = () => {
  mainGrid.value?.instance.cancelEditData();
};

const onSaving = (e: any) => {
  if (e.changes[0]) {
    if (e.changes[0].data) {
      e.changes[0].data.Subjects = currentSubjects.value;
    } else {
      e.changes[0].data = { Subjects: currentSubjects.value };
    }
    return;
  }
  e.changes.push({
    data: { Subjects: currentSubjects.value },
    key: editingKey.value,
    type: "update"
  });
};
</script>
