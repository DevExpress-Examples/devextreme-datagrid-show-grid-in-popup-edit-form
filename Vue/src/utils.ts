import type { Subject } from './data';

export const subjectsCellTemplate = (
  container: HTMLElement,
  options: { value?: Subject[]; target?: string }
): void => {
  if (options.value && options.value.length > 0) {
    const text = options.value.map((subject: Subject) => subject.Name).join(', ');
    container.textContent = text;
  }
};
