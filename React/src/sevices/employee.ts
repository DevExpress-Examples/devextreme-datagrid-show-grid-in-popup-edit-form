export interface Student { ID: number; Name: string }
export interface Subject { Name: string; Code: string; Units: number }
export interface StudentRow { ID: number; StudentID: number; Subjects: Subject[] }

export const students: Student[] = [
  { ID: 1, Name: 'Jose Mari Gabon' },
  { ID: 2, Name: 'Kurt Ronald Tan' },
  { ID: 3, Name: 'Michael Mendiola' },
  { ID: 4, Name: 'Zach Familara' },
  { ID: 5, Name: 'Alexandra Marie Morano' },
  { ID: 6, Name: 'Elmar Jo Simpas' },
];

export const studentRows: StudentRow[] = [
  { ID: 1, StudentID: 1, Subjects: [] },
  {
    ID: 2,
    StudentID: 3,
    Subjects: [
      { Name: 'Team Sports', Code: 'PE4', Units: 2 },
      { Name: 'Integral Calculus', Code: 'MATH224', Units: 4 },
    ],
  },
  {
    ID: 3,
    StudentID: 4,
    Subjects: [
      { Name: 'Computer Workshop 4', Code: 'COE222', Units: 2 },
      { Name: 'Philippine Literature', Code: 'LIT1', Units: 3 },
    ],
  },
];

export function getStudentRows(): StudentRow[] { return studentRows.map((r) => ({ ...r, Subjects: r.Subjects.map((s) => ({ ...s })) })); }
export function getStudents(): Student[] { return students.map((s) => ({ ...s })); }
