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
      <DxRequiredRule message="Student Name is required!"/>
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

      <DxForm :col-count="1">
        <DxItem
          data-field="StudentID"
          :col-span="2"
        />
        <DxItem
          data-field="Subjects"
          :col-span="2"
        />
      </DxForm>
    </DxEditing>

    <template #subjectsEditor="{ data: cellInfo }">
      <SubjectEditor
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
  DxItem,
  type DxDataGridTypes
} from 'devextreme-vue/data-grid';
import { students, studentSubjects, type Student, type Subject, type StudentSubject } from '../data';
import SubjectEditor from './SubjectEditor.vue';
import { subjectsCellTemplate } from '../utils';

const dataSource = ref<StudentSubject[]>(studentSubjects);
const studentsData = ref<Student[]>(students);
const currentSubjects = ref<Subject[]>([]);
// DevExtreme popup component instance - keeping as any due to complex DX component typing
const popupInstance = ref<any>(null);
const canBeSaved = ref<boolean>(false);
const editingKey = ref<string | number | null>(null);
// DevExtreme DataGrid component instance - keeping as any due to complex DX component typing
const mainGrid = ref<any>(null);

const saveButtonOptions = reactive({
  text: 'Save',
  type: 'default' as const,
  disabled: false,
  onClick: () => saveMainGrid()
});

const cancelButtonOptions = reactive({
  text: 'Cancel',
  onClick: () => cancelMainGrid()
});

const onEditingStart = (e: DxDataGridTypes.EditingStartEvent) => {
  currentSubjects.value = [...(e.data.Subjects ?? [])];
};

const onEditorPreparing = (e: DxDataGridTypes.EditorPreparingEvent) => {
  canBeSaved.value = e.row?.isNewRow ?? false;
  editingKey.value = e.row?.key;
};

const onInitNewRow = () => {
  currentSubjects.value = [];
};

const onPopupContentReady = (e: DxDataGridTypes.ContentReadyEvent) => {
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

const onNestedRowValidating = (e: { isValid: boolean }) => {
  updateSaveButtonState(!e.isValid);
};

const onNestedSaved = (
  e: { component: { getDataSource: () => { items: () => Subject[] } } }
) => {
  currentSubjects.value = e.component.getDataSource().items();
  const hasSubjects = currentSubjects.value.length > 0;
  updateSaveButtonState(!hasSubjects);
};

const updateSaveButtonState = (disabled: boolean) => {
  if (popupInstance.value) {
    popupInstance.value.option('toolbarItems[0].disabled', disabled);
  }
};

const saveMainGrid = () => {
  mainGrid.value?.instance.saveEditData();
};

const cancelMainGrid = () => {
  mainGrid.value?.instance.cancelEditData();
};

const onSaving = (e: DxDataGridTypes.SavingEvent) => {
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
    type: 'update'
  });
};
</script>
