using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApplication.Models {
    static class SampleData {
        public static List<Student> Students = new List<Student>() {
            new Student
            {
                ID = 1,
                Name = "John",
                Subjects = new List<Subject>() {
                    new Subject
                    {
                        Code = "Math101",
                        Name = "Math 1",
                        Section = "Dev1-1"
                    },
                    new Subject
                    {
                        Code = "Eng101",
                        Name = "English 1",
                        Section = "Dev1-2"
                    }
                }
            },
            new Student
            {
                ID = 2,
                Name = "Olivia",
                Subjects = new List<Subject>() {
                    new Subject
                    {
                        Code = "Prog101",
                        Name = "Programming 1",
                        Section = "Dev1-2"
                    },
                    new Subject
                    {
                        Code = "Dbms101",
                        Name = "Database Management 1",
                        Section = "Dev1-1"
                    }
                }
            },
            new Student
            {
                ID = 3,
                Name = "Robert",
                Subjects = new List<Subject>() {
                    new Subject
                    {
                        Code = "Math101",
                        Name = "Math 1",
                        Section = "Dev1-1"
                    },
                    new Subject
                    {
                        Code = "Prog101",
                        Name = "Programming 1",
                        Section = "Dev1-2"
                    }
                }
            },
            new Student
            {
                ID = 4,
                Name = "Greta",
                Subjects = new List<Subject>() {
                    new Subject
                    {
                        Code = "Dbms101",
                        Name = "Database Management 1",
                        Section = "Dev1-2"
                    },
                    new Subject
                    {
                        Code = "Eng101",
                        Name = "English 1",
                        Section = "Dev1-2"
                    }
                }
            }
        };
    }
}
