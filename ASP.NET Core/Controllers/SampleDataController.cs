using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using ASP_NET_Core.Models;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace ASP_NET_Core.Controllers;

[Route("api/[controller]/[action]")]
public class SampleDataController: Controller {

    [HttpGet]
    public object Get(DataSourceLoadOptions loadOptions) {
        return DataSourceLoader.Load(SampleData.Orders, loadOptions);
    }

    [HttpGet]
    public object GetStudents(DataSourceLoadOptions loadOptions)
    {
        return DataSourceLoader.Load(SampleData.Students, loadOptions);
    }

    [HttpPost]
    public IActionResult InsertStudent(string values)
    {
        var newStudent = JsonSerializer.Deserialize<Student>(values, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        if (newStudent == null) return BadRequest();

        newStudent.ID = SampleData.Students.Count() + 1;
        SampleData.Students.Add(newStudent);

        return Ok(newStudent);
    }

    [HttpPut]
    public IActionResult UpdateStudent(int key, string values)
    {
        var student = SampleData.Students.First(s => s.ID == key);
        var updatedStudent = JsonSerializer.Deserialize<Student>(values, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        if (updatedStudent == null) return BadRequest();

        student.Name = updatedStudent.Name ?? student.Name;
        student.Subjects = updatedStudent.Subjects ?? student.Subjects;

        return Ok(student);
    }

    [HttpDelete]
    public void DeleteStudent(int key)
    {
        var student = SampleData.Students.First(s => s.ID == key);
        SampleData.Students.Remove(student);
    }

}
