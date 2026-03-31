using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ASP.NET_Core.Models
{
    public class StudentSubject
    {
        public int ID { get; set; }
        
        [Required]
        public int StudentID { get; set; }
        
        public List<Subject> Subjects { get; set; } = new List<Subject>();
    }
}