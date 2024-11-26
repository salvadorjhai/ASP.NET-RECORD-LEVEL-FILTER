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

            // Group by StatusLvl and get counts
            var transBadge = model
                .GroupBy(item => item.statuslvl)
                .Select(group => new
                {
                    id = group.Key,
                    count = group.Count()
                }).ToList();

            if (param.ContainsKey("statuslvl"))
            {
                model = new List<Product>(model.Where(x => x.statuslvl == int.Parse(param["statuslvl"].ToString())).ToList());
            }

            return Content(JsonConvert.SerializeObject(new { data = model, badgecount = transBadge }), "application/json");
        }

        public ActionResult GetById(int id)
        {
            var js = System.IO.File.ReadAllText(Server.MapPath("~/App_Data/product.json"), new UTF8Encoding(false));
            var list = JsonConvert.DeserializeObject<List<Product>>(js);
            var model = list.FirstOrDefault(x => x.id == id);
            return Content(JsonConvert.SerializeObject(new { data = model }), "application/json");
        }

        public ActionResult Upsert(Product update)
        {
            var js = System.IO.File.ReadAllText(Server.MapPath("~/App_Data/product.json"), new UTF8Encoding(false));
            var list = JsonConvert.DeserializeObject<List<Product>>(js);
            if (update.id <= 0)
            {
                var model = new Product();
                model.id = list.OrderByDescending(x => x.id).Select(x => x.id).FirstOrDefault() + 1;
                model.statuslvl = 1;

                list.Add(model);

                // save
                js = JsonConvert.SerializeObject(list);
                System.IO.File.WriteAllText(Server.MapPath("~/App_Data/product.json"), js, new UTF8Encoding(false));

                // respond
                return Content(JsonConvert.SerializeObject(new { data = model, result = "success" }), "application/json");

            } else
            {
                var model = list.FirstOrDefault(x => x.id == update.id);
                if (model != null && model.statuslvl <= 1)
                {
                    model.ProductName = update.ProductName;
                    model.ProductPrice = update.ProductPrice;
                    model.ProductDescription = update.ProductDescription;
                    model.ProductCategory = update.ProductCategory;
                    model.ProductCategoryDescription = update.ProductCategoryDescription;

                    // save
                    js = JsonConvert.SerializeObject(list);
                    System.IO.File.WriteAllText(Server.MapPath("~/App_Data/product.json"), js, new UTF8Encoding(false));

                    // respond
                    return Content(JsonConvert.SerializeObject(new { data = model, result = "success" }), "application/json");
                }

            }

            return Content(JsonConvert.SerializeObject(new { data = update, result = "nochange" }), "application/json");
        }

        public ActionResult UpdateStatusLevel(int id, int statusid)
        {
            var js = System.IO.File.ReadAllText(Server.MapPath("~/App_Data/product.json"), new UTF8Encoding(false));
            var list = JsonConvert.DeserializeObject<List<Product>>(js);
            var model = list.FirstOrDefault(x => x.id == id);
            if (model != null)
            {
                // update status
                model.statuslvl = statusid;

                // save
                js = JsonConvert.SerializeObject(list);
                System.IO.File.WriteAllText(Server.MapPath("~/App_Data/product.json"), js, new UTF8Encoding(false));

                // respond
                Response.StatusCode = 200;
                return Content(JsonConvert.SerializeObject(new { data = model, result="success" }), "application/json");
            }
            Response.StatusCode = 404;
            return Content(JsonConvert.SerializeObject(new { result = "Not Found" }), "application/json");
        }

    }
}