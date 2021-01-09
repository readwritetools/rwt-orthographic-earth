/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
export default function cssParser(e) {
    for (var t, r = 'top-level', n = -1, a = new Stylesheet, o = [ a ], u = o[0], consume = function(r) {
        return void 0 === r && (r = 1), t = (n += r) < e.length ? e[n] : new EOFToken, !0;
    }, reprocess = function() {
        return n--, !0;
    }, next = function() {
        return e[n + 1];
    }, switchto = function(e) {
        return void 0 === e ? '' !== u.fillType ? r = u.fillType : 'STYLESHEET' == u.type ? r = 'top-level' : (console.log('Unknown rule-type while switching to current rule\'s content mode: ', u), 
        r = '') : r = e, !0;
    }, push = function(e) {
        return u = e, o.push(u), !0;
    }, parseerror = function(e) {
        return console.log('Parse error at token ' + n + ': ' + t + '.\n' + e), !0;
    }, pop = function() {
        var e = o.pop();
        return (u = o[o.length - 1]).append(e), !0;
    }, discard = function() {
        return o.pop(), u = o[o.length - 1], !0;
    }, finish = function() {
        for (;o.length > 1; ) pop();
    }; ;) switch (consume(), r) {
      case 'top-level':
        switch (t.tokenType) {
          case 'CDO':
          case 'CDC':
          case 'WHITESPACE':
            break;

          case 'AT-KEYWORD':
            push(new AtRule(t.value)) && switchto('at-rule');
            break;

          case '{':
            parseerror('Attempt to open a curly-block at top-level.') && consumeAPrimitive();
            break;

          case 'EOF':
            return finish(), a;

          default:
            push(new StyleRule) && switchto('selector') && reprocess();
        }
        break;

      case 'at-rule':
        switch (t.tokenType) {
          case ';':
            pop() && switchto();
            break;

          case '{':
            '' !== u.fillType ? switchto(u.fillType) : parseerror('Attempt to open a curly-block in a statement-type at-rule.') && discard() && switchto('next-block') && reprocess();
            break;

          case 'EOF':
            return finish(), a;

          default:
            u.appendPrelude(consumeAPrimitive());
        }
        break;

      case 'rule':
        switch (t.tokenType) {
          case 'WHITESPACE':
            break;

          case '}':
            pop() && switchto();
            break;

          case 'AT-KEYWORD':
            push(new AtRule(t.value)) && switchto('at-rule');
            break;

          case 'EOF':
            return finish(), a;

          default:
            push(new StyleRule) && switchto('selector') && reprocess();
        }
        break;

      case 'selector':
        switch (t.tokenType) {
          case '{':
            switchto('declaration');
            break;

          case 'EOF':
            return discard() && finish(), a;

          default:
            u.appendSelector(consumeAPrimitive());
        }
        break;

      case 'declaration':
        switch (t.tokenType) {
          case 'WHITESPACE':
          case ';':
            break;

          case '}':
            pop() && switchto();
            break;

          case 'AT-RULE':
            push(new AtRule(t.value)) && switchto('at-rule');
            break;

          case 'IDENT':
            push(new Declaration(t.value)) && switchto('after-declaration-name');
            break;

          case 'EOF':
            return finish(), a;

          default:
            parseerror() && discard() && switchto('next-declaration');
        }
        break;

      case 'after-declaration-name':
        switch (t.tokenType) {
          case 'WHITESPACE':
            break;

          case ':':
            switchto('declaration-value');
            break;

          case ';':
            parseerror('Incomplete declaration - semicolon after property name.') && discard() && switchto();
            break;

          case 'EOF':
            return discard() && finish(), a;

          default:
            parseerror('Invalid declaration - additional token after property name') && discard() && switchto('next-declaration');
        }
        break;

      case 'declaration-value':
        switch (t.tokenType) {
          case 'DELIM':
            '!' == t.value && 'IDENTIFIER' == next().tokenType && 'important' == next().value.toLowerCase() ? (consume(), 
            u.important = !0, switchto('declaration-end')) : u.append(t);
            break;

          case ';':
            pop() && switchto();
            break;

          case '}':
            pop() && pop() && switchto();
            break;

          case 'EOF':
            return finish(), a;

          default:
            u.append(consumeAPrimitive());
        }
        break;

      case 'declaration-end':
        switch (t.tokenType) {
          case 'WHITESPACE':
            break;

          case ';':
            pop() && switchto();
            break;

          case '}':
            pop() && pop() && switchto();
            break;

          case 'EOF':
            return finish(), a;

          default:
            parseerror('Invalid declaration - additional token after !important.') && discard() && switchto('next-declaration');
        }
        break;

      case 'next-block':
        switch (t.tokenType) {
          case '{':
            consumeAPrimitive() && switchto();
            break;

          case 'EOF':
            return finish(), a;

          default:
            consumeAPrimitive();
        }
        break;

      case 'next-declaration':
        switch (t.tokenType) {
          case ';':
            switchto('declaration');
            break;

          case '}':
            switchto('declaration') && reprocess();
            break;

          case 'EOF':
            return finish(), a;

          default:
            consumeAPrimitive();
        }
        break;

      default:
        return void console.log('Unknown parsing mode: ' + r);
    }
    function consumeAPrimitive() {
        switch (t.tokenType) {
          case '(':
          case '[':
          case '{':
            return function consumeASimpleBlock() {
                for (var e = {
                    '(': ')',
                    '[': ']',
                    '{': '}'
                }[t.tokenType], r = new SimpleBlock(t.tokenType); ;) switch (consume(), t.tokenType) {
                  case 'EOF':
                  case e:
                    return r;

                  default:
                    r.append(consumeAPrimitive());
                }
            }();

          case 'FUNCTION':
            return function consumeAFunc() {
                for (var e = new Func(t.value), r = new FuncArg; ;) switch (consume(), t.tokenType) {
                  case 'EOF':
                  case ')':
                    return e.append(r), e;

                  case 'DELIM':
                    ',' == t.value ? (e.append(r), r = new FuncArg) : r.append(t);
                    break;

                  default:
                    r.append(consumeAPrimitive());
                }
            }();

          default:
            return t;
        }
    }
}

function CSSParserRule() {
    return this;
}

function Stylesheet() {
    return this.value = [], this;
}

function AtRule(e) {
    return this.name = e, this.prelude = [], this.value = [], e in AtRule.registry && (this.fillType = AtRule.registry[e]), 
    this;
}

function StyleRule() {
    return this.selector = [], this.value = [], this;
}

function Declaration(e) {
    return this.name = e, this.value = [], this;
}

function SimpleBlock(e) {
    return this.name = e, this.value = [], this;
}

function Func(e) {
    return this.name = e, this.value = [], this;
}

function FuncArg() {
    return this.value = [], this;
}

CSSParserRule.prototype.fillType = '', CSSParserRule.prototype.toString = function(e) {
    return JSON.stringify(this.toJSON(), null, e);
}, CSSParserRule.prototype.append = function(e) {
    return this.value.push(e), this;
}, Stylesheet.prototype = new CSSParserRule, Stylesheet.prototype.type = 'STYLESHEET', 
Stylesheet.prototype.toJSON = function() {
    return {
        type: 'stylesheet',
        value: this.value.map((function(e) {
            return e.toJSON();
        }))
    };
}, AtRule.prototype = new CSSParserRule, AtRule.prototype.type = 'AT-RULE', AtRule.prototype.appendPrelude = function(e) {
    return this.prelude.push(e), this;
}, AtRule.prototype.toJSON = function() {
    return {
        type: 'at',
        name: this.name,
        prelude: this.prelude.map((function(e) {
            return e.toJSON();
        })),
        value: this.value.map((function(e) {
            return e.toJSON();
        }))
    };
}, AtRule.registry = {
    import: '',
    media: 'rule',
    'font-face': 'declaration',
    page: 'declaration',
    keyframes: 'rule',
    namespace: '',
    'counter-style': 'declaration',
    supports: 'rule',
    document: 'rule',
    'font-feature-values': 'declaration',
    viewport: '',
    'region-style': 'rule'
}, StyleRule.prototype = new CSSParserRule, StyleRule.prototype.type = 'STYLE-RULE', 
StyleRule.prototype.fillType = 'declaration', StyleRule.prototype.appendSelector = function(e) {
    return this.selector.push(e), this;
}, StyleRule.prototype.toJSON = function() {
    return {
        type: 'selector',
        selector: this.selector.map((function(e) {
            return e.toJSON();
        })),
        value: this.value.map((function(e) {
            return e.toJSON();
        }))
    };
}, Declaration.prototype = new CSSParserRule, Declaration.prototype.type = 'DECLARATION', 
Declaration.prototype.toJSON = function() {
    return {
        type: 'declaration',
        name: this.name,
        value: this.value.map((function(e) {
            return e.toJSON();
        }))
    };
}, SimpleBlock.prototype = new CSSParserRule, SimpleBlock.prototype.type = 'BLOCK', 
SimpleBlock.prototype.toJSON = function() {
    return {
        type: 'block',
        name: this.name,
        value: this.value.map((function(e) {
            return e.toJSON();
        }))
    };
}, Func.prototype = new CSSParserRule, Func.prototype.type = 'FUNCTION', Func.prototype.toJSON = function() {
    return {
        type: 'func',
        name: this.name,
        value: this.value.map((function(e) {
            return e.toJSON();
        }))
    };
}, FuncArg.prototype = new CSSParserRule, FuncArg.prototype.type = 'FUNCTION-ARG', 
FuncArg.prototype.toJSON = function() {
    return this.value.map((function(e) {
        return e.toJSON();
    }));
};