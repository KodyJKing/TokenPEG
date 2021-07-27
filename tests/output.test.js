let parser = require('../src/output.js').default
let fs = require('fs')
let source = fs.readFileSync('tests/small.json', { encoding: 'utf8' })
console.log('\n\n')

console.log('Running TokenPeg test.')
let time = new Date().getTime()
parser.parse(source)
let tp = parser.result
time = new Date().getTime() - time
console.log('Done in ' + time + 'ms.\n' )

console.log('Running JSON.parse test.')
time = new Date().getTime()
let jp = JSON.parse(source)
time = new Date().getTime() - time
console.log('Done in ' + time + 'ms.\n' )

console.log((JSON.stringify(tp) === JSON.stringify(tp) ? 'passed' : 'failed') + '\n')