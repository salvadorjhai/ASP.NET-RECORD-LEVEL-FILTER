using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.WebPages;
using WebAppTemplate.Utils;

namespace WebAppTemplate.Controllers
{
    public class FileImportController : Controller
    {
        [HttpPost]
        public ActionResult Read()
        {
            var fl = Request.Files[0];

            // check if correct file type
            if (fl.ContentType.Contains("sheet") || fl.ContentType.Contains("text/csv") || fl.ContentType.Contains("excel"))
            {
                if (fl.FileName.EndsWith(".xls") || fl.FileName.EndsWith(".xlsx"))
                {
                    // for excel (2003 to latest)
                    var reader = new cInputFileReader().LoadExcel(fl.InputStream);

                    return Content(JsonConvert.SerializeObject(new { status = "success", data = reader }), "application/json");

                } else if (fl.FileName.EndsWith(".csv"))
                {
                    // for text/csv
                    var reader = new cInputFileReader().LoadCSV(fl.InputStream);

                    return Content(JsonConvert.SerializeObject(new { status = "success", data = reader }), "application/json");
                }
            }

            return Content(JsonConvert.SerializeObject(new { status = "failed" }), "application/json");
        }


    }
}