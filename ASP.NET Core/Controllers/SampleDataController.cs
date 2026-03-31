using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using ASP.NET_Core.Models;
using ASP_NET_Core.Models;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ASP_NET_Core.Controllers;

[Route("api/[controller]/[action]")]
public class SampleDataController: Controller {
    [HttpGet]
    public object GetStudents(DataSourceLoadOptions loadOptions) {
        return DataSourceLoader.Load(SampleData.Students, loadOptions);
    }

    [HttpGet]
    public object GetStudentSubjects(DataSourceLoadOptions loadOptions) {
        return DataSourceLoader.Load(SampleData.StudentSubjects, loadOptions);
    }

    [HttpPost]
    public IActionResult InsertStudent(string values) {
        var newStudent = new Student();
        JsonConvert.PopulateObject(values, newStudent);

        newStudent.ID = SampleData.Students.Count() + 1;
        SampleData.Students.Add(newStudent);

        return Ok(newStudent);
    }

    [HttpPost]
    public IActionResult InsertStudentSubject(string values) {
        var newStudentSubject = new StudentSubject();
        JsonConvert.PopulateObject(values, newStudentSubject);

        newStudentSubject.ID = SampleData.StudentSubjects.Count() + 1;
        SampleData.StudentSubjects.Add(newStudentSubject);

        return Ok(newStudentSubject);
    }

    [HttpPut]
    public IActionResult UpdateStudent(int key, string values) {
        var student = SampleData.Students.First(s => s.ID == key);
        JsonConvert.PopulateObject(values, student);

        return Ok(student);
    }

    [HttpPut]
    public IActionResult UpdateStudentSubject(int key, string values) {
        var studentSubject = SampleData.StudentSubjects.First(s => s.ID == key);
        JsonConvert.PopulateObject(values, studentSubject);

        return Ok(studentSubject);
    }

    [HttpDelete]
    public void DeleteStudent(int key) {
        var student = SampleData.Students.First(s => s.ID == key);
        SampleData.Students.Remove(student);
    }

    [HttpDelete]
    public void DeleteStudentSubject(int key) {
        var studentSubject = SampleData.StudentSubjects.First(s => s.ID == key);
        SampleData.StudentSubjects.Remove(studentSubject);
    }
}
