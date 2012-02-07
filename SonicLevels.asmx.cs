using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Xml.Linq;
using SonicImageParser;

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
        private string c;

     // private string directory = @"D:\vhosts\dested.com\httpdocs\OurSonic\";
       private string directory = @"B:\code\oursonic\";
        public SonicLevels()
        {
       
            c = directory+"sonicLevels.xml";
             if (!File.Exists(c))
            {
                var j = File.CreateText(c);
                j.Write("<soniclevels></soniclevels>");
                j.Close();
            } try
            {
                doc = XDocument.Load(c);
            }catch(Exception j)
            {
                
            }
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
        public string getLevel(string level)
        {
            return File.ReadAllText(directory + "musho.js");
        }

        [WebMethod]
        public string openLevel(string level)
        {
            return File.ReadAllText(directory + "mush2Chunks.js");
            var sd = new ChunkConsumer().getString();
            return sd;
            File.WriteAllText("B:\\mmc.txt", "AAAAA"); 
            var fm = File.OpenRead("b:\\mmd.txt");
            byte[] fmc = new byte[fm.Length];
            fm.Read(fmc, 0, (int)fm.Length);
            fm.Close();

          //  return Convert.ToBase64String(fmc);


            //var sd = new ChunkConsumer().getString();
            
            //return Convert.ToBase64String(sd);
            //return Convert.ToBase64String(sd);


            //return ((XElement)doc.FirstNode).Elements().First(a => a.FirstAttribute.Value == level).FirstAttribute.NextAttribute.Value;
            
        }

        [WebMethod]
        public string[] getLevels()
        {
            return ((XElement)doc.FirstNode).Elements().Select(a => a.FirstAttribute.Value).ToArray();
        }

    }


}