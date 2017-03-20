let assert = require('assert')

let Parser = require('./Parser.js').default
let Rules = require('./Rules.js')
let $Tokenizer = require('./Tokenizer.js')

for (let name in $Tokenizer)
    eval("var " + name + " = $Tokenizer." + name)

function BuildTokenizer(...args) {
    let tcs = []
    for(let i = 0; i < args.length - 1; i += 2)
        tcs.push(new TokenClass(args[i], args[i + 1]))
    return new Tokenizer(...tcs)
}

let jsonTokenizer = BuildTokenizer(
    /\s+|:|,/y, null,
    /"([^"\\]|\\(["\\/bfnrtu]|u\d{4}))*"/y, 'string',
    /{/y, 'open_object',
    /}/y, 'close_object',
    /\[/y, 'open_array',
    /]/y, 'close_array',
    /-?(0|[1-9])\d*([.]\d*)?((e|E)([+]|[-])?\d*)?/y , 'number',
    /true|false|null/y, 'value_keyword',
    /[^]/y, 'unexpected'
)

let jsonTokens = jsonTokenizer.tokenize('{"name":"Vizzini", "employees":["Inigo Montoya", "Fezzik"], "occupation":"criminal mastermind", "heightInFeet":5, "male":true, "weakness":"rhyming"}')
for (let token of jsonTokens)
    assert(token.type != 'unexpected', JSON.stringify(token))


function testRule(rule, parser, pass = true) {

}