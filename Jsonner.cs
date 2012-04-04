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
    public class Jsonner
    {
        private string Text;
        private JsonParser parser;
        public Jsonner(string input)
        {
            Text = input;
        }
        public string get()
        {

            var ch = new char[] { '{', '}', '[', ']', ',', ' ', ':', '=' };

            string[] d = Text.Split(ch, StringSplitOptions.RemoveEmptyEntries);

            var f = d.GroupBy(a => a).OrderByDescending(a => a.Count());
            StringBuilder sb = new StringBuilder();
            int index = 0;
            string fc = "";
            int oldLen = Text.Length;
            foreach (var c in f)
            {
                if (!Enumerable.Range(0, 10).Any(a => c.Key.StartsWith(a.ToString())))
                {

                    Text = Text.Replace(c.Key, "&" + index++);
                    fc += "&" + c.Key;
                }
                if (Text.Length > oldLen)
                {
                    Console.Write("");
                    break;
                }
                oldLen = Text.Length;
            }
            Text = fc.Length + fc + Text;
            return Text;
        }

        public JsonNode Obtain()
        {


            JsonNode n = new JsonNode(JsonNodeType.KeyValue);

            JsonNode last;
            JsonNode cur = null;
            bool preColon = true;
            string curName = "";
            JsonParserPiece f;
            while ((f = parser.GetNext()) != null)
            {
                last = cur;
                switch (f.Type)
                {
                    case JsonParserPieceType.OpenCurly:
                        cur = new JsonNode(JsonNodeType.KeyValue);
                        break;
                    case JsonParserPieceType.OpenBracket:
                        break;
                    case JsonParserPieceType.CloseCurly:
                        break;
                    case JsonParserPieceType.CloseBracket:
                        break;
                    case JsonParserPieceType.Number:
                        preColon = true;
                        break;
                    case JsonParserPieceType.String:
                        if (preColon)
                        {
                            curName = f.Value;
                        }
                        else
                        {
                            cur.Type = JsonNodeType.Native;
                        }
                        break;
                    case JsonParserPieceType.Word:
                        preColon = true;
                        break;
                    case JsonParserPieceType.Colon:
                        preColon = false;
                        break;
                    case JsonParserPieceType.Equals:
                        break;
                    case JsonParserPieceType.Comma:
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
            return n;
        }
    }

    public class JsonParser
    {
        private string Text;
        private int stringIndex = 0;
        public JsonParser(string input)
        {
            Text = input;
        }
        public JsonParserPiece GetNext()
        {
            int cj;
            char m = Text[stringIndex++];
            // while ((m = Text[stringIndex++]) != ' ') ;

            if (m == '{')
                return new JsonParserPiece(JsonParserPieceType.OpenCurly);
            if (m == ']')
                return new JsonParserPiece(JsonParserPieceType.OpenBracket);
            if (m == '}')
                return new JsonParserPiece(JsonParserPieceType.CloseCurly);
            if (m == ']')
                return new JsonParserPiece(JsonParserPieceType.CloseBracket);
            if (m == ',')
                return new JsonParserPiece(JsonParserPieceType.Comma);
            if (m == ':')
                return new JsonParserPiece(JsonParserPieceType.Colon);
            if (m == '=')
                return new JsonParserPiece(JsonParserPieceType.Equals);

            if (m == '\"')
            {
                string jc = "\"";
                while (Text[stringIndex] != '\"' && Text[stringIndex] != '\\')
                {
                    jc += Text[stringIndex];
                    stringIndex++;
                }
                jc += "\"";
                return new JsonParserPiece(JsonParserPieceType.String, jc);
            }
            string j = m.ToString();
            if (int.TryParse(j, out cj))
            {
                while ((m = Text[stringIndex]) == '.' || int.TryParse(m.ToString(), out cj))
                {
                    j += m;
                    stringIndex++;
                }
                return new JsonParserPiece(JsonParserPieceType.Number, j);
            }

            while ((m = Text[stringIndex]) != '.' || m != ':' || m != '=' || m != '}' || m != ']' || m != '{' || m != '[' || m != ' ')
            {
                j += m;
                stringIndex++;
            }
            return new JsonParserPiece(JsonParserPieceType.Word, j);

        }

    }
    public class JsonParserPiece
    {
        public JsonParserPiece(JsonParserPieceType t, string value = null)
        {
            Type = t;
            Value = value;
        }

        public JsonParserPieceType Type { get; set; }
        public string Value { get; set; }

    }
    public enum JsonParserPieceType
    {
        OpenCurly, OpenBracket, CloseCurly, CloseBracket, Number, String, Word,
        Colon, Equals,
        Comma
    }

    public class JsonNode
    {
        public JsonNodeType Type { get; set; }

        public Dictionary<string, JsonNode> KeyValue { get; set; }
        public string Native { get; set; }
        public List<JsonNode> Array { get; set; }

        public JsonNode(JsonNodeType t)
        {
            Type = t;
        }
    }
    public enum JsonNodeType
    {
        KeyValue, Native, Array
    }
}