export interface Subject {
  SubjectCode: string;
  SubjectName: string;
  Section: string;
}

export interface Employee {
  ID: number;
  Name: string;
  Subjects: Subject[];
}
