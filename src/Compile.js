let Rules = require('./Rules.js')
let $Tokenizer = require('./Tokenizer.js')

let compiler = require('./Compiler.js')
let fs = require('fs')

let source = fs.readFileSync('src/input.pegex', { encoding: 'utf8' })
let text = [
    "let Rules = require('./Rules.js')",
    "let $Tokenizer = require('./Tokenizer.js')",
    "let Parser = require('./Parser.js').default"]
for(let key in Rules)
    text.push("var " + key + " = Rules." + key)
for(let key in $Tokenizer)
    text.push("var " + key + " = $Tokenizer." + key)
text.push(compiler.parse(source))
text.push('\n')
let js = text.join('\n')
fs.writeFileSync('src/output.js', js)
