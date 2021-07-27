start = parser

ws = (' ' / '	' / '\n' / '\r')*

colon = ws ':' ws
lcurl = ws '{' ws
rcurl = ws '}' ws
lbrac = ws '[' ws
rbrac = ws ']' ws
lpar = ws '(' ws
rpar = ws ')' ws
star = ws '*' ws
plus = ws '+' ws
or = ws '/' ws
eq = ws '=' ws
dot = ws '.' ws
exclamation = ws '!' ws
question = ws '?' ws
dollar = ws '$' ws
and = ws '&' ws

primitive = reference / tokenref / parenthesis / predicate / any
identifier = ws k: $([a-z] / [A-Z])+ ws {return k}
tokenIdentifier = ws '@' k: identifier? {return k}
reference = k: identifier !eq {return "new Reference(" + JSON.stringify(k) + ")"}
tokenref =  k: tokenIdentifier !eq {return "new TokenRule(" + JSON.stringify(k) + ")"}
doublequote = '"' k: $(!'"' .)* '"' {return k}
singlequote = "'" k: $(!"'" .)* "'" {return k}
parenthesis = lpar k: expression rpar {return "new Choice(" + k + ")"}
any = dot {return "new Any()"}
regex = ws k: $(slash regexany* slash) ws {return k + 'y'}
predicate = and js: jsblock {return "new Predicate((values, state) => {" + js + "})"}

unary = not / optional / stringValue
not = exclamation k: primitive {return "new Not(" + k + ")"}
optional = k: primitive question {return "new Optional("  + k + ")"}
stringValue = dollar k: primitive {return "new StringValue("  + k + ")"}
unaryOrLess = unary / primitive

repeat = k: unaryOrLess star {return "new Repeat(" + k + ")"}
repeatOne = k: unaryOrLess plus {return "new Repeat(" + k + ", 1)"}
repeatOrLess = repeat / repeatOne / unaryOrLess

choice = head: repeatOrLess tail: (or k: repeatOrLess {return k})+ 
{return "new Choice(" + [head].concat(tail).join(", ") + ")"}
choiceOrLess = choice / repeatOrLess

sequence = head: choiceOrLess tail: (ws k: choiceOrLess {return k})+
{return "new Sequence(" + [head].concat(tail).join(", ") + ")"}
sequenceOrLess = sequence / choiceOrLess

action = k: sequenceOrLess js: jsblock {return "new Action(" + k + ", (result, state) => {" + js + "})"}
actionOrLess =  action / sequenceOrLess

expression = actionOrLess

rule = lval: identifier eq rval: expression {return lval + " : " + rval}
token = lval: tokenIdentifier eq rval: regex js:jsblock? {return "new TokenClass(" + rval + ", " + JSON.stringify(lval) + (js != null ? (", (token) => {" + js + "}") : "") + ")"}
grammar = k: (k: rule {return k})* {return "{\n    " + k.join(",\n    ") + "\n}"}
tokenizer = k: (k: token {return k})* {return "new Tokenizer([\n    " + k.join(",\n    ") + "\n])"}
parser = g: grammar t: tokenizer {return "module.exports.default = new Parser(" + g + ", " + t + ")"}

jsany = comment / string / regex / jsblock / .
string = ws k: (doublequote / singlequote) ws
slash = '/'
backslash = '\\'
regexany = (backslash backslash slash) / (!slash .)
comment = '//' (!'\n' .)* '\n'?
nonbrac = !rcurl jsany
jsblock = lcurl js: $nonbrac* rcurl {return js}