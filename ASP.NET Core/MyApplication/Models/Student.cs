using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MyApplication.Models
{
    public class Student
    {
        public int ID { get; set; }
        [Required]
        public string Name { get; set; }

        [JsonProperty(ObjectCreationHandling = ObjectCreationHandling.Replace)]
        public List<Subject> Subjects { get; set; }
    }
}
