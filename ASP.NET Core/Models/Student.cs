using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ASP_NET_Core.Models;

public class Student
{
    public int ID { get; set; }

    [Required]
    public string Name { get; set; }

    public List<Subject> Subjects { get; set; } = new List<Subject>();
}
