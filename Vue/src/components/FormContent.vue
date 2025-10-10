<script setup lang="ts">
import { computed, ref } from 'vue';
import DxDataGrid, {
  DxColumn,
  DxEditing,
  DxForm,
  DxPopup,
  DxToolbarItem,
  DxValidationRule,
  type DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import type { DxButtonTypes } from 'devextreme-vue/button';
import notify from 'devextreme/ui/notify';

import SubjectEditor from './SubjectEditor.vue';
import { applyGridChange, checkIsValid, type ChangeLike, type GridChange } from '../utils.js';
import { getEmployees } from '../services/employees.js';
import type { Employee, Subject } from '../types.js';

type SubjectsSavedPayload = {
  subjects: Subject[];
  templateData: DxDataGridTypes.ColumnEditCellTemplateData<Employee, number>;
};

const dataGridRef = ref<InstanceType<typeof DxDataGrid> | null>(null);
const data = ref<Employee[]>(getEmployees());
const gridChanges = ref<GridChange[]>([]);
const editRowKey = ref<number | null>(null);
const isValid = ref<boolean>(false);

const cancelButtonOptions = computed<DxButtonTypes.Properties>(() => ({
  text: 'Cancel',
  stylingMode: 'text',
  onClick: handleCancelClick,
}));

const saveButtonOptions = computed<DxButtonTypes.Properties>(() => ({
  text: 'Save',
  type: 'default',
  disabled: !isValid.value,
  onClick: handleSaveClick,
}));

function handleCancelClick(): void {
  const gridComponent = dataGridRef.value;
  if (!gridComponent) {
    return;
  }

  const instance = gridComponent.instance;
  if (!instance) {
    return;
  }

  instance.cancelEditData();
}

function handleSaveClick(): void {
  const gridComponent = dataGridRef.value;
  if (!gridComponent) {
    return;
  }

  const instance = gridComponent.instance;
  if (!instance) {
    return;
  }

  void instance.saveEditData().catch((error: unknown) => {
    notify(error, 'error', 2000);
  });
}

function handleSaving(e: DxDataGridTypes.SavingEvent<Employee, number>): void {
  const [change] = e.changes;
  if (!change) {
    return;
  }

  const normalizedChange: GridChange = {
    ...change,
    data: {
      ...change.data,
      Subjects: (change.data?.Subjects ?? []).map((subject: Subject) => ({ ...subject })),
    },
  };

  if (typeof normalizedChange.key !== 'number' && typeof editRowKey.value === 'number') {
    normalizedChange.key = editRowKey.value;
  }

  data.value = applyGridChange(data.value, normalizedChange, 'ID');
  gridChanges.value = [];
  editRowKey.value = null;
  isValid.value = false;

  e.cancel = true;
  notify('Data saved successfully', 'success', 2000);
}

function handleChangesChange(value: GridChange[]): void {
  const [firstChange] = value;
  gridChanges.value = value;
  isValid.value = checkIsValid(firstChange);
}

function handleEditRowKeyChange(value: number | null): void {
  editRowKey.value = value;
}

function handleEditorPreparing(e: DxDataGridTypes.EditorPreparingEvent<Employee, number>): void {
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

  isValid.value = checkIsValid(validationSource);
}

function customizeText(cellInfo: DxDataGridTypes.ColumnCustomizeTextArg): string {
  if (!Array.isArray(cellInfo.value)) {
    return cellInfo.valueText ?? '';
  }

  return cellInfo.value.map((subject: Subject) => subject.SubjectName).join(', ');
}

function handleSubjectsSaved(payload: SubjectsSavedPayload): void {
  const { subjects, templateData } = payload;
  const normalizedSubjects = subjects.map((subject) => ({ ...subject }));
  templateData.setValue(normalizedSubjects);

  const [existingChange] = gridChanges.value;
  const changeType = existingChange?.type ?? (templateData.row?.isNewRow ? 'insert' : 'update');
  const nextKey =
    existingChange?.key ?? editRowKey.value ?? (templateData.row?.key as number | undefined);
  const resolvedChangeType: GridChange['type'] = changeType ?? 'update';

  const updatedChange: GridChange = existingChange
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
      type: resolvedChangeType,
    };

  gridChanges.value = [updatedChange, ...gridChanges.value.slice(1)];
  isValid.value = checkIsValid(updatedChange);
}
</script>

<template>
  <div id="app-container">
    <DxDataGrid
      ref="dataGridRef"
      :data-source="data"
      key-expr="ID"
      :show-borders="true"
      :repaint-changes-only="true"
      @saving="handleSaving"
      @editor-preparing="handleEditorPreparing"
    >
      <DxEditing
        mode="popup"
        :changes="gridChanges"
        :edit-row-key="editRowKey"
        :allow-adding="true"
        :allow-deleting="true"
        :allow-updating="true"
        @changes-change="handleChangesChange"
        @edit-row-key-change="handleEditRowKeyChange"
      >
        <DxPopup
          :show-title="true"
          :width="800"
          :height="400"
        >
          <DxToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            :options="saveButtonOptions"
          />
          <DxToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            :options="cancelButtonOptions"
          />
        </DxPopup>
        <DxForm :col-count="1"/>
      </DxEditing>

      <DxColumn
        data-field="Name"
        caption="Title"
        :width="90"
      >
        <DxValidationRule type="required"/>
      </DxColumn>
      <DxColumn
        data-field="Subjects"
        caption="Subject Names"
        :allow-sorting="false"
        :customize-text="customizeText"
        edit-cell-template="subjectsEditor"
      />

      <template #subjectsEditor="{ data: templateData }">
        <SubjectEditor
          :template-data="templateData"
          :changes="gridChanges"
          @subjects-saved="handleSubjectsSaved"
        />
      </template>
    </DxDataGrid>
  </div>
</template>

<style scoped>
#app-container {
  width: 900px;
  position: relative;
}
</style>
