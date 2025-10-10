<script setup lang="ts">
import { computed } from 'vue';
import DxDataGrid, {
  DxColumn,
  DxEditing,
  DxValidationRule,
  type DxDataGridTypes,
} from 'devextreme-vue/data-grid';

import type { Employee, Subject } from '../types.js';

const props = defineProps<{
  templateData: DxDataGridTypes.ColumnEditCellTemplateData<Employee, number>;
  changes: DxDataGridTypes.DataChange<Employee, number>[];
}>();

type SubjectsSavedEvent = {
  subjects: Subject[];
  templateData: DxDataGridTypes.ColumnEditCellTemplateData<Employee, number>;
};

const emit = defineEmits<{
  'subjects-saved': [SubjectsSavedEvent];
}>();

const subjects = computed<Subject[]>(() => {
  const changeSubjects = props.changes[0]?.data?.Subjects;
  if (Array.isArray(changeSubjects)) {
    return changeSubjects.map((subject: Subject) => ({ ...subject }));
  }

  const originalSubjects = props.templateData.data?.Subjects;
  if (Array.isArray(originalSubjects)) {
    return originalSubjects.map((subject: Subject) => ({ ...subject }));
  }

  return [];
});

function handleSaved(e: DxDataGridTypes.SavedEvent<Subject, string>): void {
  const items = (e.component.getDataSource()?.items() ?? []) as Subject[];
  const normalized = items.map((subject) => ({ ...subject }));
  emit('subjects-saved', { subjects: normalized, templateData: props.templateData });
}
</script>

<template>
  <div id="subject-grid">
    <DxDataGrid
      :data-source="subjects"
      key-expr="SubjectCode"
      :repaint-changes-only="true"
      :height="250"
      @saved="handleSaved"
    >
      <DxColumn data-field="SubjectName">
        <DxValidationRule type="required"/>
      </DxColumn>
      <DxColumn data-field="Section">
        <DxValidationRule type="required"/>
      </DxColumn>
      <DxEditing
        mode="row"
        :allow-adding="true"
        :allow-deleting="true"
        :allow-updating="true"
      />
    </DxDataGrid>
  </div>
</template>

<style scoped>
#subject-grid {
  height: 100%;
}
</style>
