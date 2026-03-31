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
using System.Text.Json;

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
        var newStudent = JsonSerializer.Deserialize<Student>(values)!;
        newStudent.ID = SampleData.Students.Count() + 1;
        SampleData.Students.Add(newStudent);

        return Ok(newStudent);
    }

    [HttpPost]
    public IActionResult InsertStudentSubject(string values) {
        var newStudentSubject = JsonSerializer.Deserialize<StudentSubject>(values)!;
        newStudentSubject.ID = SampleData.StudentSubjects.Count() + 1;
        SampleData.StudentSubjects.Add(newStudentSubject);

        return Ok(newStudentSubject);
    }

    [HttpPut]
    public IActionResult UpdateStudent(int key, string values) {
        var student = SampleData.Students.First(s => s.ID == key);
        PopulateObject(values, student);

        return Ok(student);
    }

    [HttpPut]
    public IActionResult UpdateStudentSubject(int key, string values) {
        var studentSubject = SampleData.StudentSubjects.First(s => s.ID == key);
        PopulateObject(values, studentSubject);

        return Ok(studentSubject);
    }

    private static void PopulateObject<T>(string json, T target) {
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var existing = JsonSerializer.Serialize(target, options);
        using var existingDoc = JsonDocument.Parse(existing);
        using var changesDoc = JsonDocument.Parse(json);
        var merged = new Dictionary<string, JsonElement>();
        foreach (var prop in existingDoc.RootElement.EnumerateObject())
            merged[prop.Name] = prop.Value;
        foreach (var prop in changesDoc.RootElement.EnumerateObject())
            merged[prop.Name] = prop.Value;
        var mergedJson = JsonSerializer.Serialize(merged, options);
        JsonSerializer.Deserialize(mergedJson, target!.GetType(), options);
        var updated = (T)JsonSerializer.Deserialize(mergedJson, target!.GetType(), options)!;
        foreach (var prop in typeof(T).GetProperties())
            prop.SetValue(target, prop.GetValue(updated));
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
