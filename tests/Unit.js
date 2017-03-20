let assert = require('assert')

let Parser = require('../src/Parser.js').default
let Rules = require('../src/Rules.js')
let $Tokenizer = require('../src/Tokenizer.js')

for (let name in $Tokenizer)
    eval("var " + name + " = $Tokenizer." + name)

for (let name in Rules)
    eval("var " + name + " = Rules." + name)

const red   = '\u001b[31m'
const blue  = '\u001b[36m'
const green = '\u001b[32m'
const endColor = '\u001b[0m'

function testRule(parser, rule, source, pass = true) {
    try {
        let result = parser.parse(source, rule)
        if (!pass) {
            console.log(red, rule.toString(), endColor)
            console.log(red, "Should have failed but passed!", endColor)
            console.log(red, JSON.stringify(result), endColor)
        }
    } catch(e) {
        if (pass) {
            console.log(red, rule.toString(), endColor)
            throw new Error("Should have passed but failed!")
        }
    }
}

parser = new Parser({}, new Tokenizer([
    new TokenClass(/\s+/y),
    new TokenClass(/[a-zA-Z]+/y, 'word'),
    new TokenClass(/\d+/y, 'number')]
))

test = new Choice(
    new Sequence( new TokenRule('word'), new TokenRule('word') ),
    new Sequence( new TokenRule('word'), new TokenRule('number') )
)

testRule(parser, test, "foo 100")