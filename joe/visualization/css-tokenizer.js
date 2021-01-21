/* The code in this file (c) 2103, Tab Atkins, Jr. http://www.xanthir.com/blog/b4Ju0. It is licensed under the CC0 license. */
var between = function(e, n, t) {
    return e >= n && e <= t;
};

function digit(e) {
    return between(e, 48, 57);
}

function hexdigit(e) {
    return digit(e) || between(e, 65, 70) || between(e, 97, 102);
}

function uppercaseletter(e) {
    return between(e, 65, 90);
}

function lowercaseletter(e) {
    return between(e, 97, 122);
}

function letter(e) {
    return uppercaseletter(e) || lowercaseletter(e);
}

function nonascii(e) {
    return e >= 160;
}

function namestartchar(e) {
    return letter(e) || nonascii(e) || 95 == e;
}

function namechar(e) {
    return namestartchar(e) || digit(e) || 45 == e;
}

function nonprintable(e) {
    return between(e, 0, 8) || between(e, 14, 31) || between(e, 127, 159);
}

function newline(e) {
    return 10 == e || 13 == e;
}

function whitespace(e) {
    return newline(e) || 9 == e || 32 == e;
}

function badescape(e) {
    return newline(e) || isNaN(e);
}

var maximumallowedcodepoint = 1114111;

export default function cssTokenizer(e, n) {
    null == n && (n = {
        transformFunctionWhitespace: !1,
        scientificNotation: !1
    });
    for (var t, o, r = -1, i = [], a = 'data', s = 0, p = 0, u = 0, d = {
        line: s,
        column: p
    }, next = function(n) {
        return void 0 === n && (n = 1), e.charCodeAt(r + n);
    }, consume = function(n) {
        return void 0 === n && (n = 1), r += n, newline(t = e.charCodeAt(r)) ? (s += 1, 
        u = p, p = 0) : p += n, !0;
    }, reconsume = function() {
        return r -= 1, newline(t) ? (s -= 1, p = u) : p -= 1, d.line = s, d.column = p, 
        !0;
    }, eof = function() {
        return r >= e.length;
    }, emit = function(e) {
        return e ? e.finish() : e = o.finish(), !0 === n.loc && (e.loc = {}, e.loc.start = {
            line: d.line,
            column: d.column
        }, d = {
            line: s,
            column: p
        }, e.loc.end = d), i.push(e), o = void 0, !0;
    }, create = function(e) {
        return o = e, !0;
    }, parseerror = function() {
        return console.log('Parse error at index ' + r + ', processing codepoint 0x' + t.toString(16) + ' in state ' + a + '.'), 
        !0;
    }, catchfire = function(e) {
        return console.log('MAJOR SPEC ERROR: ' + e), !0;
    }, switchto = function(e) {
        return a = e, !0;
    }, consumeEscape = function() {
        if (consume(), hexdigit(t)) {
            for (var e = [], n = 0; n < 6 && hexdigit(t); n++) e.push(t), consume();
            var o = parseInt(e.map(String.fromCharCode).join(''), 16);
            return o > maximumallowedcodepoint && (o = 65533), whitespace(t) || reconsume(), 
            o;
        }
        return t;
    }; ;) {
        if (r > 2 * e.length) return 'I\'m infinite-looping!';
        switch (consume(), a) {
          case 'data':
            if (whitespace(t)) for (emit(new WhitespaceToken); whitespace(next()); ) consume(); else if (34 == t) switchto('double-quote-string'); else if (35 == t) switchto('hash'); else if (39 == t) switchto('single-quote-string'); else if (40 == t) emit(new OpenParenToken); else if (41 == t) emit(new CloseParenToken); else if (43 == t) digit(next()) || 46 == next() && digit(next(2)) ? switchto('number') && reconsume() : emit(new DelimToken(t)); else if (45 == t) 45 == next(1) && 62 == next(2) ? consume(2) && emit(new CDCToken) : digit(next()) || 46 == next(1) && digit(next(2)) ? switchto('number') && reconsume() : switchto('ident') && reconsume(); else if (46 == t) digit(next()) ? switchto('number') && reconsume() : emit(new DelimToken(t)); else if (47 == t) 42 == next() ? consume() && switchto('comment') : emit(new DelimToken(t)); else if (58 == t) emit(new ColonToken); else if (59 == t) emit(new SemicolonToken); else if (60 == t) 33 == next(1) && 45 == next(2) && 45 == next(3) ? consume(3) && emit(new CDOToken) : emit(new DelimToken(t)); else if (64 == t) switchto('at-keyword'); else if (91 == t) emit(new OpenSquareToken); else if (92 == t) badescape(next()) ? parseerror() && emit(new DelimToken(t)) : switchto('ident') && reconsume(); else if (93 == t) emit(new CloseSquareToken); else if (123 == t) emit(new OpenCurlyToken); else if (125 == t) emit(new CloseCurlyToken); else if (digit(t)) switchto('number') && reconsume(); else if (85 == t || 117 == t) 43 == next(1) && hexdigit(next(2)) ? consume() && switchto('unicode-range') : switchto('ident') && reconsume(); else if (namestartchar(t)) switchto('ident') && reconsume(); else {
                if (eof()) return emit(new EOFToken), i;
                emit(new DelimToken(t));
            }
            break;

          case 'double-quote-string':
            null == o && create(new StringToken), 34 == t ? emit() && switchto('data') : eof() ? parseerror() && emit() && switchto('data') && reconsume() : newline(t) ? parseerror() && emit(new BadStringToken) && switchto('data') && reconsume() : 92 == t ? badescape(next()) ? parseerror() && emit(new BadStringToken) && switchto('data') : newline(next()) ? consume() : o.append(consumeEscape()) : o.append(t);
            break;

          case 'single-quote-string':
            null == o && create(new StringToken), 39 == t ? emit() && switchto('data') : eof() ? parseerror() && emit() && switchto('data') : newline(t) ? parseerror() && emit(new BadStringToken) && switchto('data') && reconsume() : 92 == t ? badescape(next()) ? parseerror() && emit(new BadStringToken) && switchto('data') : newline(next()) ? consume() : o.append(consumeEscape()) : o.append(t);
            break;

          case 'hash':
            namechar(t) ? create(new HashToken(t)) && switchto('hash-rest') : 92 == t ? badescape(next()) ? parseerror() && emit(new DelimToken(35)) && switchto('data') && reconsume() : create(new HashToken(consumeEscape())) && switchto('hash-rest') : emit(new DelimToken(35)) && switchto('data') && reconsume();
            break;

          case 'hash-rest':
            namechar(t) ? o.append(t) : 92 == t ? badescape(next()) ? parseerror() && emit() && switchto('data') && reconsume() : o.append(consumeEscape()) : emit() && switchto('data') && reconsume();
            break;

          case 'comment':
            42 == t ? 47 == next() && consume() && switchto('data') : eof() && parseerror() && switchto('data') && reconsume();
            break;

          case 'at-keyword':
            45 == t ? namestartchar(next()) ? create(new AtKeywordToken(45)) && switchto('at-keyword-rest') : 92 != next(1) || badescape(next(2)) ? parseerror() && emit(new DelimToken(64)) && switchto('data') && reconsume() : create(new AtKeywordtoken(45)) && switchto('at-keyword-rest') : namestartchar(t) ? create(new AtKeywordToken(t)) && switchto('at-keyword-rest') : 92 == t ? badescape(next()) ? parseerror() && emit(new DelimToken(35)) && switchto('data') && reconsume() : create(new AtKeywordToken(consumeEscape())) && switchto('at-keyword-rest') : emit(new DelimToken(64)) && switchto('data') && reconsume();
            break;

          case 'at-keyword-rest':
            namechar(t) ? o.append(t) : 92 == t ? badescape(next()) ? parseerror() && emit() && switchto('data') && reconsume() : o.append(consumeEscape()) : emit() && switchto('data') && reconsume();
            break;

          case 'ident':
            45 == t ? namestartchar(next()) ? create(new IdentifierToken(t)) && switchto('ident-rest') : 92 != next(1) || badescape(next(2)) ? emit(new DelimToken(45)) && switchto('data') : create(new IdentifierToken(t)) && switchto('ident-rest') : namestartchar(t) ? create(new IdentifierToken(t)) && switchto('ident-rest') : 92 == t ? badescape(next()) ? parseerror() && switchto('data') && reconsume() : create(new IdentifierToken(consumeEscape())) && switchto('ident-rest') : catchfire('Hit the generic \'else\' clause in ident state.') && switchto('data') && reconsume();
            break;

          case 'ident-rest':
            namechar(t) ? o.append(t) : 92 == t ? badescape(next()) ? parseerror() && emit() && switchto('data') && reconsume() : o.append(consumeEscape()) : 40 == t ? o.ASCIImatch('url') ? switchto('url') : emit(new FunctionToken(o)) && switchto('data') : whitespace(t) && n.transformFunctionWhitespace ? switchto('transform-function-whitespace') && reconsume() : emit() && switchto('data') && reconsume();
            break;

          case 'transform-function-whitespace':
            whitespace(next()) || (40 == t ? emit(new FunctionToken(o)) && switchto('data') : emit() && switchto('data') && reconsume());
            break;

          case 'number':
            create(new NumberToken), 45 == t ? digit(next()) ? consume() && o.append([ 45, t ]) && switchto('number-rest') : 46 == next(1) && digit(next(2)) ? consume(2) && o.append([ 45, 46, t ]) && switchto('number-fraction') : switchto('data') && reconsume() : 43 == t ? digit(next()) ? consume() && o.append([ 43, t ]) && switchto('number-rest') : 46 == next(1) && digit(next(2)) ? consume(2) && o.append([ 43, 46, t ]) && switchto('number-fraction') : switchto('data') && reconsume() : digit(t) ? o.append(t) && switchto('number-rest') : 46 == t && digit(next()) ? consume() && o.append([ 46, t ]) && switchto('number-fraction') : switchto('data') && reconsume();
            break;

          case 'number-rest':
            digit(t) ? o.append(t) : 46 == t ? digit(next()) ? consume() && o.append([ 46, t ]) && switchto('number-fraction') : emit() && switchto('data') && reconsume() : 37 == t ? emit(new PercentageToken(o)) && switchto('data') : 69 == t || 101 == t ? digit(next()) ? consume() && o.append([ 37, t ]) && switchto('sci-notation') : 43 != next(1) && 45 != next(1) || !digit(next(2)) ? create(new DimensionToken(o, t)) && switchto('dimension') : o.append([ 37, next(1), next(2) ]) && consume(2) && switchto('sci-notation') : 45 == t ? namestartchar(next()) ? consume() && create(new DimensionToken(o, [ 45, t ])) && switchto('dimension') : 92 == next(1) && badescape(next(2)) ? parseerror() && emit() && switchto('data') && reconsume() : 92 == next(1) ? consume() && create(new DimensionToken(o, [ 45, consumeEscape() ])) && switchto('dimension') : emit() && switchto('data') && reconsume() : namestartchar(t) ? create(new DimensionToken(o, t)) && switchto('dimension') : 92 == t ? badescape(next) ? parseerror() && emit() && switchto('data') && reconsume() : create(new DimensionToken(o, consumeEscape)) && switchto('dimension') : emit() && switchto('data') && reconsume();
            break;

          case 'number-fraction':
            o.type = 'number', digit(t) ? o.append(t) : 37 == t ? emit(new PercentageToken(o)) && switchto('data') : 69 == t || 101 == t ? digit(next()) ? consume() && o.append([ 101, t ]) && switchto('sci-notation') : 43 != next(1) && 45 != next(1) || !digit(next(2)) ? create(new DimensionToken(o, t)) && switchto('dimension') : o.append([ 101, next(1), next(2) ]) && consume(2) && switchto('sci-notation') : 45 == t ? namestartchar(next()) ? consume() && create(new DimensionToken(o, [ 45, t ])) && switchto('dimension') : 92 == next(1) && badescape(next(2)) ? parseerror() && emit() && switchto('data') && reconsume() : 92 == next(1) ? consume() && create(new DimensionToken(o, [ 45, consumeEscape() ])) && switchto('dimension') : emit() && switchto('data') && reconsume() : namestartchar(t) ? create(new DimensionToken(o, t)) && switchto('dimension') : 92 == t ? badescape(next) ? parseerror() && emit() && switchto('data') && reconsume() : create(new DimensionToken(o, consumeEscape())) && switchto('dimension') : emit() && switchto('data') && reconsume();
            break;

          case 'dimension':
            namechar(t) ? o.append(t) : 92 == t ? badescape(next()) ? parseerror() && emit() && switchto('data') && reconsume() : o.append(consumeEscape()) : emit() && switchto('data') && reconsume();
            break;

          case 'sci-notation':
            o.type = 'number', digit(t) ? o.append(t) : emit() && switchto('data') && reconsume();
            break;

          case 'url':
            eof() ? parseerror() && emit(new BadURLToken) && switchto('data') : 34 == t ? switchto('url-double-quote') : 39 == t ? switchto('url-single-quote') : 41 == t ? emit(new URLToken) && switchto('data') : whitespace(t) || switchto('url-unquoted') && reconsume();
            break;

          case 'url-double-quote':
            o instanceof URLToken || create(new URLToken), eof() ? parseerror() && emit(new BadURLToken) && switchto('data') : 34 == t ? switchto('url-end') : newline(t) ? parseerror() && switchto('bad-url') : 92 == t ? newline(next()) ? consume() : badescape(next()) ? parseerror() && emit(new BadURLToken) && switchto('data') && reconsume() : o.append(consumeEscape()) : o.append(t);
            break;

          case 'url-single-quote':
            o instanceof URLToken || create(new URLToken), eof() ? parseerror() && emit(new BadURLToken) && switchto('data') : 39 == t ? switchto('url-end') : newline(t) ? parseerror() && switchto('bad-url') : 92 == t ? newline(next()) ? consume() : badescape(next()) ? parseerror() && emit(new BadURLToken) && switchto('data') && reconsume() : o.append(consumeEscape()) : o.append(t);
            break;

          case 'url-end':
            eof() ? parseerror() && emit(new BadURLToken) && switchto('data') : whitespace(t) || (41 == t ? emit() && switchto('data') : parseerror() && switchto('bad-url') && reconsume());
            break;

          case 'url-unquoted':
            o instanceof URLToken || create(new URLToken), eof() ? parseerror() && emit(new BadURLToken) && switchto('data') : whitespace(t) ? switchto('url-end') : 41 == t ? emit() && switchto('data') : 34 == t || 39 == t || 40 == t || nonprintable(t) ? parseerror() && switchto('bad-url') : 92 == t ? badescape(next()) ? parseerror() && switchto('bad-url') : o.append(consumeEscape()) : o.append(t);
            break;

          case 'bad-url':
            eof() ? parseerror() && emit(new BadURLToken) && switchto('data') : 41 == t ? emit(new BadURLToken) && switchto('data') : 92 == t && (badescape(next()) || consumeEscape());
            break;

          case 'unicode-range':
            for (var k = [ t ], c = [ t ], T = 1; T < 6 && hexdigit(next()); T++) consume(), 
            k.push(t), c.push(t);
            if (63 == next()) {
                for (;T < 6 && 63 == next(); T++) consume(), k.push('0'.charCodeAt(0)), c.push('f'.charCodeAt(0));
                emit(new UnicodeRangeToken(k, c)) && switchto('data');
            } else if (45 == next(1) && hexdigit(next(2))) {
                consume(), consume(), c = [ t ];
                for (T = 1; T < 6 && hexdigit(next()); T++) consume(), c.push(t);
                emit(new UnicodeRangeToken(k, c)) && switchto('data');
            } else emit(new UnicodeRangeToken(k)) && switchto('data');
            break;

          default:
            catchfire('Unknown state \'' + a + '\'');
        }
    }
}

function stringFromCodeArray(e) {
    return String.fromCharCode.apply(null, e.filter((function(e) {
        return e;
    })));
}

function CSSParserToken(e) {
    return this;
}

function BadStringToken() {
    return this;
}

function BadURLToken() {
    return this;
}

function WhitespaceToken() {
    return this;
}

function CDOToken() {
    return this;
}

function CDCToken() {
    return this;
}

function ColonToken() {
    return this;
}

function SemicolonToken() {
    return this;
}

function OpenCurlyToken() {
    return this;
}

function CloseCurlyToken() {
    return this;
}

function OpenSquareToken() {
    return this;
}

function CloseSquareToken() {
    return this;
}

function OpenParenToken() {
    return this;
}

function CloseParenToken() {
    return this;
}

function EOFToken() {
    return this;
}

function DelimToken(e) {
    return this.value = String.fromCharCode(e), this;
}

function StringValuedToken() {
    return this;
}

function IdentifierToken(e) {
    this.value = [], this.append(e);
}

function FunctionToken(e) {
    this.value = e.finish().value;
}

function AtKeywordToken(e) {
    this.value = [], this.append(e);
}

function HashToken(e) {
    this.value = [], this.append(e);
}

function StringToken(e) {
    this.value = [], this.append(e);
}

function URLToken(e) {
    this.value = [], this.append(e);
}

function NumberToken(e) {
    this.value = [], this.append(e), this.type = 'integer';
}

function PercentageToken(e) {
    e.finish(), this.value = e.value, this.repr = e.repr;
}

function DimensionToken(e, n) {
    e.finish(), this.num = e.value, this.unit = [], this.repr = e.repr, this.append(n);
}

function UnicodeRangeToken(e, n) {
    return e = parseInt(stringFromCodeArray(e), 16), n = void 0 === n ? e + 1 : parseInt(stringFromCodeArray(n), 16), 
    e > maximumallowedcodepoint && (n = e), n < e && (n = e), n > maximumallowedcodepoint && (n = maximumallowedcodepoint), 
    this.start = e, this.end = n, this;
}

CSSParserToken.prototype.finish = function() {
    return this;
}, CSSParserToken.prototype.toString = function() {
    return this.tokenType;
}, CSSParserToken.prototype.toJSON = function() {
    return this.toString();
}, BadStringToken.prototype = new CSSParserToken, BadStringToken.prototype.tokenType = 'BADSTRING', 
BadURLToken.prototype = new CSSParserToken, BadURLToken.prototype.tokenType = 'BADURL', 
WhitespaceToken.prototype = new CSSParserToken, WhitespaceToken.prototype.tokenType = 'WHITESPACE', 
WhitespaceToken.prototype.toString = function() {
    return 'WS';
}, CDOToken.prototype = new CSSParserToken, CDOToken.prototype.tokenType = 'CDO', 
CDCToken.prototype = new CSSParserToken, CDCToken.prototype.tokenType = 'CDC', ColonToken.prototype = new CSSParserToken, 
ColonToken.prototype.tokenType = ':', SemicolonToken.prototype = new CSSParserToken, 
SemicolonToken.prototype.tokenType = ';', OpenCurlyToken.prototype = new CSSParserToken, 
OpenCurlyToken.prototype.tokenType = '{', CloseCurlyToken.prototype = new CSSParserToken, 
CloseCurlyToken.prototype.tokenType = '}', OpenSquareToken.prototype = new CSSParserToken, 
OpenSquareToken.prototype.tokenType = '[', CloseSquareToken.prototype = new CSSParserToken, 
CloseSquareToken.prototype.tokenType = ']', OpenParenToken.prototype = new CSSParserToken, 
OpenParenToken.prototype.tokenType = '(', CloseParenToken.prototype = new CSSParserToken, 
CloseParenToken.prototype.tokenType = ')', EOFToken.prototype = new CSSParserToken, 
EOFToken.prototype.tokenType = 'EOF', DelimToken.prototype = new CSSParserToken, 
DelimToken.prototype.tokenType = 'DELIM', DelimToken.prototype.toString = function() {
    return 'DELIM(' + this.value + ')';
}, StringValuedToken.prototype = new CSSParserToken, StringValuedToken.prototype.append = function(e) {
    if (e instanceof Array) for (var n = 0; n < e.length; n++) this.value.push(e[n]); else this.value.push(e);
    return !0;
}, StringValuedToken.prototype.finish = function() {
    return this.value = this.valueAsString(), this;
}, StringValuedToken.prototype.ASCIImatch = function(e) {
    return this.valueAsString().toLowerCase() == e.toLowerCase();
}, StringValuedToken.prototype.valueAsString = function() {
    return 'string' == typeof this.value ? this.value : stringFromCodeArray(this.value);
}, StringValuedToken.prototype.valueAsCodes = function() {
    if ('string' == typeof this.value) {
        for (var e = [], n = 0; n < this.value.length; n++) e.push(this.value.charCodeAt(n));
        return e;
    }
    return this.value.filter((function(e) {
        return e;
    }));
}, IdentifierToken.prototype = new StringValuedToken, IdentifierToken.prototype.tokenType = 'IDENT', 
IdentifierToken.prototype.toString = function() {
    return 'IDENT(' + this.value + ')';
}, FunctionToken.prototype = new StringValuedToken, FunctionToken.prototype.tokenType = 'FUNCTION', 
FunctionToken.prototype.toString = function() {
    return 'FUNCTION(' + this.value + ')';
}, AtKeywordToken.prototype = new StringValuedToken, AtKeywordToken.prototype.tokenType = 'AT-KEYWORD', 
AtKeywordToken.prototype.toString = function() {
    return 'AT(' + this.value + ')';
}, HashToken.prototype = new StringValuedToken, HashToken.prototype.tokenType = 'HASH', 
HashToken.prototype.toString = function() {
    return 'HASH(' + this.value + ')';
}, StringToken.prototype = new StringValuedToken, StringToken.prototype.tokenType = 'STRING', 
StringToken.prototype.toString = function() {
    return '"' + this.value + '"';
}, URLToken.prototype = new StringValuedToken, URLToken.prototype.tokenType = 'URL', 
URLToken.prototype.toString = function() {
    return 'URL(' + this.value + ')';
}, NumberToken.prototype = new StringValuedToken, NumberToken.prototype.tokenType = 'NUMBER', 
NumberToken.prototype.toString = function() {
    return 'integer' == this.type ? 'INT(' + this.value + ')' : 'NUMBER(' + this.value + ')';
}, NumberToken.prototype.finish = function() {
    return this.repr = this.valueAsString(), this.value = 1 * this.repr, Math.abs(this.value) % 1 != 0 && (this.type = 'number'), 
    this;
}, PercentageToken.prototype = new CSSParserToken, PercentageToken.prototype.tokenType = 'PERCENTAGE', 
PercentageToken.prototype.toString = function() {
    return 'PERCENTAGE(' + this.value + ')';
}, DimensionToken.prototype = new CSSParserToken, DimensionToken.prototype.tokenType = 'DIMENSION', 
DimensionToken.prototype.toString = function() {
    return 'DIM(' + this.num + ',' + this.unit + ')';
}, DimensionToken.prototype.append = function(e) {
    if (e instanceof Array) for (var n = 0; n < e.length; n++) this.unit.push(e[n]); else this.unit.push(e);
    return !0;
}, DimensionToken.prototype.finish = function() {
    return this.unit = stringFromCodeArray(this.unit), this.repr += this.unit, this;
}, UnicodeRangeToken.prototype = new CSSParserToken, UnicodeRangeToken.prototype.tokenType = 'UNICODE-RANGE', 
UnicodeRangeToken.prototype.toString = function() {
    return this.start + 1 == this.end ? 'UNICODE-RANGE(' + this.start.toString(16).toUpperCase() + ')' : this.start < this.end ? 'UNICODE-RANGE(' + this.start.toString(16).toUpperCase() + '-' + this.end.toString(16).toUpperCase() + ')' : 'UNICODE-RANGE()';
}, UnicodeRangeToken.prototype.contains = function(e) {
    return e >= this.start && e < this.end;
};