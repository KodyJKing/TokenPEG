class Rule {
    constructor() {
        this.className = this.constructor.name
    }

    toString() {
        return this.displayName || 
        (this.$toString !== undefined ? this.$toString() : this.className)
    }

    setDisplay(displayName) {
        this.displayName = displayName
        return this
    }
}

class Literal extends Rule {
    constructor(text) {
        super()
        this.text = text
    }

    parse(parser) {
        for (let char of this.text) {
            if (char != parser.consume())
                return false
        }

        parser.setResult(this.text)
        return true
    }

    $toString() {
        return '"' + this.text + '"'
    }
}

class Sequence extends Rule {
    constructor(...rules) {
        super()
        this.rules = rules
    }

    parse(parser) {
        parser.pushContext()
        let results = []
        for (let rule of this.rules) {
            if (!parser.parse(rule)) {
                parser.popContext()
                return false
            } else {
                results.push(parser.result())
            }
        }
        parser.popContext()
        parser.setResult(results)
        return true
    }

    $toString() {
        return '(' + this.rules.map((rule) => rule.toString()).join(' ') + ')'
    }
}

class Choice extends Rule {
    constructor(...rules) {
        super()
        this.rules = rules
    }

    parse(parser) {
        for (let rule of this.rules) {
            if (parser.parse(rule))
                return true
        }
        return false
    }

    $toString() {
        return '(' + this.rules.map((rule) => rule.toString()).join(' / ') + ')'
    }
}

module.exports = {
    Literal: Literal,
    Sequence: Sequence,
    Choice: Choice
}