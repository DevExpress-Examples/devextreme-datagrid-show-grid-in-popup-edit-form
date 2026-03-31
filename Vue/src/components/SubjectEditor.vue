<template>
  <DxDataGrid
    :data-source="currentSubjects"
    key-expr="Code"
    :show-borders="true"
    :height="250"
    :on-editing-start="handleEditingStart"
    :on-row-validating="handleRowValidating"
    :on-saved="handleSaved"
  >
    <DxColumn
      data-field="Code"
      caption="Code"
      :width="120"
    >
      <DxRequiredRule/>
    </DxColumn>
    <DxColumn
      data-field="Name"
      caption="Name"
    >
      <DxRequiredRule/>
    </DxColumn>
    <DxColumn
      data-field="Units"
      caption="Units"
      :width="100"
    >
      <DxRequiredRule message="Units is required"/>
      <DxPatternRule
        pattern="^[1-9]{1}$"
        message="Units must be more than 1 and less than 9"
      />
    </DxColumn>

    <DxEditing
      mode="row"
      :allow-adding="true"
      :allow-updating="true"
      :allow-deleting="true"
    />
  </DxDataGrid>
</template>
<script setup lang="ts">
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxRequiredRule,
  DxPatternRule,
  type DxDataGridTypes
} from 'devextreme-vue/data-grid';
import type { Subject } from '../data';

interface Props {
  currentSubjects?: Subject[];
  onSubjectsChange?: (subjects: Subject[]) => void;
  onEditingStart?: (e: DxDataGridTypes.EditingStartEvent) => void;
  onRowValidating?: (e: { isValid: boolean }) => void;
  onSaved?: (e: { component: { getDataSource: () => { items: () => Subject[] } } }) => void;
}

const props = withDefaults(defineProps<Props>(), {
  currentSubjects: () => [],
  onSubjectsChange: () => () => {},
  onEditingStart: () => () => {},
  onRowValidating: () => () => {},
  onSaved: () => () => {}
});

const handleEditingStart = (e: DxDataGridTypes.EditingStartEvent) => {
  props.onEditingStart(e);
};

const handleRowValidating = (e: DxDataGridTypes.RowValidatingEvent) => {
  props.onRowValidating({ isValid: e.isValid });
};

const handleSaved = (e: DxDataGridTypes.SavedEvent) => {
  props.onSaved({ component: e.component });
};
</script>
