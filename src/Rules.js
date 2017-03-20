class Sequence {
    constructor(...rules) {
        this.rules = rules
    }

    parse(context) {
        let innerContext = context.clone()
        let results = []

        for (let rule of this.rules) {
            if (!rule.parse(innerContext))
                return false
            results.push(innerContext.result)
        }

        innerContext.result = results
        context.setFrom(innerContext)
        return true
    }

    toString() {
        return '(' + this.rules.map((rule) => rule.toString()).join(' ') + ')'
    }
}

class Repeat {
        constructor(rule, min = 0, max = Infinity) {
        this.rule = rule
        this.min = min
        this.max = max
    }

    parse(context) {
        let innerContext = context.clone()
        let matches = 0
        let results = []

        while (true) {
            if(!this.rule.parse(innerContext))
                break
            results.push(innerContext.result)
            matches++
            if (matches >= this.max)
                break
        }

        if(matches < this.min)
            return false

        innerContext.result = results
        context.setFrom(innerContext)
        return true
    }

    toString() {
        return '(' + this.rule.toString() + '{' + this.min + ',' + this.max + '})'
    }
}

class Choice {
    constructor(...rules) {
        this.rules = rules
    }

    parse(context) {
        for (let rule of this.rules) {
            if (rule.parse(context))
                return true
        }
        return false
    }

    toString() {
        return '(' + this.rules.map((rule) => rule.toString()).join(' / ') + ')'
    }
}

class TokenRule {
    constructor(type) {
        this.type = type
    }

    parse(context) {
        if(context.index >= context.parser.tokens.length)
            return false
        let token = context.parser.tokens[context.index]
        if(token.type != this.type)
            return false
        context.index++
        context.result = token.value || token.text
        return true
    }

    toString() {
        return this.type
    }
}

class Any {
    parse(context) {
        if(context.index >= context.parser.tokens.length)
            return false
        context.index++
        context.result = context.parser.tokens[context.index]
        return true
    }

    toString() {
        return 'ANY'
    }
}

class Reference {
    constructor(ruleName) {
        this.ruleName = ruleName
    }

    parse(context) {
        return context.parser.grammar[this.ruleName].parse(context)
    }

    toString() {
        return this.ruleName
    }
}

class Action {
    constructor(rule, func) {
        this.rule = rule
        this.func = func
    }

    parse(context) {
        let pass = this.rule.parse(context)
        if (pass)
            context.result = this.func(context.result)
        return pass
    }

    toString() {
        return 'ACTION(' + this.rule.toString() + ')'
    }
}

module.exports = {
    Sequence: Sequence,
    Repeat: Repeat,
    Choice: Choice,
    TokenRule: TokenRule,
    Any: Any,
    Reference: Reference,
    Action: Action
}