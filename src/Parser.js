const red   = '\u001b[31m'
const endColor = '\u001b[0m'

class Parser {
    constructor(grammar = {}, tokenizer, debug = false) {
        for (let key in grammar) {
            grammar[key].setDisplay(key)
        }
        this.grammar = grammar
        this.tokenizer = tokenizer
        this.debug = debug
    }

    parse(source) {
        let rule = this.grammar['main']
        this.source = source
        this.tokens = this.tokenizer.tokenize(source)
        if (this.tokens == null)
            return false
        let root = new Context(0, this)
        let pass = rule.parse(root)
        if (!pass) {
            this.debug = true
            this.errors = []
            this.maxError = 0 
            this.ruleStack = []
            root = new Context(0, this)
            pass = rule.parse(root)
            if (!pass)
                this.printErrors()
        }
        this.result = root.result
        return pass
    }

    pushRule(rule) {
        this.ruleStack.push(rule)
    }

    popRule(rule) {
        this.ruleStack.pop()
    }

    pushError(rule, index) {
        if (index > this.maxError) {
            this.maxError = index
            this.errors = []
        }

        if (index >= this.maxError)
            this.errors.push(rule)
    }

    printErrors() {
        let token = this.tokens[this.maxError]
        console.log( 
            red,
            '\n\nExpected\n\n'
            + this.errors.join('\n')
            + '\n\nat ' + token.index
            + ' but found ' + token.type + ':"' + token.text + '"\n\n',
            endColor)
    }
}

class Context {
    constructor(index, parser) {
        this.index = index
        this.parser = parser
    }

    clone(parent) {
        return new Context(this.index, this.parser)
    }

    setFrom(child) {
        this.index = child.index
        this.result = child.result
    }
}

module.exports.default = Parser