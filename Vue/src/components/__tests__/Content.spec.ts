import { describe, it, expect } from 'vitest';

import { shallowMount } from '@vue/test-utils';
import FormContent from '../FormContent.vue';

describe('FormContent', () => {
  it('renders grid container', () => {
    const wrapper = shallowMount(FormContent, {
      global: {
        stubs: [
          'DxDataGrid',
          'DxColumn',
          'DxEditing',
          'DxForm',
          'DxPopup',
          'DxToolbarItem',
          'DxValidationRule',
          'SubjectEditor',
        ],
      },
    });

    expect(wrapper.find('#app-container').exists()).toBe(true);
  });
});
