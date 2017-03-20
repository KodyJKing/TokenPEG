let parser = require('./output.js').default
let fs = require('fs')
let source = fs.readFileSync('src/input.json', { encoding: 'utf8' })
let time = new Date().getTime()
parser.parse(source)
time = new Date().getTime() - time
console.log(parser.result)
console.log('Done in ' + time / 1000 + 's.' )