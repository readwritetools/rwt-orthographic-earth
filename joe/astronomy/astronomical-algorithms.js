/* Astronomical Algorithms Second Edition by Jean Meeus, ©1998, published by Willmann-Bell. Earth perihelion and aphelion times determined using JPL DE405 by Fred Espenak */
export function calcGeomMeanLongSun(a) {
    for (var e = 280.46646 + a * (36000.76983 + 3032e-7 * a); e > 360; ) e -= 360;
    for (;e < 0; ) e += 360;
    return e;
}

export function calcGeomMeanAnomalySun(a) {
    return 357.52911 + a * (35999.05029 - 1537e-7 * a);
}

export function calcEccentricityEarthOrbit(a) {
    return .016708634 - a * (42037e-9 + 1.267e-7 * a);
}

export function calcSunEqOfCenter(a) {
    var e = degToRad(calcGeomMeanAnomalySun(a));
    return Math.sin(e) * (1.914602 - a * (.004817 + 14e-6 * a)) + Math.sin(e + e) * (.019993 - 101e-6 * a) + 289e-6 * Math.sin(e + e + e);
}

export function calcSunTrueLong(a) {
    return calcGeomMeanLongSun(a) + calcSunEqOfCenter(a);
}

export function calcSunTrueAnomaly(a) {
    return calcGeomMeanAnomalySun(a) + calcSunEqOfCenter(a);
}

export function calcSunRadVector(a) {
    var e = calcSunTrueAnomaly(a), t = calcEccentricityEarthOrbit(a);
    return 1.000001018 * (1 - t * t) / (1 + t * Math.cos(degToRad(e)));
}

export function calcDistanceInKm(a) {
    var e = 149597870.7 * a;
    return `${Math.trunc(e).toLocaleString()} km`;
}

export function calcDeltaMeanDistance(a) {
    return a < 1 ? `${(100 * (1 - a)).toFixed(2)}% closer than average` : `${(100 * (a - 1)).toFixed(2)}% farther than average`;
}

export function calcSunApparentLong(a) {
    var e = 125.04 - 1934.136 * a;
    return calcSunTrueLong(a) - .00569 - .00478 * Math.sin(degToRad(e));
}

export function calcMeanObliquityOfEcliptic(a) {
    return 23 + (26 + (21.448 - a * (46.815 + a * (59e-5 - .001813 * a))) / 60) / 60;
}

export function calcObliquityCorrection(a) {
    var e = 125.04 - 1934.136 * a;
    return calcMeanObliquityOfEcliptic(a) + .00256 * Math.cos(degToRad(e));
}

export function calcSunRtAscension(a) {
    var e = calcObliquityCorrection(a), t = calcSunApparentLong(a), r = Math.cos(degToRad(e)) * Math.sin(degToRad(t)), n = Math.cos(degToRad(t));
    return radToDeg(Math.atan2(r, n));
}

export function calcSunDeclination(a) {
    var e = calcObliquityCorrection(a), t = calcSunApparentLong(a), r = Math.sin(degToRad(e)) * Math.sin(degToRad(t));
    return radToDeg(Math.asin(r));
}

export function calcEquationOfTime(a) {
    var e = calcObliquityCorrection(a), t = calcGeomMeanLongSun(a), r = calcEccentricityEarthOrbit(a), n = calcGeomMeanAnomalySun(a), o = Math.tan(degToRad(e) / 2);
    o *= o;
    var c = Math.sin(2 * degToRad(t)), i = Math.sin(degToRad(n));
    return 4 * radToDeg(o * c - 2 * r * i + 4 * r * o * i * Math.cos(2 * degToRad(t)) - .5 * o * o * Math.sin(4 * degToRad(t)) - 1.25 * r * r * Math.sin(2 * degToRad(n)));
}

export function calcHourAngleSunrise(a, e) {
    var t = degToRad(a), r = degToRad(e), n = Math.cos(degToRad(90.833)) / (Math.cos(t) * Math.cos(r)) - Math.tan(t) * Math.tan(r);
    return Math.acos(n);
}

export function getJD(a, e, t) {
    e <= 2 && (a -= 1, e += 12);
    var r = Math.floor(a / 100), n = 2 - r + Math.floor(r / 4);
    return Math.floor(365.25 * (a + 4716)) + Math.floor(30.6001 * (e + 1)) + t + n - 1524.5;
}

export function calcRefraction(a) {
    if (a > 85) var e = 0; else {
        var t = Math.tan(degToRad(a));
        if (a > 5) e = 58.1 / t - .07 / (t * t * t) + 86e-6 / (t * t * t * t * t); else if (a > -.575) e = 1735 + a * (a * (103.4 + a * (.711 * a - 12.79)) - 518.2); else e = -20.774 / t;
        e /= 3600;
    }
    return e;
}

export function calcAzEl(a, e, t, r, n) {
    for (var o = calcEquationOfTime(a), c = calcSunDeclination(a), i = e + (o + 4 * r - 60 * n); i > 1440; ) i -= 1440;
    var u = i / 4 - 180;
    u < -180 && (u += 360);
    var l = degToRad(u), f = Math.sin(degToRad(t)) * Math.sin(degToRad(c)) + Math.cos(degToRad(t)) * Math.cos(degToRad(c)) * Math.cos(l);
    f > 1 ? f = 1 : f < -1 && (f = -1);
    var d = radToDeg(Math.acos(f)), T = Math.cos(degToRad(t)) * Math.sin(degToRad(d));
    if (Math.abs(T) > .001) {
        var h = (Math.sin(degToRad(t)) * Math.cos(degToRad(d)) - Math.sin(degToRad(c))) / T;
        Math.abs(h) > 1 && (h = h < 0 ? -1 : 1);
        var s = 180 - radToDeg(Math.acos(h));
        u > 0 && (s = -s);
    } else if (t > 0) s = 180; else s = 0;
    return s < 0 && (s += 360), {
        azimuth: s,
        elevation: 90 - (d - calcRefraction(90 - d))
    };
}

export function calcSolNoon(a, e, t) {
    for (var r = calcEquationOfTime(calcTimeJulianCent(a - e / 360)), n = 720 - 4 * e - (r = calcEquationOfTime(calcTimeJulianCent(a + (720 - 4 * e - r) / 1440))) + 60 * t; n < 0; ) n += 1440;
    for (;n >= 1440; ) n -= 1440;
    return n;
}

export function calcSolarPhase(a, e) {
    var t = e < a ? 'dusk' : 'dawn';
    return a < -18 ? 'night' : a < -12 ? `astronomical ${t}` : a < -6 ? `nautical ${t}` : a < 0 ? `civil ${t}` : 'daylight';
}

export function calcSunriseSetUTC(a, e, t, r) {
    var n = calcTimeJulianCent(e), o = calcEquationOfTime(n), c = calcHourAngleSunrise(t, calcSunDeclination(n));
    return a || (c = -c), 720 - 4 * (r + radToDeg(c)) - o;
}

export function calcSunriseSet(a, e, t, r, n) {
    var o = calcSunriseSetUTC(a, e, t, r), c = calcSunriseSetUTC(a, e + o / 1440, t, r);
    if (isNumber(c)) {
        var i = c + 60 * n, u = calcAzEl(calcTimeJulianCent(e + c / 1440), i, t, r, n).azimuth, l = e;
        if (i < 0 || i >= 1440) for (var f = i < 0 ? 1 : -1; i < 0 || i >= 1440; ) i += 1440 * f, 
        l -= f;
    } else {
        if (90 == t || -90 == t) return {
            jday: null,
            timelocal: null,
            azimuth: null
        };
        u = -1, i = 0;
        var d = calcDoyFromJD(e);
        l = calcJDofNextPrevRiseSet(t > 66.4 && d > 79 && d < 267 || t < -66.4 && (d < 83 || d > 263) ? !a : a, a, e, t, r, n);
    }
    return {
        jday: l,
        timelocal: i,
        azimuth: u
    };
}

export function calcJDofNextPrevRiseSet(a, e, t, r, n, o) {
    for (var c = t, i = a ? 1 : -1, u = calcSunriseSetUTC(e, c, r, n); !isNumber(u); ) u = calcSunriseSetUTC(e, c += i, r, n);
    for (var l = u + 60 * o; l < 0 || l >= 1440; ) {
        var f = l < 0 ? 1 : -1;
        l += 1440 * f, c -= f;
    }
    return c;
}

export function calcTimeJulianCent(a) {
    return (a - 2451545) / 36525;
}

function calcJDFromJulianCent(a) {
    return 36525 * a + 2451545;
}

function isLeapYear(a) {
    return a % 4 == 0 && a % 100 != 0 || a % 400 == 0;
}

export function calcDateFromJD(a) {
    var e = Math.floor(a + .5), t = a + .5 - e;
    if (e < 2299161) var r = e; else {
        var n = Math.floor((e - 1867216.25) / 36524.25);
        r = e + 1 + n - Math.floor(n / 4);
    }
    var o = r + 1524, c = Math.floor((o - 122.1) / 365.25), i = Math.floor(365.25 * c), u = Math.floor((o - i) / 30.6001), l = u < 14 ? u - 1 : u - 13;
    return {
        year: l > 2 ? c - 4716 : c - 4715,
        month: l,
        day: o - i - Math.floor(30.6001 * u) + t
    };
}

function calcDoyFromJD(a) {
    var e = calcDateFromJD(a), t = isLeapYear(e.year) ? 1 : 2;
    return Math.floor(275 * e.month / 9) - t * Math.floor((e.month + 9) / 12) + e.day - 30;
}

function radToDeg(a) {
    return 180 * a / Math.PI;
}

function degToRad(a) {
    return Math.PI * a / 180;
}

function isNumber(a) {
    for (var e = !1, t = '' + a, r = 0; r < t.length; r++) {
        var n = t.charAt(r);
        if (0 != r || '-' != n && '+' != n) if ('.' != n || e) {
            if (n < '0' || n > '9') return !1;
        } else e = !0;
    }
    return !0;
}

export function calculateEquinoxSolstice(a, e) {
    if (a < 0 || a > 3) return null;
    if (null == e) return null;
    var t = determineUncorrectedTime(a, e), r = (t - 2451545) / 36525, n = 35999.373 * r - 2.47, o = 1 + .0334 * COS(n) + 7e-4 * COS(2 * n), c = t + 1e-5 * periodicTerms(r) / o, i = fromJDtoUTC(c);
    return {
        'Julian Ephemeris Days': c,
        'Terrestrial Dynamical Time': i,
        'Coordinated Universal Time': fromTDTtoUTC(i)
    };
}

function determineUncorrectedTime(a, e) {
    var t = 0, r = (e - 2e3) / 1e3;
    switch (a) {
      case 0:
        t = 2451623.80984 + 365242.37404 * r + .05169 * POW2(r) - .00411 * POW3(r) - 57e-5 * POW4(r);
        break;

      case 1:
        t = 2451716.56767 + 365241.62603 * r + .00325 * POW2(r) + .00888 * POW3(r) - 3e-4 * POW4(r);
        break;

      case 2:
        t = 2451810.21715 + 365242.01767 * r - .11575 * POW2(r) + .00337 * POW3(r) + 78e-5 * POW4(r);
        break;

      case 3:
        t = 2451900.05952 + 365242.74049 * r - .06223 * POW2(r) - .00823 * POW3(r) + 32e-5 * POW4(r);
    }
    return t;
}

function periodicTerms(a) {
    var e = new Array(485, 203, 199, 182, 156, 136, 77, 74, 70, 58, 52, 50, 45, 44, 29, 18, 17, 16, 14, 12, 12, 12, 9, 8), t = new Array(324.96, 337.23, 342.08, 27.85, 73.14, 171.52, 222.54, 296.72, 243.58, 119.81, 297.17, 21.02, 247.54, 325.15, 60.93, 155.12, 288.79, 198.04, 199.76, 95.39, 287.11, 320.81, 227.73, 15.45), r = new Array(1934.136, 32964.467, 20.186, 445267.112, 45036.886, 22518.443, 65928.934, 3034.906, 9037.513, 33718.147, 150.678, 2281.226, 29929.562, 31555.956, 4443.417, 67555.328, 4562.452, 62894.029, 31436.921, 14577.848, 31931.756, 34777.259, 1222.114, 16859.074), n = 0;
    for (let o = 0; o < 24; o++) n += e[o] * COS(t[o] + r[o] * a);
    return n;
}

function fromTDTtoUTC(a) {
    var e = 1620, t = new Array(121, 112, 103, 95, 88, 82, 77, 72, 68, 63, 60, 56, 53, 51, 48, 46, 44, 42, 40, 38, 35, 33, 31, 29, 26, 24, 22, 20, 18, 16, 14, 12, 11, 10, 9, 8, 7, 7, 7, 7, 7, 7, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 15, 15, 14, 13, 13.1, 12.5, 12.2, 12, 12, 12, 12, 12, 12, 11.9, 11.6, 11, 10.2, 9.2, 8.2, 7.1, 6.2, 5.6, 5.4, 5.3, 5.4, 5.6, 5.9, 6.2, 6.5, 6.8, 7.1, 7.3, 7.5, 7.6, 7.7, 7.3, 6.2, 5.2, 2.7, 1.4, -1.2, -2.8, -3.8, -4.8, -5.5, -5.3, -5.6, -5.7, -5.9, -6, -6.3, -6.5, -6.2, -4.7, -2.8, -.1, 2.6, 5.3, 7.7, 10.4, 13.3, 16, 18.2, 20.2, 21.1, 22.4, 23.5, 23.8, 24.3, 24, 23.9, 23.9, 23.7, 24, 24.3, 25.3, 26.2, 27.3, 28.2, 29.1, 30, 30.7, 31.4, 32.2, 33.1, 34, 35, 36.5, 38.3, 40.2, 42.2, 44.5, 46.5, 48.5, 50.5, 52.5, 53.8, 54.9, 55.8, 56.9, 58.3, 60, 61.6, 63, 63.8, 64.3), r = 0, n = a.getUTCFullYear(), o = (n - 2e3) / 100;
    return n >= e && n <= 2002 ? r = n % 2 ? (t[(n - e - 1) / 2] + t[(n - e + 1) / 2]) / 2 : t[(n - e) / 2] : n < 948 ? r = 2177 + 497 * o + 44.1 * POW2(o) : n >= 948 ? (r = 102 + 102 * o + 25.3 * POW2(o), 
    n >= 2e3 && n <= 2100 && (r += .37 * (n - 2100))) : alert('Error: TDT to UTC correction not computed'), 
    new Date(a.getTime() - 1e3 * r);
}

function fromJDtoUTC(a) {
    var e, t = INT(a + .5), r = a + .5 - t, n = (t < 2299161 ? t : t + 1 + (e = INT((t - 1867216.25) / 36524.25)) - INT(e / 4)) + 1524, o = INT((n - 122.1) / 365.25), c = INT(365.25 * o), i = INT((n - c) / 30.6001), u = n - c - INT(30.6001 * i) + r, l = i - (i < 13.5 ? 1 : 13), f = o - (l > 2.5 ? 4716 : 4715), d = INT(u), T = 24 * (u - d), h = INT(T), s = 60 * (T - h), M = INT(s), g = INT(60 * (s - M)), m = new Date(0);
    return m.setUTCFullYear(f, l - 1, d), m.setUTCHours(h, M, g), m;
}

function INT(a) {
    return Math.floor(a);
}

function POW2(a) {
    return Math.pow(a, 2);
}

function POW3(a) {
    return Math.pow(a, 3);
}

function POW4(a) {
    return Math.pow(a, 4);
}

function COS(a) {
    return Math.cos(a * Math.PI / 180);
}

export function lookupPerihelion(a) {
    var e = {
        2020: [ 5, 7, 48 ],
        2021: [ 2, 13, 51 ],
        2022: [ 4, 6, 55 ],
        2023: [ 4, 16, 17 ],
        2024: [ 3, 0, 39 ],
        2025: [ 4, 13, 28 ],
        2026: [ 3, 17, 16 ],
        2027: [ 3, 2, 33 ],
        2028: [ 5, 12, 28 ],
        2029: [ 2, 18, 13 ],
        2030: [ 3, 10, 12 ]
    }[a];
    return null == e ? 'unavailable' : `${e[0]} Jan ${e[1].toString().padStart(2, '0')}:${e[2].toString().padStart(2, '0')}:00`;
}

export function lookupAphelion(a) {
    var e = {
        2020: [ 4, 11, 35 ],
        2021: [ 5, 22, 27 ],
        2022: [ 4, 7, 11 ],
        2023: [ 6, 20, 7 ],
        2024: [ 5, 5, 6 ],
        2025: [ 3, 19, 55 ],
        2026: [ 6, 17, 31 ],
        2027: [ 5, 5, 6 ],
        2028: [ 3, 22, 18 ],
        2029: [ 6, 5, 12 ],
        2030: [ 4, 12, 58 ]
    }[a];
    return null == e ? 'unavailable' : `${e[0]} Jul ${e[1].toString().padStart(2, '0')}:${e[2].toString().padStart(2, '0')}:00`;
}