/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
export default class StackTrace {
    constructor() {
        Object.seal(this);
    }
    static getFunctionName(e) {
        var t = (new Error).stack.split('\n')[e], a = /at (.*) ?\(/g.exec(t), r = '';
        return null == a ? t : (a.length > 1 && (r += a[1].trim()), `{${r = r.padStart(30, ' ')}}`);
    }
    static getSitus(e) {
        var t = (new Error).stack.split('\n')[e], a = /at .*\((.*)\)/g.exec(t), r = '';
        return a.length > 1 && (r += a[1].trim()), r;
    }
    static getInfo(e) {
        var t = {
            classname: '',
            member: '',
            path: '',
            filename: '',
            line: '',
            column: ''
        }, a = (new Error).stack.split('\n')[e], r = /at (.*) ?\(/g.exec(a), n = '';
        r.length > 1 && (n = r[1].trim());
        var l = n.split('.');
        t.classname = l[0], l.length > 1 && (t.member = l[1], t.member = t.member.replace(' (eval at evaluate', ''));
        var s = /at .*\((.*)\)/g.exec(a), c = '';
        s.length > 1 && (c = s[1].trim());
        var i = c.split(':'), m = i[0];
        i.length > 1 && (t.line = i[1]), i.length > 2 && (t.column = i[2]);
        var g = m.lastIndexOf('/');
        return -1 != g ? (t.path = m.substr(0, g), t.filename = m.substr(g + 1)) : t.filename = m, 
        t;
    }
}