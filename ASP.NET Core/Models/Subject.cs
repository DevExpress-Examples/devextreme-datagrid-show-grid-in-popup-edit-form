using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ASP.NET_Core.Models;

public class Subject {
    [Required]
    public string Code { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public int Units { get; set; }
}
