import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import SubjectsEditorComponent from '../SubjectsEditorComponent.vue';

describe('SubjectsEditorComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(SubjectsEditorComponent, { props: { currentSubjects: [] } });
    expect(wrapper.find('div').exists()).toBe(true);
  });
});
