/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
export function fromUserDayMonthYear(t) {
    var [r, e, a] = t.split(' ');
    null != r && '' != r || (r = 1), null != e && '' != e || (e = 'jan');
    var o = [ 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec' ].indexOf(e.toLowerCase());
    return -1 == o && (e = 0), null != a && '' != a || (a = 2e3), new Date(Date.UTC(a, o, r));
}

export function toUserDayMonthYear(t) {
    return 'Date' !== t.constructor.name ? '1 Jan 2020' : `${t.getUTCDate()} ${[ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ][t.getUTCMonth()]} ${t.getUTCFullYear()}`;
}

export function fromUserTimeOfDay(t) {
    var r = t.split(':');
    if (3 != r.length) return 0;
    var e = parseInt(r[0]), a = parseInt(r[1]), o = parseInt(r[2]);
    return isNaN(e) || e < 0 || e > 26 ? 0 : isNaN(a) || a < 0 || a > 59 ? 60 * e * 60 : isNaN(o) || o < 0 || o > 59 ? 60 * e * 60 + 60 * a : 60 * e * 60 + 60 * a + o;
}

export function toUserTimeOfDay(t) {
    var r = Math.trunc(t / 3600), e = t - 60 * r * 60, a = Math.trunc(e / 60), o = e - 60 * a;
    return `${r.toString().padStart(2, '0')}:${a.toString().padStart(2, '0')}:${o.toString().padStart(2, '0')}`;
}

export function fromSliderTimeOfDay(t) {
    if (96 == (t = parseInt(t))) var r = 86399; else r = 60 * Math.floor(t / 4) * 60 + 60 * (t % 4 * 15);
    return r;
}

export function toSliderTimeOfDay(t) {
    var r = Math.trunc(t / 3600), e = (t - 60 * r * 60) / 60;
    return 4 * r + Math.round(e / 15);
}

export function fromUserDeclination(t) {
    var r = t.toUpperCase().indexOf('N'), e = t.toUpperCase().indexOf('S');
    if (-1 != r) var a = parseFloat(t.substr(0, r)); else if (-1 != e) a = -1 * parseFloat(t.substr(0, e)); else a = parseFloat(t);
    return isNaN(a) && (a = 0), a > 23.45 && (a = 23.45), a < -23.45 && (a = -23.45), 
    a;
}

export function toUserDeclination(t) {
    return isNaN(t) ? '0.00' : t > 0 ? `${t.toFixed(2)} N` : t < 0 ? `${Math.abs(t).toFixed(2)} S` : '0.00';
}

export function fromUserLongitude(t) {
    var r = t.toUpperCase().indexOf('E'), e = t.toUpperCase().indexOf('W');
    if (-1 != r) var a = parseFloat(t.substr(0, r)); else if (-1 != e) a = -1 * parseFloat(t.substr(0, e)); else a = parseFloat(t);
    return isNaN(a) && (a = 0), a > 180 && (a = 180), a < -179.99 && (a = -179.99), 
    a;
}

export function toUserLongitude(t) {
    return isNaN(t) ? '0.00' : t > 0 ? `${t.toFixed(2)} E` : t < 0 ? `${Math.abs(t).toFixed(2)} W` : '0.00';
}

export function fromUserLatitude(t) {
    var r = t.indexOf('N'), e = t.indexOf('S');
    if (-1 != r) var a = parseFloat(t.substr(0, r)); else if (-1 != e) a = -1 * parseFloat(t.substr(0, e)); else a = parseFloat(t);
    return isNaN(a) && (a = 0), a > 90 && (a = 90), a < -90 && (a = -90), a;
}

export function toUserLatitude(t) {
    return isNaN(t) ? '0.00' : t > 0 ? `${t.toFixed(2)} N` : t < 0 ? `${Math.abs(t).toFixed(2)} S` : '0.00';
}

export function formatEquationOfTime(t) {
    if (isNaN(t)) return '';
    var r = t < 0 ? 'slow' : 'fast';
    t = Math.abs(t);
    var e = Math.trunc(t);
    return `${e}m ${Math.round(60 * (t - e))}s ${r}`;
}

export function formatHourAngle(t) {
    if (isNaN(t)) return '0h 0m 0s';
    var r = (t = Math.abs(t)) / (Math.PI / 12), e = Math.trunc(r), a = 60 * (r - e), o = Math.trunc(a), n = a - o;
    return `${e}h ${o}m ${Math.round(60 * n)}s`;
}

export function formatDegrees(t) {
    return `${t.toFixed(2)}°`;
}

export function formatAltitude(t) {
    var r = t > 0 ? ' above horizon' : ' below horizon';
    return `${t.toFixed(2)}° ${r}`;
}

export function formatAzimuth(t) {
    return `${t.toFixed(2)}° clockwise from N`;
}

export function formatHMSfromMinutes(t) {
    var r = Math.trunc(t / 60), e = t - 60 * r, a = Math.trunc(e), o = e - a, n = Math.round(60 * o);
    return `${r.toString().padStart(2, '0')}:${a.toString().padStart(2, '0')}:${n.toString().padStart(2, '0')}`;
}

export function formatSunriseSunset(t) {
    return null == t.timelocal ? 'indeterminate' : 0 == t.timelocal ? formatDateTimeFromJD(t.jday) : formatHMSfromMinutes(t.timelocal);
}

export function formatTimezone(t) {
    var r = t < 0 ? '' : '+', e = Math.trunc(t), a = Math.abs(t - e), o = '00';
    return .25 == a && (o = '15'), .5 == a && (o = '30'), .75 == a && (o = '45'), `(UTC ${r}${e}:${o})`;
}

export function formatDateTimeFromJD(t) {
    var r = Math.floor(t + .5), e = t + .5 - r;
    if (r < 2299161) var a = r; else {
        var o = Math.floor((r - 1867216.25) / 36524.25);
        a = r + 1 + o - Math.floor(o / 4);
    }
    var n = a + 1524, i = Math.floor((n - 122.1) / 365.25), u = Math.floor(365.25 * i), f = Math.floor((n - u) / 30.6001), s = n - u - Math.floor(30.6001 * f) + e, p = f < 14 ? f - 1 : f - 13, l = p > 2 ? i - 4716 : i - 4715;
    return `${Math.trunc(s)} ${[ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ][p - 1]} ${l}`;
}

export function formatLocalTime(t, r) {
    var e = t.valueOf();
    return e += 60 * r * 60 * 1e3, new Date(e).toUTCString().replace('GMT', '<br>' + formatTimezone(r));
}

export function formatLocalTimeWithName(t, r, e) {
    var a = t.valueOf();
    return a += 60 * r * 60 * 1e3, new Date(a).toUTCString().replace('GMT', ' ' + e);
}

export function formatLocalTimeShortform(t, r) {
    var e = t.valueOf();
    e += 60 * r * 60 * 1e3;
    var a = new Date(e);
    return `${a.getUTCHours().toString().padStart(2, '0')}:${a.getUTCMinutes().toString().padStart(2, '0')}:${a.getUTCSeconds().toString().padStart(2, '0')}`;
}

export function formatDateDMY(t) {
    var r = t.getUTCFullYear(), e = t.getUTCMonth();
    return `${t.getUTCDate()}-${[ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ][e]}-${r}`;
}

export function formatRightAscensionHMS(t) {
    if (isNaN(t)) return '';
    for (var r = t; r > 360; ) r -= 360;
    for (;r < 0; ) r += 360;
    var e = Math.round(86400 * r / 360), a = Math.floor(e / 3600), o = e - 3600 * a, n = Math.floor(o / 60);
    return o -= 60 * n, `${a}h ${n}m ${Math.trunc(o)}s`;
}

export function formatHoursMinutesSeconds(t) {
    return `${t.getUTCHours().toString().padStart(2, '0')}:${t.getUTCMinutes().toString().padStart(2, '0')}:${t.getUTCSeconds().toString().padStart(2, '0')}`;
}

export function numSecondsSinceMidnightUTC(t) {
    return 60 * t.getUTCHours() * 60 + 60 * t.getUTCMinutes() + t.getUTCSeconds();
}