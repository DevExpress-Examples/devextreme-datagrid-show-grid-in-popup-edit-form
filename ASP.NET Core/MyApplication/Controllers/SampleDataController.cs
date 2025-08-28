using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using MyApplication.Models;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace MyApplication.Controllers {

    [Route("api/[controller]/[action]")]
    public class SampleDataController : Controller
    {
        [HttpGet]
        public object GetStudents(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(SampleData.Students, loadOptions);
        }

        [HttpPost]
        public IActionResult InsertStudent(string values)
        {
            var newStudent = new Student();
            JsonConvert.PopulateObject(values, newStudent);

            newStudent.ID = SampleData.Students.Count() + 1;
            SampleData.Students.Add(newStudent);

            return Ok(newStudent);
        }

        [HttpPut]
        public IActionResult UpdateStudent(int key, string values)
        {
            var student = SampleData.Students.First(s => s.ID == key);
            JsonConvert.PopulateObject(values, student);

            return Ok(student);
        }

        [HttpDelete]
        public void DeleteStudent(int key)
        {
            var student = SampleData.Students.First(s => s.ID == key);
            SampleData.Students.Remove(student);
        }
    }
}