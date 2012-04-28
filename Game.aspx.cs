using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;
using OurSonic;

public partial class Game : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        new MakeSprites().Do2();

       /* string[] st = new string[]
                          {
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/01 - Title.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/02 - Mushroom Hill Zone - Act 1.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/03 - Knuckles' Theme.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/04 - Special Stage.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/05 - Get Chaos Emerald.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/06 - Get Continue.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/07 - Invincibility-Super Sonic-Hyper Sonic.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/08 - Mid-Boss.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/09 - End of Act.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/10 - Mushroom Hill Zone - Act 2.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/11 - Anti-Gravity Bonus Stage.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/12 - Slot Machine Bonus Stage.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/13 - 1-Up.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/14 - Dr Robotnik.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/15 - Game Over.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/16 - Continue.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/17 - Flying Battery Zone - Act 1.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/18 - Flying Battery Zone - Act 2.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/19 - Sandopolis Zone - Act1.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/20 - Sandopolis Zone - Act2.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/21 - Lava Reef Zone - Act 1.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/22 - Lava Reef Zone - Act 2-Hidden Palace Zone.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/23 - Sky Sanctuary Zone.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/24 - Death Egg Zone - Act 1.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/25 - Death Egg Zone - Act 2.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/26 - Final Boss.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/27 - The Doomsday Zone.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/28 - Game Complete.mp3",
                              "http://music.sonicretro.org/Sonic and Knuckles OSV/29 - Credits.mp3",
                          };

        Directory.CreateDirectory("b:\\sonicmusic");
        foreach (var s in st)
        {
            WebClient webClient = new WebClient();
            webClient.DownloadFile(s, "b:\\sonicmusic\\" + s.Split('/')[s.Split('/').Length-1].Split('-')[1].Trim());
        }
        */
    }

}