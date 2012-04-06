using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Xml.Linq;
//using SonicImageParser;

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
        private XDocument objectDoc;
        private string c;

        // private string directory = @"D:\vhosts\dested.com\httpdocs\OurSonic\";
        private string lvlDirectory = ConfigurationManager.AppSettings["LevelDirectory"];
        private string objDirectory = ConfigurationManager.AppSettings["ObjectDirectory"];

        public SonicLevels()
        {
            int[] myArray = { 1, 3, 5, 7, 9 };

            c = lvlDirectory + "sonicLevels.xml";
            if (!File.Exists(c))
            {
                var j = File.CreateText(c);
                j.Write("<soniclevels></soniclevels>");
                j.Close();
            } try
            {
                doc = XDocument.Load(c);
            }
            catch (Exception j)
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
        public void SaveLevelInformation(string name, string level)
        {
            ((XElement)doc.FirstNode).Elements().First(a => a.FirstAttribute.Value == name).FirstAttribute.NextAttribute.Value = level;
            doc.Save(c);
        }


        [WebMethod]
        public string getLevel(string level)
        {

            if (doc.Root.Attribute("Count") == null)
            {
                doc.Root.Add(new XAttribute("Count", 1));
            }
            else
            {
                doc.Root.Attribute("Count").SetValue(int.Parse(doc.Root.Attribute("Count").Value) + 1);
            }
            doc.Save(c);
            return File.ReadAllText(lvlDirectory + level + ".js");

        }


        [WebMethod]
        public string[] getLevels()
        {

            if (doc.Root.Attribute("LVLCount") == null)
            {
                doc.Root.Add(new XAttribute("LVLCount", 1));
            }
            else
            {
                doc.Root.Attribute("LVLCount").SetValue(int.Parse(doc.Root.Attribute("LVLCount").Value) + 1);
            }
            doc.Save(c);
            return new DirectoryInfo(lvlDirectory).GetFiles().Where(a => a.Extension == (".js")).Select(a => a.Name.Replace(".js", "")).ToArray();
            //            return ((XElement)doc.FirstNode).Elements().Select(a => a.FirstAttribute.Value).ToArray();
        }






        [WebMethod]
        public void saveObject(string name, string oldName, string obj)
        {
            File.Delete(objDirectory + oldName + ".js");
            File.WriteAllText(objDirectory + name + ".js", obj);
        }


        [WebMethod]
        public string getObject(string _object)
        {
            if (!File.Exists(objDirectory + _object + ".js")) return "";
            return File.ReadAllText(objDirectory + _object + ".js");

        }
        [WebMethod]
        public object getObjects(string[] _objects)
        {
            int ind = 0;
            return _getObjects(_objects).Select(a=> new {key=_objects[ind++],value=a});
        }
        private IEnumerable<string> _getObjects(string[] _objects)
        {
            foreach (var _object in _objects)
            {

                if (!File.Exists(objDirectory + _object + ".js")) yield return "";
                else
                yield return File.ReadAllText(objDirectory + _object + ".js");

            }
        }



        [WebMethod]
        public string[] getAllObjects()
        {
            return new DirectoryInfo(objDirectory).GetFiles().Where(a => a.Extension == (".js")).Select(a => a.Name.Replace(".js", "")).ToArray();
            //            return ((XElement)doc.FirstNode).Elements().Select(a => a.FirstAttribute.Value).ToArray();
        }

    }


}