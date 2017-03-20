class Tokenizer {
    constructor(...tokenClasses) {
        this.tokenClasses = tokenClasses
    }

    tokenize(source) {
        let index = 0
        let tokens = []
        let rejects = 0
        while (true) {
            for(let tc of this.tokenClasses) {
                tc.regex.lastIndex = index
                let result = tc.regex.exec(source)
                if (result !== null) {
                    rejects = 0
                    if(tc.type != null)
                        tokens.push(new Token(tc.type, index, result[0]))
                    index = tc.regex.lastIndex
                    if (index >= source.length)
                       return tokens
                    break
                } else {
                    rejects++
                    if(rejects >= this.tokenClasses.length)
                       return null
                }
            }
        }
    }
}

class TokenClass {
    constructor(regex, type) {
        this.regex = regex
        this.type = type
    }
}

class Token {
    constructor(type, index, text) {
        this.type = type
        this.index = index
        this.text = text
    }
}

module.exports = {
    Tokenizer: Tokenizer,
    TokenClass: TokenClass,
    Token: Token
}