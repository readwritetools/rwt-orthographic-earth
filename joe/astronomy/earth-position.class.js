/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
const radiansToDegrees = 180 / Math.PI;

import ProjectedPoint from '../projection/projected-point.class.js';

import * as AA from './astronomical-algorithms.js';

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
        t.setUTCSeconds(this.UTC.getUTCSeconds()), this.UTC = t, this.JD = AA.convertUTCtoJD(t), 
        this.determineAll(), this.broadcastDateAndTime(), this.broadcastTimezone(), this.broadcastEquationOfTime(), 
        this.broadcastGeocentricCoords(), this.broadcastTopocentricCoords());
    }
    changeUTC(t) {
        'Date' == t.constructor.name && (this.UTC = t, this.JD = AA.convertUTCtoJD(t), this.determineAll(), 
        this.broadcastDateAndTime(), this.broadcastTimezone(), this.broadcastEquationOfTime(), 
        this.broadcastGeocentricCoords(), this.broadcastTopocentricCoords());
    }
    changeJD(t) {
        'Number' == t.constructor.name && (this.JD = t, this.UTC = AA.convertJDtoUTC(t), 
        this.determineAll(), this.broadcastDateAndTime(), this.broadcastTimezone(), this.broadcastEquationOfTime(), 
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
            var e = AA.calculateEquinoxSolstice(0, this.year);
            break;

          case 'JuneSolstice':
            e = AA.calculateEquinoxSolstice(1, this.year);
            break;

          case 'SeptemberEquinox':
            e = AA.calculateEquinoxSolstice(2, this.year);
            break;

          case 'DecemberSolstice':
            e = AA.calculateEquinoxSolstice(3, this.year);
            break;

          default:
            return;
        }
        var i = e['Coordinated Universal Time'];
        this.changeUTC(i), this.rwtOrthographicEarth.broadcastMessage('earthPosition/dayOfYear', this.dayOfYear), 
        this.rwtOrthographicEarth.broadcastMessage('earthPosition/civilDate', this.UTC), 
        this.rwtOrthographicEarth.broadcastMessage('earthPosition/timeOfDayHMS', this.UTC), 
        this.rwtOrthographicEarth.broadcastMessage('earthPosition/specialDay', t), this.broadcastTimezone(), 
        this.broadcastEquationOfTime(), this.broadcastGeocentricCoords(), this.broadcastTopocentricCoords();
    }
    changeTimeOfDayHMS(t) {
        var e = t.split(':');
        if (3 == e.length) {
            var i = parseInt(e[0]), s = parseInt(e[1]), a = e[2].indexOf('('), r = e[2].indexOf(')');
            if (-1 != a && -1 != r) var o = parseInt(e[2].substr(0, a)), n = parseInt(e[2].substring(a + 1, r)); else o = parseInt(e[2]), 
            n = 0;
            if (!(isNaN(i) || i < 0 || i > 26 || isNaN(s) || s < 0 || s > 59 || isNaN(o) || o < 0 || o > 59)) {
                var h = (24 * n * 60 * 60 + 60 * i * 60 + 60 * s + o) / 86400, c = Math.trunc(this.JD - .5) + .5 + h;
                this.changeJD(c), this.broadcastDateAndTime(), this.broadcastTimezone(), this.broadcastEquationOfTime(), 
                this.broadcastGeocentricCoords(), this.broadcastTopocentricCoords();
            }
        }
    }
    changeTimezoneOffset(t) {
        t = parseFloat(t), isNaN(t) || t < -12 || t > 14 || (this.timezoneOffset = t, this.broadcastTimezone());
    }
    setPlaceOfInterest(t, e) {
        this.placeOfInterest.setLongitude(t), this.placeOfInterest.setLatitude(e), this.broadcastPlaceOfInterest();
        var i = t >= 0 ? Math.trunc((t + 7.5) / 15) : Math.trunc((t - 7.5) / 15);
        this.changeTimezoneOffset(i);
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
        this.T = AA.calcTimeJulianCent(this.JD);
    }
    determineEquationOfTimeValues() {
        this.equationOfTime = AA.calcEquationOfTime(this.T);
    }
    determineGeocentricValues() {
        this.rightAscension = AA.calcSunRtAscension(this.T), this.declination = AA.calcSunDeclination(this.T), 
        this.perihelion = AA.lookupPerihelion(this.year), this.aphelion = AA.lookupAphelion(this.year);
        var t = AA.calcSunRadVector(this.T);
        this.distanceInKm = AA.calcDistanceInKm(t), this.distanceVariance = AA.calcDeltaMeanDistance(t);
    }
    determineTopocentricValues() {
        var t = this.placeOfInterest.latitude, e = this.placeOfInterest.longitude, i = this.numMinutesSinceMidnightLocal(), s = (this.declination, 
        AA.calcAzEl(this.T, i, t, e, this.timezoneOffset));
        this.azimuth = s.azimuth, this.altitude = s.elevation, this.sunriseHourAngle = AA.calcHourAngleSunrise(t, this.declination), 
        this.sunrise = AA.calcSunriseSet(1, this.JD, t, e, this.timezoneOffset), this.solarNoon = AA.calcSolNoon(this.JD, e, this.timezoneOffset), 
        this.sunset = AA.calcSunriseSet(0, this.JD, t, e, this.timezoneOffset);
        var a = AA.calcTimeJulianCent(this.JD - .00069444444), r = AA.calcAzEl(a, i, t, e, this.timezoneOffset);
        this.solarPhase = AA.calcSolarPhase(this.altitude, r.elevation);
    }
    static isLeapYear(t) {
        if (t = parseInt(t), !isNaN(t)) return t > 1582 ? t % 4 == 0 && (t % 400 == 0 || t % 100 != 0) : t > 0 ? t % 4 == 0 : 0 == t ? void 0 : t > -46 ? !![ -44, -41, -38, -35, -32, -29, -26, -23, -20, -17, -14, -11, -8 ].includes(t) : void 0;
    }
}