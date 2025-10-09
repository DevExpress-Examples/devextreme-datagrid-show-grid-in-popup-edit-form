using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace ASP.NET_Core.Models {
    public class Student
    {
        public int ID { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
