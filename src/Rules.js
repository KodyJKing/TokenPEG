class Rule {
    parse(context) {
        if (!context.parser.debug)
            return this.$parse(context)
        let parser = context.parser
        parser.pushRule(this)
        let pass = this.$parse(context)
        parser.popRule(this)
        if (!pass)
            parser.pushError(parser.ruleStack.join(' > ') + ' > ' + this.toString(), context.index)
        return pass
    }

    toString() {
        return this.displayName || (this.$toString ? this.$toString() : this.constructor.name)
    }

    setDisplay(name) {
        this.displayName = name
        return this
    }
}

class Sequence extends Rule {
    constructor(...rules) {
        super()
        this.rules = rules
    }

    $parse(context) {
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

    $toString() {
        return '(' + this.rules.map((rule) => rule.toString()).join(' ') + ')'
    }
}

class Repeat extends Rule {
    constructor(rule, min = 0, max = Infinity) {
        super()
        this.rule = rule
        this.min = min
        this.max = max
    }

    $parse(context) {
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

    $toString() {
        return '(' + this.rule.toString() + this.suffix() + ')'
    }

    suffix() {
        return this.min == 0 && this.max == Infinity ?
         "*" : (this.min == 1 && this.max == Infinity ?
          "+" : '{' + this.min + ',' + this.max + '}')
    }
}

class Choice extends Rule {
    constructor(...rules) {
        super()
        this.rules = rules
    }

    $parse(context) {
        for (let rule of this.rules) {
            if (rule.parse(context))
                return true
        }
        return false
    }

    $toString() {
        return '(' + this.rules.map((rule) => rule.toString()).join(' / ') + ')'
    }
}

class TokenRule extends Rule {
    constructor(type) {
        super()
        this.type = type
    }

    $parse(context) {
        if(context.index >= context.parser.tokens.length)
            return false
        let token = context.parser.tokens[context.index]
        if(token.type != this.type)
            return false
        context.index++
        context.result = token.value === undefined ? token.text : token.value
        return true
    }

    $toString() {
        return this.type
    }
}

class Any extends Rule {
    $parse(context) {
        if(context.index >= context.parser.tokens.length)
            return false
        context.index++
        context.result = context.parser.tokens[context.index]
        return true
    }

    $toString() {
        return 'ANY'
    }
}

class Reference extends Rule {
    constructor(ruleName) {
        super()
        this.ruleName = ruleName
    }

    $parse(context) {
        return context.parser.grammar[this.ruleName].parse(context)
    }

    $toString() {
        return this.ruleName
    }
}

class Action extends Rule {
    constructor(rule, func) {
        super()
        this.rule = rule
        this.func = func
    }

    $parse(context) {
        let pass = this.rule.parse(context)
        if (pass)
            context.result = this.func(context.result)
        return pass
    }

    $toString() {
        return 'ACTION(' + this.rule.toString() + ')'
    }

    setDisplay(name) {
        this.rule.setDisplay(name + 'Body')
        return this
    }
}

class Not extends Rule {
    constructor(rule) {
        super()
        this.rule = rule
    }

    $parse(context) {
        let pass = this.rule.parse(context)
        if (pass)
            context.unexpected = context.unexpected
        return !pass
    }

    $toString() {
        return '(!' + this.rule.toString() + ')'
    }
}

module.exports = {
    Sequence: Sequence,
    Repeat: Repeat,
    Choice: Choice,
    TokenRule: TokenRule,
    Any: Any,
    Reference: Reference,
    Action: Action,
    Not: Not
}