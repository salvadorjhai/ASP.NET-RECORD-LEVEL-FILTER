using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAppTemplate.Models
{
    public class PageAccessModel
    {

        public int id { get; set; }

        public int moduleid { get; set; }

        [MaxLength(10)]
        public string type { get; set; }

        public int moduleseq { get; set; }

        [MaxLength(25)]
        public string pagecode { get; set; }

        [MaxLength(50)]
        public string pagename { get; set; }

        public string href { get; set; }

        public decimal seq { get; set; }

        [MaxLength(30)]
        public string icon { get; set; }

        public int withSub { get; set; }

        public int hierarchy { get; set; }

        public int parentid { get; set; }

        public int grps { get; set; }

        public int menu_status { get; set; }

        public int can_add { get; set; }

        public int can_edit { get; set; }

        public int can_delete { get; set; }

        public int can_cancel { get; set; }

        public int can_print { get; set; }

        public int can_import { get; set; }

        public int can_export { get; set; }

        public int can_viewall { get; set; }

        public int lvl1 { get; set; }

        public int lvl2 { get; set; }

        public int lvl3 { get; set; }

        public int lvl4 { get; set; }

        public int others { get; set; }

        public int updatelvl { get; set; }

        [MaxLength(50)]
        public string lvl1name { get; set; }

        [MaxLength(50)]
        public string lvl2name { get; set; }

        [MaxLength(50)]
        public string lvl3name { get; set; }

        [MaxLength(50)]
        public string lvl4name { get; set; }

        [MaxLength(50)]
        public string lvl1status { get; set; }

        [MaxLength(50)]
        public string lvl2status { get; set; }

        [MaxLength(50)]
        public string lvl3status { get; set; }

        [MaxLength(50)]
        public string lvl4status { get; set; }

        [MaxLength(50)]
        public string othername { get; set; }

        [MaxLength(50)]
        public string otherstatus { get; set; }

        public int lvl2return { get; set; }

        public int lvl3return { get; set; }

        public int lvl4return { get; set; }


    }

    public class TransBadgeModel
    {
        public int lvl1 { get; set; } = 0;
        public int lvl2 { get; set; } = 0;
        public int lvl3 { get; set; } = 0;
        public int lvl4 { get; set; } = 0;
        public int others { get; set; } = 0;
    }

}