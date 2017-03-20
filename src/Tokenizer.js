const red   = '\u001b[31m'
const endColor = '\u001b[0m'

class Tokenizer {
    constructor(tokenClasses) {
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
                    if(tc.type !== undefined && tc.type !== null) {
                        let token = new Token(tc.type, index, result[0])
                        if(tc.callback !== undefined)
                            token.value = tc.callback(token)
                        tokens.push(token)
                    }
                    index = tc.regex.lastIndex
                    if (index >= source.length)
                       return tokens
                    break
                } else {
                    rejects++
                    if(rejects >= this.tokenClasses.length) {
                        console.log(red, '\n\nUnexpected symbol ' + source[index] + ' at ' + index + '\n\n', endColor)
                        return null
                    }
                }
            }
        }
    }
}

class TokenClass {
    constructor(regex, type, callback) {
        this.regex = regex
        this.type = type
        this.callback = callback
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