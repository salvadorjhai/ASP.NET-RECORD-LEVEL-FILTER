using CsvHelper;
using Microsoft.Ajax.Utilities;
using OfficeOpenXml;
using OfficeOpenXml.FormulaParsing.Excel.Functions.RefAndLookup;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Web;

namespace WebAppTemplate.Utils
{
    public class cInputFileReader
    {
        public List<Dictionary<string, object>> LoadExcel(Stream fs)
        {
            ExcelPackage oBook = new ExcelPackage(fs);
            ExcelWorksheet oSheet = oBook.Workbook.Worksheets[1];

            if (oSheet.Dimension != null)
            {
                // read headers
                var headers = new List<string>();
                for (int i = 1; i < oSheet.Dimension.End.Column; i++)
                {
                    string cell = oSheet.Cells[1, i].Value.ToString();
                    headers.Add(cell);
                }

                // read rows (index starts @ 2)
                var list = new List<Dictionary<string, object>>();
                for (int r = 2; r < oSheet.Dimension.End.Row; r++)
                {
                    var dc = new Dictionary<string, object>();
                    for (int c = 1; c < oSheet.Dimension.End.Column; c++)
                    {
                        if(oSheet.Cells[r, c].Value == null) { continue; }
                        if (string.IsNullOrWhiteSpace(oSheet.Cells[r, c].Value.ToString())) { continue; }
                        string cell = oSheet.Cells[r, c].Value.ToString();
                        dc.Add(headers[c - 1], cell);
                    }
                    list.Add(dc);
                }
                return list;
            }
            return null; // on error
        }

        public List<Dictionary<string, object>> LoadCSV(Stream fs)
        {
            using (var reader = new StreamReader(fs))
            {
                using (CsvReader csvreader = new CsvHelper.CsvReader(reader, new CsvHelper.Configuration.CsvConfiguration()
                {
                    QuoteAllFields = true,
                    HasHeaderRecord = true,
                    UseExcelLeadingZerosFormatForNumerics = true,
                    Encoding = Encoding.Default,
                    CultureInfo = System.Globalization.CultureInfo.InvariantCulture,
                    IgnoreReadingExceptions = true
                }))
                {
                    var headers = new List<string>();

                    try
                    {
                        if (csvreader.ReadHeader())
                        {
                            headers = csvreader.FieldHeaders.ToList();
                        }
                    }
                    catch (Exception) { }

                    try
                    {
                        // get dynamic object
                        var list = new List<Dictionary<string, object>>();
                        var records = csvreader.GetRecords<dynamic>().ToList();
                        foreach (var item in records)
                        {
                            // convert to dictionary
                            var dc = new Dictionary<string, object>(item);
                            list.Add(dc);
                        }
                        // if no headers, try to get from first row
                        if (headers.Count == 0)
                        {
                            headers = list[0].Keys.ToList();
                        }
                        return list;
                    }
                    catch (Exception) { }
                }
            }
            return null; // on error
        }


    }
}