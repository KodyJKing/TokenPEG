let Rules = require('./Rules.js')
let $Tokenizer = require('./Tokenizer.js')
let Parser = require('./Parser.js').default
var Sequence = Rules.Sequence
var Repeat = Rules.Repeat
var Choice = Rules.Choice
var TokenRule = Rules.TokenRule
var Any = Rules.Any
var Reference = Rules.Reference
var Action = Rules.Action
var Not = Rules.Not
var Tokenizer = $Tokenizer.Tokenizer
var TokenClass = $Tokenizer.TokenClass
var Token = $Tokenizer.Token
module.exports.default = new Parser({
    main : new Action(new Sequence(new Reference("object"), new Reference("endOfInput")), (result) => {return result[0]}),
    value : new Choice(new TokenRule("string"), new TokenRule("number"), new TokenRule("namedValue"), new Reference("array"), new Reference("object")),
    array : new Action(new Sequence(new TokenRule("openArray"), new Repeat(new Reference("value")), new TokenRule("closeArray")), (result) => {return result[1]}),
    object : new Action(new Sequence(new TokenRule("openObject"), new Repeat(new Reference("mapping")), new TokenRule("closeObject")), (result) => {result = result[1]
    obj = {}
    for (let i = 0; i < result.length; i++) {
        obj[result[i][0]] = result[i][1]
    }
    return obj}),
    mapping : new Sequence(new TokenRule("string"), new Reference("value")),
    endOfInput : new Not(new Any())
}, new Tokenizer([
    new TokenClass(/\s+|:|,/y, null),
    new TokenClass(/"([^"\\]|\\(["\\/bfnrtu]|u\d{4}))*"/y, "string", (token) => {return JSON.parse(token.text)}),
    new TokenClass(/{/y, "openObject"),
    new TokenClass(/}/y, "closeObject"),
    new TokenClass(/\[/y, "openArray"),
    new TokenClass(/]/y, "closeArray"),
    new TokenClass(/-?(0|[1-9])\d*([.]\d*)?((e|E)([+]|[-])?\d*)?/y, "number", (token) => {return JSON.parse(token.text)}),
    new TokenClass(/true|false|null/y, "namedValue", (token) => {return JSON.parse(token.text)})
]))

