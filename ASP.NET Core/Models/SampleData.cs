using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ASP.NET_Core.Models;

namespace ASP_NET_Core.Models;
static class SampleData {
    public static List<Student> Students = new List<Student>() {
        new Student
        {
            ID = 1,
            Name = "Jose Mari Gabon"
        },
        new Student
        {
            ID = 2,
            Name = "Kurt Ronald Tan"
        },
        new Student
        {
            ID = 3,
            Name = "Michael Mendiola"
        },
        new Student
        {
            ID = 4,
            Name = "Zach Familara"
        },
        new Student
        {
            ID = 5,
            Name = "Alexandra Marie Morano"
        },
        new Student
        {
            ID = 6,
            Name = "Elmar Jo Simpas"
        }
    };

    public static List<StudentSubject> StudentSubjects = new List<StudentSubject>() {
        new StudentSubject
        {
            ID = 1,
            StudentID = 1,
            Subjects = new List<Subject>()
        },
        new StudentSubject
        {
            ID = 2,
            StudentID = 3,
            Subjects = new List<Subject>() {
                new Subject
                {
                    Name = "Team Sports",
                    Code = "PE4",
                    Units = 2
                },
                new Subject
                {
                    Name = "Integral Calculus",
                    Code = "MATH224",
                    Units = 4
                }
            }
        },
        new StudentSubject
        {
            ID = 3,
            StudentID = 4,
            Subjects = new List<Subject>() {
                new Subject
                {
                    Name = "Computer Workshop 4",
                    Code = "COE222",
                    Units = 2
                },
                new Subject
                {
                    Name = "Philippine Literature",
                    Code = "LIT1",
                    Units = 3
                }
            }
        }
    };
}
