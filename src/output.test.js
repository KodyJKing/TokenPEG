let parser = require('./output.js').default
let fs = require('fs')
let source = fs.readFileSync('src/large.json', { encoding: 'utf8' })
console.log('\n\n')

console.log('Running TokenPeg test.')
let time = new Date().getTime()
parser.parse(source)
let tp = parser.result
time = new Date().getTime() - time
console.log('Done in ' + time / 1000 + 's.\n' )

console.log('Running JSON.parse test.')
time = new Date().getTime()
let jp = JSON.parse(source)
time = new Date().getTime() - time
console.log('Done in ' + time / 1000 + 's.\n' )

console.log((JSON.stringify(tp) === JSON.stringify(tp) ? 'passed' : 'failed') + '\n')