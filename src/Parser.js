class Parser {
    constructor(source, grammar) {
        this.source = source
        this.grammar = grammar
    }
}

class Context {
    constructor(parent) {
        if (parent == null)
            this.index = 0
        else
            this.index = parent.index

        this.result = null
    }

    accept(child) {
        this.index = child.index
        this.result = child.result
    }
}

module.exports.default = Parser