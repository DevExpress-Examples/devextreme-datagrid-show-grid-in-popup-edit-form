import type { Employee, Subject } from '../types.js';

const employees: Employee[] = [
  {
    ID: 1,
    Name: 'John',
    Subjects: [
      {
        SubjectCode: 'Math101',
        SubjectName: 'Math 1',
        Section: 'Dev1-1',
      },
      {
        SubjectCode: 'Eng101',
        SubjectName: 'English 1',
        Section: 'Dev1-2',
      },
    ],
  },
  {
    ID: 2,
    Name: 'Olivia',
    Subjects: [
      {
        SubjectCode: 'Prog101',
        SubjectName: 'Programming 1',
        Section: 'Dev1-2',
      },
      {
        SubjectCode: 'Dbms101',
        SubjectName: 'Database Management 1',
        Section: 'Dev1-1',
      },
    ],
  },
  {
    ID: 3,
    Name: 'Robert',
    Subjects: [
      {
        SubjectCode: 'Math101',
        SubjectName: 'Math 1',
        Section: 'Dev1-1',
      },
      {
        SubjectCode: 'Prog101',
        SubjectName: 'Programming 1',
        Section: 'Dev1-2',
      },
    ],
  },
  {
    ID: 4,
    Name: 'Greta',
    Subjects: [
      {
        SubjectCode: 'Dbms101',
        SubjectName: 'Database Management 1',
        Section: 'Dev1-2',
      },
      {
        SubjectCode: 'Eng101',
        SubjectName: 'English 1',
        Section: 'Dev1-2',
      },
    ],
  },
];

function getEmployees(): Employee[] {
  return employees.map((employee) => ({
    ...employee,
    Subjects: employee.Subjects.map((subject: Subject) => ({ ...subject })),
  }));
}

export { getEmployees };
