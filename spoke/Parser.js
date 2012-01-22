

function isStatement() {

}




/*
class = "class" + variable + (":"+(variable,",")..)? + (method|assignment)..

method=indent+"def" + "("+(variable + ",").. + ")" + block

block= (newLine+ indent + statement).. 

statement = assignment | switch | if | methodCall | anonFunction
assignment = variablePiece + "=" + anything

switch = "switch"+variable + (newLine + indent + native+":" + block)..

if = "if"+anything + block+ "else"+"if"+anything + block | 
     "if"+anything + block+ "else" + block |
     "if"+anything + block

ifElse= "else" + block

methodCall = variable + "(" + (anything, ",").. + ")" | anonFunction + "(" + (anything  ",").. + ")" | 

anonFunction = anything+"=>" + anonVariables
anonVariables= "|" + "(" +(variable, ",")..+")" + block | block
 
anything = 
            anonFunction | 
            methodCall |
            "(" + anything + ")" |
            anything + "==" + anything |
            anything + "<=" + anything |
            anything + ">=" + anything |
            anything + "<" + anything |
            anything + ">" + anything |
            anything + "+" + anything |
            anything + "-" + anything |
            anything + "*" + anything |
            anything + "/" + anything |
            variablePiece
            native |
            create 
            
variablePiece= anything + "." + variable |variable
variable = word

create = createVariables | createVars | createConstruct | createBare 
createBare = "create" + variable
createConstruct = createBare + "(" + (anything , ",").. + ")" 
createVars= createConstruct + createVariables
createVariables= "{" + (variable + "="+ anything , ",").. + "}"

native = number | string | bool 
*/