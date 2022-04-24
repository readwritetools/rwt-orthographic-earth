/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
export function fromUserDayMonthYear(t) {
    var [r, e, a] = t.split(' ');
    null != r && '' != r || (r = 1), null != e && '' != e || (e = 'jan');
    var n = [ 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec' ].indexOf(e.toLowerCase());
    return -1 == n && (e = 0), null != a && '' != a || (a = 2e3), new Date(Date.UTC(a, n, r));
}

export function toUserDayMonthYear(t) {
    return 'Date' !== t.constructor.name ? '1 Jan 2020' : `${t.getUTCDate()} ${[ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ][t.getUTCMonth()]} ${t.getUTCFullYear()}`;
}

export function fromUserTimeOfDay(t) {
    var r = t.split(':');
    if (3 != r.length) return 0;
    var e = parseInt(r[0]), a = parseInt(r[1]), n = parseInt(r[2]);
    return isNaN(e) || e < 0 || e > 26 ? 0 : isNaN(a) || a < 0 || a > 59 ? 60 * e * 60 : isNaN(n) || n < 0 || n > 59 ? 60 * e * 60 + 60 * a : 60 * e * 60 + 60 * a + n;
}

export function toUserTimeOfDay(t) {
    var r = Math.trunc(t / 3600), e = t - 60 * r * 60, a = Math.trunc(e / 60), n = e - 60 * a;
    return `${r.toString().padStart(2, '0')}:${a.toString().padStart(2, '0')}:${n.toString().padStart(2, '0')}`;
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

export function sliderToMapScale(t) {
    switch (t) {
      case 1:
        return .025;

      case 2:
        return .038;

      case 3:
        return .06;

      case 4:
        return .085;

      case 5:
        return .125;

      case 6:
        return .19;

      case 7:
        return .285;

      case 8:
        return .43;

      case 9:
        return .645;

      case 10:
        return 1;

      case 11:
        return 1.5;

      case 12:
        return 2.3;

      case 13:
        return 3.8;

      case 14:
        return 5;

      case 15:
        return 7.6;

      case 16:
        return 11.4;

      case 17:
        return 17;

      case 18:
        return 26;

      case 19:
        return 38;

      case 20:
        return 58;

      case 21:
        return 87;

      case 22:
        return 130;

      case 23:
        return 196;

      case 24:
        return 294;

      case 25:
        return 440;

      case 26:
        return 665;

      case 27:
        return 1e3;
    }
    return t < 1 ? .025 : t > 27 ? 1e3 : void 0;
}

export function mapScaleToSlider(t) {
    return t <= .025 ? 1 : t <= .038 ? 2 : t <= .06 ? 3 : t <= .085 ? 4 : t <= .125 ? 5 : t <= .19 ? 6 : t <= .285 ? 7 : t <= .43 ? 8 : t <= .645 ? 9 : t <= 1 ? 10 : t <= 1.5 ? 11 : t <= 2.3 ? 12 : t <= 3.8 ? 13 : t <= 5 ? 14 : t <= 7.6 ? 15 : t <= 11.4 ? 16 : t <= 17 ? 17 : t <= 26 ? 18 : t <= 38 ? 19 : t <= 58 ? 20 : t <= 87 ? 21 : t <= 130 ? 22 : t <= 196 ? 23 : t <= 294 ? 24 : t <= 440 ? 25 : t <= 665 ? 26 : 27;
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
    var r = (t = Math.abs(t)) / (Math.PI / 12), e = Math.trunc(r), a = 60 * (r - e), n = Math.trunc(a), o = a - n;
    return `${e}h ${n}m ${Math.round(60 * o)}s`;
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
    var r = Math.trunc(t / 60), e = t - 60 * r, a = Math.trunc(e), n = e - a, o = Math.round(60 * n);
    return `${r.toString().padStart(2, '0')}:${a.toString().padStart(2, '0')}:${o.toString().padStart(2, '0')}`;
}

export function formatSunriseSunset(t) {
    return null == t.timelocal ? 'indeterminate' : 0 == t.timelocal ? formatDateTimeFromJD(t.jday) : formatHMSfromMinutes(t.timelocal);
}

export function formatTimezone(t) {
    var r = t < 0 ? '' : '+', e = Math.trunc(t), a = Math.abs(t - e), n = '00';
    return .25 == a && (n = '15'), .5 == a && (n = '30'), .75 == a && (n = '45'), `(UTC ${r}${e}:${n})`;
}

export function formatDateTimeFromJD(t) {
    var r = Math.floor(t + .5), e = t + .5 - r;
    if (r < 2299161) var a = r; else {
        var n = Math.floor((r - 1867216.25) / 36524.25);
        a = r + 1 + n - Math.floor(n / 4);
    }
    var o = a + 1524, u = Math.floor((o - 122.1) / 365.25), i = Math.floor(365.25 * u), s = Math.floor((o - i) / 30.6001), c = o - i - Math.floor(30.6001 * s) + e, f = s < 14 ? s - 1 : s - 13, p = f > 2 ? u - 4716 : u - 4715;
    return `${Math.trunc(c)} ${[ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ][f - 1]} ${p}`;
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
    var e = Math.round(86400 * r / 360), a = Math.floor(e / 3600), n = e - 3600 * a, o = Math.floor(n / 60);
    return n -= 60 * o, `${a}h ${o}m ${Math.trunc(n)}s`;
}

export function formatHoursMinutesSeconds(t) {
    return `${t.getUTCHours().toString().padStart(2, '0')}:${t.getUTCMinutes().toString().padStart(2, '0')}:${t.getUTCSeconds().toString().padStart(2, '0')}`;
}

export function numSecondsSinceMidnightUTC(t) {
    return 60 * t.getUTCHours() * 60 + 60 * t.getUTCMinutes() + t.getUTCSeconds();
}