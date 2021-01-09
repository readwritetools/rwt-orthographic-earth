/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
const radiansToDegrees = 180 / Math.PI;

import ProjectedPoint from '../projection/projected-point.class.js';

import * as CB from '../panels/panel-callbacks.js';

export default class EarthPosition {
    constructor(t) {
        this.rwtOrthographicEarth = t, this.UTC = null, this.JD = null, this.T = null, this.year = null, 
        this.isLeapYear = null, this.dayOfYear = null, this.timezoneOffset = 0, this.rightAscension = null, 
        this.declination = null, this.equationOfTime = null, this.sunriseHourAngle = null, 
        this.placeOfInterest = new ProjectedPoint(0, 0), this.azimuth = null, this.altitude = null, 
        this.sunrise = null, this.solarNoon = null, this.sunset = null, this.solarPhase = null, 
        this.perihelion = null, this.aphelion = null, this.distanceInKm = null, this.distanceVariance = null;
    }
    reflectValues() {
        this.broadcastDateAndTime(), this.broadcastTimezone(), this.broadcastEquationOfTime(), 
        this.broadcastGeocentricCoords(), this.broadcastTopocentricCoords(), this.broadcastPlaceOfInterest();
    }
    broadcastDateAndTime() {
        this.rwtOrthographicEarth.broadcastMessage('earthPosition/dayOfYear', this.dayOfYear), 
        this.rwtOrthographicEarth.broadcastMessage('earthPosition/civilDate', this.UTC), 
        this.rwtOrthographicEarth.broadcastMessage('earthPosition/timeOfDayHMS', this.UTC);
    }
    broadcastTimezone() {
        this.rwtOrthographicEarth.broadcastMessage('earthPosition/timezoneOffset', this.timezoneOffset), 
        this.rwtOrthographicEarth.broadcastMessage('earthPosition/timezoneLocalTime', {
            isoDateTimeFormat: CB.formatLocalTime(this.UTC, this.timezoneOffset),
            hmsTimeFormat: CB.formatLocalTimeShortform(this.UTC, this.timezoneOffset)
        });
    }
    broadcastEquationOfTime() {
        var t = {
            equationOfTime: this.equationOfTime
        };
        this.rwtOrthographicEarth.broadcastMessage('earthPosition/equationOfTime', t);
    }
    broadcastGeocentricCoords() {
        this.rwtOrthographicEarth.broadcastMessage('earthPosition/rightAscension', this.rightAscension), 
        this.rwtOrthographicEarth.broadcastMessage('earthPosition/declination', this.declination);
        var t = {
            year: this.year,
            perihelion: this.perihelion,
            aphelion: this.aphelion,
            distanceInKm: this.distanceInKm,
            distanceVariance: this.distanceVariance
        };
        this.rwtOrthographicEarth.broadcastMessage('earthPosition/distanceValues', t);
    }
    broadcastTopocentricCoords() {
        var t = {
            placeOfInterest: this.placeOfInterest,
            azimuth: this.azimuth,
            altitude: this.altitude,
            sunriseHourAngle: this.sunriseHourAngle,
            sunrise: this.sunrise,
            solarNoon: this.solarNoon,
            sunset: this.sunset,
            timezoneOffset: this.timezoneOffset,
            solarPhase: this.solarPhase
        };
        this.rwtOrthographicEarth.broadcastMessage('earthPosition/topocentricCoordinates', t);
    }
    broadcastPlaceOfInterest() {
        this.rwtOrthographicEarth.broadcastMessage('earthPosition/placeOfInterest', this.placeOfInterest);
    }
    changeDayMonthYear(t) {
        'Date' == t.constructor.name && (t.setUTCHours(this.UTC.getUTCHours()), t.setUTCMinutes(this.UTC.getUTCMinutes()), 
        t.setUTCSeconds(this.UTC.getUTCSeconds()), this.UTC = t, this.JD = convertUTCtoJD(t), 
        this.determineAll(), this.broadcastDateAndTime(), this.broadcastTimezone(), this.broadcastEquationOfTime(), 
        this.broadcastGeocentricCoords(), this.broadcastTopocentricCoords());
    }
    changeUTC(t) {
        'Date' == t.constructor.name && (this.UTC = t, this.JD = convertUTCtoJD(t), this.determineAll(), 
        this.broadcastDateAndTime(), this.broadcastTimezone(), this.broadcastEquationOfTime(), 
        this.broadcastGeocentricCoords(), this.broadcastTopocentricCoords());
    }
    changeJD(t) {
        'Number' == t.constructor.name && (this.JD = t, this.UTC = convertJDtoUTC(t), this.determineAll(), 
        this.broadcastDateAndTime(), this.broadcastTimezone(), this.broadcastEquationOfTime(), 
        this.broadcastGeocentricCoords(), this.broadcastTopocentricCoords());
    }
    changeDayOfYear(t) {
        if (t = parseInt(t), !isNaN(t)) {
            var e = Date.UTC(this.year, 0, t, this.UTC.getUTCHours(), this.UTC.getUTCMinutes(), this.UTC.getUTCSeconds());
            this.changeUTC(new Date(e)), this.broadcastDateAndTime(), this.broadcastTimezone(), 
            this.broadcastEquationOfTime(), this.broadcastGeocentricCoords(), this.broadcastTopocentricCoords();
        }
    }
    changeSpecialDay(t) {
        switch (t) {
          case 'MarchEquinox':
            var e = calculateEquinoxSolstice(0, this.year);
            break;

          case 'JuneSolstice':
            e = calculateEquinoxSolstice(1, this.year);
            break;

          case 'SeptemberEquinox':
            e = calculateEquinoxSolstice(2, this.year);
            break;

          case 'DecemberSolstice':
            e = calculateEquinoxSolstice(3, this.year);
            break;

          default:
            return;
        }
        var a = e['Coordinated Universal Time'];
        this.changeUTC(a), this.rwtOrthographicEarth.broadcastMessage('earthPosition/dayOfYear', this.dayOfYear), 
        this.rwtOrthographicEarth.broadcastMessage('earthPosition/civilDate', this.UTC), 
        this.rwtOrthographicEarth.broadcastMessage('earthPosition/timeOfDayHMS', this.UTC), 
        this.rwtOrthographicEarth.broadcastMessage('earthPosition/specialDay', t), this.broadcastTimezone(), 
        this.broadcastEquationOfTime(), this.broadcastGeocentricCoords(), this.broadcastTopocentricCoords();
    }
    changeTimeOfDayHMS(t) {
        var e = t.split(':');
        if (3 == e.length) {
            var a = parseInt(e[0]), i = parseInt(e[1]), r = e[2].indexOf('('), n = e[2].indexOf(')');
            if (-1 != r && -1 != n) var o = parseInt(e[2].substr(0, r)), s = parseInt(e[2].substring(r + 1, n)); else o = parseInt(e[2]), 
            s = 0;
            if (!(isNaN(a) || a < 0 || a > 26 || isNaN(i) || i < 0 || i > 59 || isNaN(o) || o < 0 || o > 59)) {
                var c = (24 * s * 60 * 60 + 60 * a * 60 + 60 * i + o) / 86400, h = Math.trunc(this.JD - .5) + .5 + c;
                this.changeJD(h), this.broadcastDateAndTime(), this.broadcastTimezone(), this.broadcastEquationOfTime(), 
                this.broadcastGeocentricCoords(), this.broadcastTopocentricCoords();
            }
        }
    }
    changeTimezoneOffset(t) {
        t = parseFloat(t), isNaN(t) || t < -12 || t > 14 || (this.timezoneOffset = t, this.broadcastTimezone());
    }
    setPlaceOfInterest(t, e) {
        this.placeOfInterest.setLongitude(t), this.placeOfInterest.setLatitude(e), this.broadcastPlaceOfInterest();
        var a = t >= 0 ? Math.trunc((t + 7.5) / 15) : Math.trunc((t - 7.5) / 15);
        this.changeTimezoneOffset(a);
    }
    recalculateJulianDateDependants() {
        this.determineTopocentricValues(), this.broadcastTopocentricCoords();
    }
    recalculateTimezoneDependants() {
        this.determineTopocentricValues(), this.broadcastTopocentricCoords();
    }
    recalculateLongitudeDependants() {}
    recalculateLatitudeDependants() {
        this.determineTopocentricValues(), this.broadcastTopocentricCoords();
    }
    recalculateDeclinationDependants() {}
    recalculatePlaceOfInterestDependants() {
        this.determineTopocentricValues(), this.broadcastTopocentricCoords();
    }
    getNumberDaysInYear() {
        return this.isLeapYear ? 366 : 365;
    }
    numMinutesSinceMidnightLocal() {
        return 60 * this.UTC.getUTCHours() + this.UTC.getUTCMinutes() + 60 * this.timezoneOffset;
    }
    determineAll() {
        this.determineYear(), this.determineIsLeapYear(), this.determineDayOfYear(), this.determineT(), 
        this.determineEquationOfTimeValues(), this.determineGeocentricValues(), this.determineTopocentricValues();
    }
    determineYear() {
        this.year = this.UTC.getUTCFullYear();
    }
    determineIsLeapYear() {
        this.isLeapYear = EarthPosition.isLeapYear(this.year);
    }
    determineDayOfYear() {
        var t = new Date(Date.UTC(this.year, 0, 1));
        this.dayOfYear = Math.floor((this.UTC - t) / 864e5) + 1;
    }
    determineT() {
        this.T = calcTimeJulianCent(this.JD);
    }
    determineEquationOfTimeValues() {
        this.equationOfTime = calcEquationOfTime(this.T);
    }
    determineGeocentricValues() {
        this.rightAscension = calcSunRtAscension(this.T), this.declination = calcSunDeclination(this.T), 
        this.perihelion = lookupPerihelion(this.year), this.aphelion = lookupAphelion(this.year);
        var t = calcSunRadVector(this.T);
        this.distanceInKm = calcDistanceInKm(t), this.distanceVariance = calcDeltaMeanDistance(t);
    }
    determineTopocentricValues() {
        var t = this.placeOfInterest.latitude, e = this.placeOfInterest.longitude, a = this.numMinutesSinceMidnightLocal(), i = (this.declination, 
        calcAzEl(this.T, a, t, e, this.timezoneOffset));
        this.azimuth = i.azimuth, this.altitude = i.elevation, this.sunriseHourAngle = calcHourAngleSunrise(t, this.declination), 
        this.sunrise = calcSunriseSet(1, this.JD, t, e, this.timezoneOffset), this.solarNoon = calcSolNoon(this.JD, e, this.timezoneOffset), 
        this.sunset = calcSunriseSet(0, this.JD, t, e, this.timezoneOffset);
        var r = calcAzEl(calcTimeJulianCent(this.JD - .00069444444), a, t, e, this.timezoneOffset);
        this.solarPhase = calcSolarPhase(this.altitude, r.elevation);
    }
    static isLeapYear(t) {
        if (t = parseInt(t), !isNaN(t)) return t > 1582 ? t % 4 == 0 && (t % 400 == 0 || t % 100 != 0) : t > 0 ? t % 4 == 0 : 0 == t ? void 0 : t > -46 ? !![ -44, -41, -38, -35, -32, -29, -26, -23, -20, -17, -14, -11, -8 ].includes(t) : void 0;
    }
};

function convertUTCtoJD(t) {
    var e = t.getUTCFullYear(), a = t.getUTCMonth(), i = t.getUTCDate(), r = t.getUTCHours(), n = t.getUTCMinutes(), o = t.getUTCSeconds();
    return getJD(e, a + 1, i) + (3600 * r + 60 * n + o) / 86400;
}

function convertJDtoUTC(t) {
    var e = calcDateFromJD(t), a = Math.trunc(e.day), i = e.day - a, r = Math.round(86400 * i), n = Math.floor(r / 3600), o = r - 3600 * n, s = Math.floor(o / 60);
    o -= 60 * s;
    var c = Math.trunc(o), h = Date.UTC(e.year, e.month - 1, a, n, s, c);
    return new Date(h);
}

function lookupPerihelion(t) {
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
    }[t];
    return void 0 == e ? 'unavailable' : `${e[0]} Jan ${e[1].toString().padStart(2, '0')}:${e[2].toString().padStart(2, '0')}:00`;
}

function lookupAphelion(t) {
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
    }[t];
    return void 0 == e ? 'unavailable' : `${e[0]} Jul ${e[1].toString().padStart(2, '0')}:${e[2].toString().padStart(2, '0')}:00`;
}

function calcGeomMeanLongSun(t) {
    for (var e = 280.46646 + t * (36000.76983 + 3032e-7 * t); e > 360; ) e -= 360;
    for (;e < 0; ) e += 360;
    return e;
}

function calcGeomMeanAnomalySun(t) {
    return 357.52911 + t * (35999.05029 - 1537e-7 * t);
}

function calcEccentricityEarthOrbit(t) {
    return .016708634 - t * (42037e-9 + 1.267e-7 * t);
}

function calcSunEqOfCenter(t) {
    var e = degToRad(calcGeomMeanAnomalySun(t));
    return Math.sin(e) * (1.914602 - t * (.004817 + 14e-6 * t)) + Math.sin(e + e) * (.019993 - 101e-6 * t) + 289e-6 * Math.sin(e + e + e);
}

function calcSunTrueLong(t) {
    return calcGeomMeanLongSun(t) + calcSunEqOfCenter(t);
}

function calcSunTrueAnomaly(t) {
    return calcGeomMeanAnomalySun(t) + calcSunEqOfCenter(t);
}

function calcSunRadVector(t) {
    var e = calcSunTrueAnomaly(t), a = calcEccentricityEarthOrbit(t);
    return 1.000001018 * (1 - a * a) / (1 + a * Math.cos(degToRad(e)));
}

function calcDistanceInKm(t) {
    var e = 149597870.7 * t;
    return `${Math.trunc(e).toLocaleString()} km`;
}

function calcDeltaMeanDistance(t) {
    return t < 1 ? `${(100 * (1 - t)).toFixed(2)}% closer than average` : `${(100 * (t - 1)).toFixed(2)}% farther than average`;
}

function calcSunApparentLong(t) {
    var e = 125.04 - 1934.136 * t;
    return calcSunTrueLong(t) - .00569 - .00478 * Math.sin(degToRad(e));
}

function calcMeanObliquityOfEcliptic(t) {
    return 23 + (26 + (21.448 - t * (46.815 + t * (59e-5 - .001813 * t))) / 60) / 60;
}

function calcObliquityCorrection(t) {
    var e = 125.04 - 1934.136 * t;
    return calcMeanObliquityOfEcliptic(t) + .00256 * Math.cos(degToRad(e));
}

function calcSunRtAscension(t) {
    var e = calcObliquityCorrection(t), a = calcSunApparentLong(t), i = Math.cos(degToRad(e)) * Math.sin(degToRad(a)), r = Math.cos(degToRad(a));
    return radToDeg(Math.atan2(i, r));
}

function calcSunDeclination(t) {
    var e = calcObliquityCorrection(t), a = calcSunApparentLong(t), i = Math.sin(degToRad(e)) * Math.sin(degToRad(a));
    return radToDeg(Math.asin(i));
}

function calcEquationOfTime(t) {
    var e = calcObliquityCorrection(t), a = calcGeomMeanLongSun(t), i = calcEccentricityEarthOrbit(t), r = calcGeomMeanAnomalySun(t), n = Math.tan(degToRad(e) / 2);
    n *= n;
    var o = Math.sin(2 * degToRad(a)), s = Math.sin(degToRad(r));
    return 4 * radToDeg(n * o - 2 * i * s + 4 * i * n * s * Math.cos(2 * degToRad(a)) - .5 * n * n * Math.sin(4 * degToRad(a)) - 1.25 * i * i * Math.sin(2 * degToRad(r)));
}

function calcHourAngleSunrise(t, e) {
    var a = degToRad(t), i = degToRad(e), r = Math.cos(degToRad(90.833)) / (Math.cos(a) * Math.cos(i)) - Math.tan(a) * Math.tan(i);
    return Math.acos(r);
}

function getJD(t, e, a) {
    e <= 2 && (t -= 1, e += 12);
    var i = Math.floor(t / 100), r = 2 - i + Math.floor(i / 4);
    return Math.floor(365.25 * (t + 4716)) + Math.floor(30.6001 * (e + 1)) + a + r - 1524.5;
}

function calcRefraction(t) {
    if (t > 85) var e = 0; else {
        var a = Math.tan(degToRad(t));
        if (t > 5) e = 58.1 / a - .07 / (a * a * a) + 86e-6 / (a * a * a * a * a); else if (t > -.575) e = 1735 + t * (t * (103.4 + t * (.711 * t - 12.79)) - 518.2); else e = -20.774 / a;
        e /= 3600;
    }
    return e;
}

function calcAzEl(t, e, a, i, r) {
    for (var n = calcEquationOfTime(t), o = calcSunDeclination(t), s = e + (n + 4 * i - 60 * r); s > 1440; ) s -= 1440;
    var c = s / 4 - 180;
    c < -180 && (c += 360);
    var h = degToRad(c), l = Math.sin(degToRad(a)) * Math.sin(degToRad(o)) + Math.cos(degToRad(a)) * Math.cos(degToRad(o)) * Math.cos(h);
    l > 1 ? l = 1 : l < -1 && (l = -1);
    var u = radToDeg(Math.acos(l)), d = Math.cos(degToRad(a)) * Math.sin(degToRad(u));
    if (Math.abs(d) > .001) {
        var T = (Math.sin(degToRad(a)) * Math.cos(degToRad(u)) - Math.sin(degToRad(o))) / d;
        Math.abs(T) > 1 && (T = T < 0 ? -1 : 1);
        var f = 180 - radToDeg(Math.acos(T));
        c > 0 && (f = -f);
    } else if (a > 0) f = 180; else f = 0;
    return f < 0 && (f += 360), {
        azimuth: f,
        elevation: 90 - (u - calcRefraction(90 - u))
    };
}

function calcSolNoon(t, e, a) {
    for (var i = calcEquationOfTime(calcTimeJulianCent(t - e / 360)), r = 720 - 4 * e - (i = calcEquationOfTime(calcTimeJulianCent(t + (720 - 4 * e - i) / 1440))) + 60 * a; r < 0; ) r += 1440;
    for (;r >= 1440; ) r -= 1440;
    return r;
}

function calcSolarPhase(t, e) {
    var a = e < t ? 'dusk' : 'dawn';
    return t < -18 ? 'night' : t < -12 ? `astronomical ${a}` : t < -6 ? `nautical ${a}` : t < 0 ? `civil ${a}` : 'daylight';
}

function calcSunriseSetUTC(t, e, a, i) {
    var r = calcTimeJulianCent(e), n = calcEquationOfTime(r), o = calcHourAngleSunrise(a, calcSunDeclination(r));
    return t || (o = -o), 720 - 4 * (i + radToDeg(o)) - n;
}

function calcSunriseSet(t, e, a, i, r) {
    var n = calcSunriseSetUTC(t, e + calcSunriseSetUTC(t, e, a, i) / 1440, a, i);
    if (isNumber(n)) {
        var o = n + 60 * r, s = calcAzEl(calcTimeJulianCent(e + n / 1440), o, a, i, r).azimuth, c = e;
        if (o < 0 || o >= 1440) for (var h = o < 0 ? 1 : -1; o < 0 || o >= 1440; ) o += 1440 * h, 
        c -= h;
    } else {
        if (90 == a || -90 == a) return {
            jday: null,
            timelocal: null,
            azimuth: null
        };
        s = -1, o = 0;
        var l = calcDoyFromJD(e);
        c = calcJDofNextPrevRiseSet(a > 66.4 && l > 79 && l < 267 || a < -66.4 && (l < 83 || l > 263) ? !t : t, t, e, a, i, r);
    }
    return {
        jday: c,
        timelocal: o,
        azimuth: s
    };
}

function calcJDofNextPrevRiseSet(t, e, a, i, r, n) {
    for (var o = a, s = t ? 1 : -1, c = calcSunriseSetUTC(e, o, i, r); !isNumber(c); ) c = calcSunriseSetUTC(e, o += s, i, r);
    for (var h = c + 60 * n; h < 0 || h >= 1440; ) {
        var l = h < 0 ? 1 : -1;
        h += 1440 * l, o -= l;
    }
    return o;
}

function calcTimeJulianCent(t) {
    return (t - 2451545) / 36525;
}

function calcJDFromJulianCent(t) {
    return 36525 * t + 2451545;
}

function isLeapYear(t) {
    return t % 4 == 0 && t % 100 != 0 || t % 400 == 0;
}

function calcDateFromJD(t) {
    var e = Math.floor(t + .5), a = t + .5 - e;
    if (e < 2299161) var i = e; else {
        var r = Math.floor((e - 1867216.25) / 36524.25);
        i = e + 1 + r - Math.floor(r / 4);
    }
    var n = i + 1524, o = Math.floor((n - 122.1) / 365.25), s = Math.floor(365.25 * o), c = Math.floor((n - s) / 30.6001), h = n - s - Math.floor(30.6001 * c) + a, l = c < 14 ? c - 1 : c - 13;
    return {
        year: l > 2 ? o - 4716 : o - 4715,
        month: l,
        day: h
    };
}

function calcDoyFromJD(t) {
    var e = calcDateFromJD(t), a = isLeapYear(e.year) ? 1 : 2;
    return Math.floor(275 * e.month / 9) - a * Math.floor((e.month + 9) / 12) + e.day - 30;
}

function radToDeg(t) {
    return 180 * t / Math.PI;
}

function degToRad(t) {
    return Math.PI * t / 180;
}

function isNumber(t) {
    for (var e = !1, a = '' + t, i = 0; i < a.length; i++) {
        var r = a.charAt(i);
        if (0 != i || '-' != r && '+' != r) if ('.' != r || e) {
            if (r < '0' || r > '9') return !1;
        } else e = !0;
    }
    return !0;
}

function calculateEquinoxSolstice(t, e) {
    if (t < 0 || t > 3) return null;
    if (null == e) return null;
    var a = determineUncorrectedTime(t, e), i = (a - 2451545) / 36525, r = 35999.373 * i - 2.47, n = 1 + .0334 * COS(r) + 7e-4 * COS(2 * r), o = a + 1e-5 * periodicTerms(i) / n, s = fromJDtoUTC(o);
    return {
        'Julian Ephemeris Days': o,
        'Terrestrial Dynamical Time': s,
        'Coordinated Universal Time': fromTDTtoUTC(s)
    };
}

function determineUncorrectedTime(t, e) {
    var a = 0, i = (e - 2e3) / 1e3;
    switch (t) {
      case 0:
        a = 2451623.80984 + 365242.37404 * i + .05169 * POW2(i) - .00411 * POW3(i) - 57e-5 * POW4(i);
        break;

      case 1:
        a = 2451716.56767 + 365241.62603 * i + .00325 * POW2(i) + .00888 * POW3(i) - 3e-4 * POW4(i);
        break;

      case 2:
        a = 2451810.21715 + 365242.01767 * i - .11575 * POW2(i) + .00337 * POW3(i) + 78e-5 * POW4(i);
        break;

      case 3:
        a = 2451900.05952 + 365242.74049 * i - .06223 * POW2(i) - .00823 * POW3(i) + 32e-5 * POW4(i);
    }
    return a;
}

function periodicTerms(t) {
    var e = new Array(485, 203, 199, 182, 156, 136, 77, 74, 70, 58, 52, 50, 45, 44, 29, 18, 17, 16, 14, 12, 12, 12, 9, 8), a = new Array(324.96, 337.23, 342.08, 27.85, 73.14, 171.52, 222.54, 296.72, 243.58, 119.81, 297.17, 21.02, 247.54, 325.15, 60.93, 155.12, 288.79, 198.04, 199.76, 95.39, 287.11, 320.81, 227.73, 15.45), i = new Array(1934.136, 32964.467, 20.186, 445267.112, 45036.886, 22518.443, 65928.934, 3034.906, 9037.513, 33718.147, 150.678, 2281.226, 29929.562, 31555.956, 4443.417, 67555.328, 4562.452, 62894.029, 31436.921, 14577.848, 31931.756, 34777.259, 1222.114, 16859.074), r = 0;
    for (let n = 0; n < 24; n++) r += e[n] * COS(a[n] + i[n] * t);
    return r;
}

function fromTDTtoUTC(t) {
    var e = new Array(121, 112, 103, 95, 88, 82, 77, 72, 68, 63, 60, 56, 53, 51, 48, 46, 44, 42, 40, 38, 35, 33, 31, 29, 26, 24, 22, 20, 18, 16, 14, 12, 11, 10, 9, 8, 7, 7, 7, 7, 7, 7, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 15, 15, 14, 13, 13.1, 12.5, 12.2, 12, 12, 12, 12, 12, 12, 11.9, 11.6, 11, 10.2, 9.2, 8.2, 7.1, 6.2, 5.6, 5.4, 5.3, 5.4, 5.6, 5.9, 6.2, 6.5, 6.8, 7.1, 7.3, 7.5, 7.6, 7.7, 7.3, 6.2, 5.2, 2.7, 1.4, -1.2, -2.8, -3.8, -4.8, -5.5, -5.3, -5.6, -5.7, -5.9, -6, -6.3, -6.5, -6.2, -4.7, -2.8, -.1, 2.6, 5.3, 7.7, 10.4, 13.3, 16, 18.2, 20.2, 21.1, 22.4, 23.5, 23.8, 24.3, 24, 23.9, 23.9, 23.7, 24, 24.3, 25.3, 26.2, 27.3, 28.2, 29.1, 30, 30.7, 31.4, 32.2, 33.1, 34, 35, 36.5, 38.3, 40.2, 42.2, 44.5, 46.5, 48.5, 50.5, 52.5, 53.8, 54.9, 55.8, 56.9, 58.3, 60, 61.6, 63, 63.8, 64.3), a = 0, i = t.getUTCFullYear(), r = (i - 2e3) / 100;
    return i >= 1620 && i <= 2002 ? a = i % 2 ? (e[(i - 1620 - 1) / 2] + e[(i - 1620 + 1) / 2]) / 2 : e[(i - 1620) / 2] : i < 948 ? a = 2177 + 497 * r + 44.1 * POW2(r) : i >= 948 ? (a = 102 + 102 * r + 25.3 * POW2(r), 
    i >= 2e3 && i <= 2100 && (a += .37 * (i - 2100))) : alert('Error: TDT to UTC correction not computed'), 
    new Date(t.getTime() - 1e3 * a);
}

function fromJDtoUTC(t) {
    var e, a = INT(t + .5), i = t + .5 - a, r = (a < 2299161 ? a : a + 1 + (e = INT((a - 1867216.25) / 36524.25)) - INT(e / 4)) + 1524, n = INT((r - 122.1) / 365.25), o = INT(365.25 * n), s = INT((r - o) / 30.6001), c = r - o - INT(30.6001 * s) + i, h = s - (s < 13.5 ? 1 : 13), l = n - (h > 2.5 ? 4716 : 4715), u = INT(c), d = 24 * (c - u), T = INT(d), f = 60 * (d - T), m = INT(f), g = INT(60 * (f - m)), O = new Date(0);
    return O.setUTCFullYear(l, h - 1, u), O.setUTCHours(T, m, g), O;
}

function INT(t) {
    return Math.floor(t);
}

function POW2(t) {
    return Math.pow(t, 2);
}

function POW3(t) {
    return Math.pow(t, 3);
}

function POW4(t) {
    return Math.pow(t, 4);
}

function COS(t) {
    return Math.cos(t * Math.PI / 180);
}