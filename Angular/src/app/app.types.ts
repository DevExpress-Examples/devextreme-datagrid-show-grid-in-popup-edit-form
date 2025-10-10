export interface Employee {
  ID: number;
  Name: string;
  Subjects: Subject[];
}

export interface Subject {
  SubjectCode: string;
  SubjectName: string;
  Section: string;
}

export interface SubmitButtonOptions {
  text: string;
  disabled: boolean;
  onClick: () => void;
}

export interface CancelButtonOptions {
  text: string;
  onClick: () => void;
}

export type CustomizeTextTarget =
  | 'row'
  | 'filterRow'
  | 'headerFilter'
  | 'search'
  | 'filterPanel'
  | 'filterBuilder';

export interface CustomizeTextInfo<TValue = unknown> {
  groupInterval?: string | number;
  target?: CustomizeTextTarget;
  value?: TValue;
  valueText?: string;
}
