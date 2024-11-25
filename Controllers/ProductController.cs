using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using WebAppTemplate.Models;

namespace WebAppTemplate.Controllers
{
    public class ProductController : Controller
    {
        // GET: Product
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult LoadProducts(string q)
        {
            var param = JsonConvert.DeserializeObject<Dictionary<string, string>>(q);
            var js = System.IO.File.ReadAllText(Server.MapPath("~/App_Data/product.json"), new UTF8Encoding(false));
            var model = JsonConvert.DeserializeObject<List<Product>>(js);

            if (param.ContainsKey("statuslvl"))
            {
                model = new List<Product>(model.Where(x => x.statuslvl == int.Parse(param["statuslvl"].ToString())).ToList());
            }

            return Content(JsonConvert.SerializeObject(new { data = model }), "application/json");
        }

        public ActionResult GetById(int id)
        {
            var js = System.IO.File.ReadAllText(Server.MapPath("~/App_Data/product.json"), new UTF8Encoding(false));
            var model = JsonConvert.DeserializeObject<List<Product>>(js).Where(x => x.id == id).FirstOrDefault();
            return Content(JsonConvert.SerializeObject(new { data = model }), "application/json");
        }

    }
}