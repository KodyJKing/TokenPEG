let assert = require('assert')

let Parser = require('./Parser.js').default
let Rules = require('./Rules.js')
let $Tokenizer = require('./Tokenizer.js')

for (let name in $Tokenizer)
    eval("var " + name + " = $Tokenizer." + name)

for (let name in Rules)
    eval("var " + name + " = Rules." + name)

let jsonParser = new Parser(
    {value: new Choice(
        new TokenRule('string'), 
        new TokenRule('number'),
        new TokenRule('value_keyword'),
        new Reference('array'),
        new Reference('object')),
    array: new Action(
        new Sequence(
            new TokenRule('open_array'),
            new Repeat(new Reference('value')),
            new TokenRule('close_array')),
        (result) => result[1]),
    object: new Action(
        new Sequence(
            new TokenRule('open_object'),
            new Repeat( 
                new Sequence(
                    new TokenRule('string'),
                    new Reference('value'))
            ),
            new TokenRule('close_object')),
            function(result) {
                result = result[1]
                obj = {}
                for (let i = 0; i < result.length; i++) {
                    obj[result[i][0]] = result[i][1]
                }
                return obj
            })},
    new Tokenizer([
        new TokenClass(/\s+|:|,/y),
        new TokenClass(/"([^"\\]|\\(["\\/bfnrtu]|u\d{4}))*"/y, 'string', (token) => JSON.parse(token.text)),
        new TokenClass(/{/y, 'open_object'),
        new TokenClass(/}/y, 'close_object'),
        new TokenClass(/\[/y, 'open_array'),
        new TokenClass(/]/y, 'close_array'),
        new TokenClass(/-?(0|[1-9])\d*([.]\d*)?((e|E)([+]|[-])?\d*)?/y , 'number', (token) => Number(token.text)),
        new TokenClass(/true|false|null/y, 'value_keyword')]))

let result = jsonParser.parse(
    '{ "name": "Vizzini", "employees": [ "Fezzik", "Innigo Montoya" ], "race": "Sicilian", "height": 5.16, "occupation": "criminal mastermind"}',
     new Reference('value'))
console.log(result)