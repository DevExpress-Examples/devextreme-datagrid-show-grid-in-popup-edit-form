<template>
  <DxDataGrid
    :data-source="dataSource"
    key-expr="SubjectCode"
    :show-borders="true"
    :on-saved="onSaved"
    :on-initialized="onInitialized"
  >
    <DxColumn data-field="SubjectCode">
      <DxRequiredRule/>  
    </DxColumn>>
    <DxColumn data-field="SubjectName">
      <DxRequiredRule/>
    </DxColumn>>
    <DxColumn data-field="Section">
      <DxRequiredRule/>
    </DxColumn>>

    <DxEditing
      mode="row"
      :allow-adding="true"
      :allow-updating="true"
      :allow-deleting="true"
    />
  </DxDataGrid>
</template>
<script>
import { DxDataGrid, DxColumn, DxEditing, DxRequiredRule } from "devextreme-vue/data-grid";

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxRequiredRule
  },
  props: {
    dataSource: {
      type: Object,
      default: () => {},
    },
    onSaved: {
      type: Function,
      default: () => function () {},
    },
    onInitialized: {
      type: Function,
      default: () => function () {},
    }
  },
};
</script>
