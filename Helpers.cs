using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;

namespace OurSonic
{
    public static class Helpers
    {
        public static string ToSpecialString(this Color col)
        {
            return Format("#{0}{1}{2}",col.R.ToString("X"), col.G.ToString("X"), col.B.ToString("X"));
        }
        public static string Format(this string col, params object[] args)
        {
            return string.Format(col, args);
        }
    }
}