class Parser {
    constructor(grammar = {}, tokenizer) {
        this.grammar = grammar
        this.tokenizer = tokenizer
    }

    parse(source, rule) {
        this.source = source
        this.tokens = this.tokenizer.tokenize(source)
        let root = new Context(0, this)
        let pass = rule.parse(root)
        if(!pass)
            throw new Error("Could not parse!")
        return root.result
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