let Parser = require('../src/Parser.js').default
let Rules = require('../src/Rules.js')
let $Tokenizer = require('../src/Tokenizer.js')

for (let name in $Tokenizer)
    eval("var " + name + " = $Tokenizer." + name)

for (let name in Rules)
    eval("var " + name + " = Rules." + name)

let jsonParser = new Parser({
    main: new Action(
        new Sequence(
            new Reference('object'),
            new Reference('endOfInput')),
            (result) => result[0]),
    value: new Choice(
        new TokenRule('string'), 
        new TokenRule('number'),
        new TokenRule('value_keyword'),
        new Reference('array'),
        new Reference('object')),
    array: new Action(
        new Sequence(
            new TokenRule('['),
            new Repeat(new Reference('value')),
            new TokenRule(']')),
        (result) => result[1]),
    object: new Action(
        new Sequence(
            new TokenRule('{'),
            new Repeat( 
                new Sequence(
                    new TokenRule('string'),
                    new Reference('value')).setDisplay('mapping')
            ),
            new TokenRule('}')),
            function(result) {
                result = result[1]
                obj = {}
                for (let i = 0; i < result.length; i++) {
                    obj[result[i][0]] = result[i][1]
                }
                return obj
            }),
    endOfInput: new Not(new Any())},
    new Tokenizer([
        new TokenClass(/\s+|:|,/y), //Whitespace and delimiters.
        new TokenClass(/"([^"\\]|\\(["\\/bfnrtu]|u\d{4}))*"/y, 'string', (token) => JSON.parse(token.text)),
        new TokenClass(/{/y, '{'),
        new TokenClass(/}/y, '}'),
        new TokenClass(/\[/y, '['),
        new TokenClass(/]/y, ']'),
        new TokenClass(/-?(0|[1-9])\d*([.]\d*)?((e|E)([+]|[-])?\d*)?/y , 'number', (token) => Number(token.text)),
        new TokenClass(/true|false|null/y, 'value_keyword')])
)

let pass = jsonParser.parse(
    '{"name": "Vizzini", "employees": [ "Fezzik", "Inigo Montoya" ], "race": "Sicilian", "height": 5.16, "occupation": "criminal mastermind"}')
console.log(jsonParser.result)