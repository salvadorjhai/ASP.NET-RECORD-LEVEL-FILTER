using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace WebAppTemplate.Controllers
{
    public class FileUploadController : Controller
    {
        [HttpPost]
        public ActionResult Upload()
        {
            return Content("Uploaded", "application/json");
        }

        [HttpGet]
        public ActionResult Download()
        {
            return Content("Uploaded", "application/json");
        }

    }
}