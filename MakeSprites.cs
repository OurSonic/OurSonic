using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;

namespace OurSonic
{
    public class MakeSprites
    {

        public void Do()
        {
            var di = new DirectoryInfo(@"B:\code\BRANCHosnic\OurSonic\assets\Sprites\sonic");
            Dictionary<string, Image> bj = new Dictionary<string, Image>(di.GetFiles().Count());
            foreach (var img in di.GetFiles())
            {
                bj.Add(img.Name.Replace(img.Extension, ""), getImage(img.OpenRead()));
            }
            var j = new JavaScriptSerializer();
            var js = j.Serialize(bj);
            File.WriteAllText(@"B:\code\BRANCHosnic\OurSonic\Content\sprites\sonic.js", js, Encoding.UTF8);

        }

        public void Do2()
        {
            var di = new DirectoryInfo(@"B:\code\BRANCHosnic\OurSonic\assets\Sprites\explosion");
            Dictionary<string, Image> bj = new Dictionary<string, Image>(di.GetFiles().Count());
            foreach (var img in di.GetFiles())
            {
                bj.Add(img.Name.Replace(img.Extension, ""), getImage(img.OpenRead()));
            }
            var j = new JavaScriptSerializer();
            var js = j.Serialize(bj);
            File.WriteAllText(@"B:\code\BRANCHosnic\OurSonic\Content\sprites\explosion.js", js, Encoding.UTF8);

        }


        public class Image
        {
            public byte[] bytes;
            public int[][] palette;
            public int width;
            public int height;
        }
        private Image getImage(FileStream openRead)
        {
            Dictionary<int, Color> cols = new Dictionary<int, Color>();

            var d = new Bitmap(openRead);
            byte[] bytes = new byte[d.Height * d.Width];
            for (int x = 0; x < d.Width; x++)
            {
                for (int y = 0; y < d.Height; y++)
                {
                    var rgb = d.GetPixel(x, y);

                    int ind;
                    if (!cols.ContainsKey(rgb.ToArgb()))
                    {
                        cols.Add(rgb.ToArgb(), rgb);
                    }
                    var arr = cols.Select(a => a.Key).ToArray();
                    bytes[x + y * d.Width] = (byte)Array.IndexOf(arr, rgb.ToArgb());
                }
            }
            return new Image() { bytes = bytes, palette = cols.Select(a => new int[] { a.Value.R, a.Value.G, a.Value.B, a.Value.A }).ToArray(), width = d.Width, height = d.Height };
        }
    }
}