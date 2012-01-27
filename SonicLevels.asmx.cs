using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Xml.Linq;

namespace OurSonic
{
    /// <summary>
    /// Summary description for SonicLevels
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class SonicLevels : System.Web.Services.WebService
    {
        private XDocument doc;
        private string c = "sonicLevels.xml";

        public SonicLevels()
        {
            if (!File.Exists(c))
            {
                var j = File.CreateText(c);
                j.Write("<soniclevels></soniclevels>");
                j.Close();
            }
            doc = XDocument.Load(c);
        }

        [WebMethod]
        public string saveLevel(string level)
        {
            XElement lv;
            ((XElement)doc.FirstNode).Add(lv = new XElement("level"));

            var n = DateTime.Now.ToShortDateString() + DateTime.Now.ToShortTimeString();
            lv.Add(new XAttribute("name", n));
            lv.Add(new XAttribute("contents", level));

            doc.Save(c);
            return n;
        }

        

        [WebMethod]
        public void SaveLevelInformation(string name,string level)
        {
            ((XElement)doc.FirstNode).Elements().First(a => a.FirstAttribute.Value == name).FirstAttribute.NextAttribute.Value = level;
            doc.Save(c);
        }

        
        [WebMethod]
        public string openLevel(string level)
        {
            return ((XElement)doc.FirstNode).Elements().First(a => a.FirstAttribute.Value == level).FirstAttribute.NextAttribute.Value;

        }

        [WebMethod]
        public string[] getLevels()
        {
            return ((XElement)doc.FirstNode).Elements().Select(a => a.FirstAttribute.Value).ToArray();
        }

    }


}