using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAppTemplate.Models
{
    public class Product
    {
        public int id { get; set; }

        [Required(ErrorMessage = "Product name is required!")]       
        public string ProductName { get; set; }
        public string ProductDescription { get; set; }

        [Required(ErrorMessage = "Product category is required!")]
        public string ProductCategory { get; set; }
        public string ProductCategoryDescription { get; set; }

        [Required(ErrorMessage = "Product price is required!")]
        public decimal? ProductPrice { get; set; } = 0;
        public int StatusLvl { get; set; } = 0;
    }
}