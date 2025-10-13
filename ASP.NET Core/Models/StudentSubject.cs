using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace ASP.NET_Core.Models
{
    public class StudentSubject
    {
        public int ID { get; set; }
        
        [Required]
        public int StudentID { get; set; }
        
        [JsonProperty(ObjectCreationHandling = ObjectCreationHandling.Replace)]
        public List<Subject> Subjects { get; set; } = new List<Subject>();
    }
}