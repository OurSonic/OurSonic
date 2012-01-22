CodeMirror.defineMode("Spoke", function (config, parserConfig) {
    var indentUnit = config.indentUnit;
    var jsonMode = parserConfig.json;

    // Tokenizer
    var keywords = function () {
            var A = "keyworda",
                B = "keywordb",
                C = "keywordc";
            return {
                "if": A,
                "def": A,
                "class": A,
                "template": C,
                "enum": C,
                "else": A,
                "create": A,
                "return": A,
                "yield": A,
                "type": A,
                "macro": A,
                "true": B,
                "false": B,
                "null": B,
                "switch": B,
            };
        }();


    function nextUntilUnescaped(stream, end) {
        var escaped = false,
            next;
        while ((next = stream.next()) != null) {
            if (next == end && !escaped) return false;
            escaped = !escaped && next == "\\";
        }
        return escaped;
    }


    function arrayContains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}

    var isOperatorChar = /[+\-*&%,\:.=<>()!?|]/;

    function generateTokens(stream, state) {
        var tokens=[];

       var ch = stream.next();
        if (/\d/.test(ch)) {
            stream.match(/^\d*(?:\.\d*)?(?:e[+\-]?\d+)?/);
            tokens.push({type:'number',value:stream.current()});
            
        } else if (isOperatorChar.test(ch) || ch == '}' || ch == '{') {


            state.wasPeroid = false;

            if (ch == '.') state.wasPeroid = true;


            if (ch == '=' && stream.peek() == '>') {
                stream.next();
                return "specoperatorb";
            }
            if (ch == '|' && stream.peek() == '(') {
                stream.next();
                return "specoperatorc";
            }


            if (state.wasDef && ch == '(') {
                state.defParams = true;
                state.wasDef = false;
            }
            if (ch == ')' && state.defParams) {
                state.defParams = false;
            }

            if (ch == '{') {
                state.inObjectVarSet = true;
                state.wasCreate = false;
            }
            if (ch == '}') {
                state.inObjectVarSet = false;
            }

            return "specoperatora";
        } else if (ch == "\"") {
            nextUntilUnescaped(stream, "\"");
            return "string";
        } else {
            stream.eatWhile(/[\w\$_]/);
            var word = stream.current().toLowerCase();
            if (word == "create") state.wasCreate = true;
            if (word == "class") state.wasClass = true;
            if (word == "def") {
                state.defLine = true;
                state.wasDef = true;
            }
            if (state.defParams) {
                return "paramdef";
            }
            if (keywords[word] == null) {
                if (state.wasCreate) {
                    state.wasCreate = false;

                    var i = globalState.classes.length;
                    while (i--) {
                       if (globalState.classes[i].className == word) {
                           return "createclass";
                        }
                    }
                    return "error";
                }
                if (state.wasDef) {
                    state.wasDef = false;
                    return "createdef";
                }
                if (state.wasClass) {
                    //alert("Class " +word);
                    state.wasClass = false;
                    return "createclass";
                }

                stream.eatSpace();


                if (stream.peek() == '=' && (startOfLine || state.inObjectVarSet || state.wasPeroid)) {

                    state.wasPeroid = false;
                    return "variableb";
                }


                if (stream.peek() == '.') {
                    return "variabled";
                }

                state.wasPeroid = false;
                if (stream.peek() == '(') {

                    return "variablec";
                }

                return "variable";
            }
            return keywords[word];
        }
        
    }

    function parseStream(globalState,startOfLine, stream, state) { 
    }




    return {
    
        startGlobalState: function () {
            this.globalState={
                classes:[]
            };
        },
        startState: function (basecolumn) {
            return {
                wasCreate: false,
                wasClass: false,
                wasDef: false,
                inObjectVarSet: false,
                startOfLine: false,
                wasPeroid: false,
                defParams: false,
                defLine: false

            };
        },
        token: function (stream, state) {
            if (stream.sol()) {
                state.startOfLine = true;
                state.defLine = false;
            }

            if (stream.eatSpace()) return null;

            var style = parseStream(this.globalState,state.startOfLine, stream, state);

            if (!stream.sol()) state.startOfLine = false;

            return style;
        },
        preToken: function (stream, state) {
            if (stream.sol()) {
                state.startOfLine = true;
                state.defLine = false;
            }
            if (stream.eatSpace()) return ;
             
            if (!stream.sol()) state.startOfLine = false;



            var ch = stream.next();
        if (/\d/.test(ch)) {
            stream.match(/^\d*(?:\.\d*)?(?:e[+\-]?\d+)?/);
            return ;
        } else  if (isOperatorChar.test(ch) || ch == '}' || ch == '{') {


            state.wasPeroid = false;

            if (ch == '.') state.wasPeroid = true;


            if (ch == '=' && stream.peek() == '>') {
                stream.next();
                return "specoperatorb";
            }
            if (ch == '|' && stream.peek() == '(') {
                stream.next();
                return "specoperatorc";
            }


            if (state.wasDef && ch == '(') {
                state.defParams = true;
                state.wasDef = false;
            }
            if (ch == ')' && state.defParams) {
                state.defParams = false;
            }

            if (ch == '{') {
                state.inObjectVarSet = true;
                state.wasCreate = false;
            }
            if (ch == '}') {
                state.inObjectVarSet = false;
            }

            return "specoperatora";
        }








          
            stream.eatWhile(/[\w\$_]/);

            var word = stream.current().toLowerCase();
          

            if (word == "class") {state.wasClass = true;
            this.globalState.classes.push({className:'',methods:[],fields:[]});
            return;}else
            if (word == "def") {
                this.globalState.classes[this.globalState.classes.length-1].methods.push({name:'',numberOfFields:0});
                state.defLine = true;
                state.wasDef = true;
                return;
            }
            else if (state.defParams) {
               mts=this.globalState.classes[this.globalState.classes.length-1].methods;
                    mts[mts.length-1].numberOfFields++;
                return;
            }
    

                if (state.wasDef) {
                    state.wasDef = false;
                    mts=this.globalState.classes[this.globalState.classes.length-1].methods;
                    mts[mts.length-1].name=word;

                    
                return;
                }
                if (state.wasClass) {
                    //alert("Class " +word);
                    state.wasClass = false;
                    this.globalState.classes[this.globalState.classes.length-1].className=word;
                    stream.skipToEnd();
                return;
                }   
    
                    stream.skipToEnd();     
                return  ;   
        }
    };
});

CodeMirror.defineMIME("text/Spoke", "Spoke");