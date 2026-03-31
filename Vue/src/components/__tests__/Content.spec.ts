import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import SubjectEditor from '../SubjectEditor.vue';

describe('SubjectEditor', () => {
  it('renders properly', () => {
    const wrapper = mount(SubjectEditor, { props: { currentSubjects: [] } });
    expect(wrapper.find('div').exists()).toBe(true);
  });
});
