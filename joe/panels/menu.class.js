/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
const Static = {
    rwtDockablePanels: '/node_modules/rwt-dockable-panels/rwt-dockable-panels.js'
};

Object.seal(Static);

import PanelsConfig from './panels-config.js';

import * as CB from './panel-callbacks.js';

import EarthPosition from '../astronomy/earth-position.class.js';

export default class Menu {
    constructor(t) {
        this.rwtOrthographicEarth = t, this.rwtDockablePanels = null;
    }
    async initialize() {
        this.initializeCSS(), await this.instantiateComponent(), await this.rwtDockablePanels.waitOnLoading().then((() => {
            this.configureDockablePanels(), this.rwtDockablePanels.setTitlebar(PanelsConfig.toolbar.titlebar), 
            this.rwtDockablePanels.closeToolbar(), this.rwtDockablePanels.style.display = 'block';
        }));
    }
    initializeCSS() {
        var t = document.createElement('style');
        t.innerHTML = '\n\t\t\trwt-dockable-panels {\n\t\t\t    --top:  3px;\n\t\t\t    --right: 3px;\n\t\t\t}', 
        this.rwtOrthographicEarth.shadowRoot.appendChild(t);
    }
    async instantiateComponent() {
        await import(Static.rwtDockablePanels), this.rwtDockablePanels = document.createElement('rwt-dockable-panels'), 
        this.rwtDockablePanels.setAttribute('id', 'dockable-panels'), this.rwtDockablePanels.setAttribute('corner', 'top-right'), 
        this.rwtDockablePanels.setAttribute('role', 'contentinfo'), this.rwtDockablePanels.setAttribute('opened', 'opened'), 
        this.rwtDockablePanels.style.display = 'none', this.rwtOrthographicEarth.shadowRoot.appendChild(this.rwtDockablePanels);
    }
    configureDockablePanels() {
        if (0 != this.rwtOrthographicEarth.hasAttribute('panels')) {
            var t = this.rwtOrthographicEarth.getAttribute('panels');
            if (null != t && '' != t) {
                var e = t.split(' ');
                for (let t = 0; t < e.length; t++) {
                    var a = e[t], r = this.getPanelConfigById(a);
                    null == r ? console.log(`No panel configuration defined for '${a}'`) : (this.rwtDockablePanels.appendPanel(a, r.options, r.panelLines), 
                    this.registerListeners(a), this.changeNotifiers(a));
                }
            }
        }
    }
    getPanelConfigById(t) {
        for (let e = 0; e < PanelsConfig.panels.length; e++) if (PanelsConfig.panels[e].options.id == t) return PanelsConfig.panels[e];
        return null;
    }
    changeNotifiers(t) {
        switch (t) {
          case 'season':
            return (o = this.rwtDockablePanels.shadowRoot.getElementById('season-dmy-utc')).addEventListener('change', (() => {
                var t = CB.fromUserDayMonthYear(o.value), e = CB.toUserDayMonthYear(t);
                o.value = e, this.rwtOrthographicEarth.broadcastMessage('menu/seasonDayMonthYearUTC', t);
            })), (s = this.rwtDockablePanels.shadowRoot.getElementById('season-special-day')).addEventListener('change', (() => {
                this.rwtOrthographicEarth.broadcastMessage('menu/seasonSpecialDay', s.value);
            })), (i = this.rwtDockablePanels.shadowRoot.getElementById('season-day-of-year')).addEventListener('change', (() => {
                this.rwtOrthographicEarth.broadcastMessage('menu/seasonDayOfYear', i.value);
            })), void (n = this.rwtDockablePanels.shadowRoot.getElementById('season-day-of-year-slider')).addEventListener('input', (() => {
                this.rwtOrthographicEarth.broadcastMessage('menu/seasonDayOfYear', n.value);
            }));

          case 'time-of-day':
            return (o = this.rwtDockablePanels.shadowRoot.getElementById('time-of-day-hms')).addEventListener('change', (() => {
                var t = CB.fromUserTimeOfDay(o.value), e = CB.toUserTimeOfDay(t);
                this.rwtOrthographicEarth.broadcastMessage('menu/timeOfDayHMS', e);
            })), (s = this.rwtDockablePanels.shadowRoot.getElementById('time-of-day-hms-slider')).addEventListener('input', (() => {
                var t = CB.fromSliderTimeOfDay(s.value), e = CB.toUserTimeOfDay(t);
                this.rwtOrthographicEarth.broadcastMessage('menu/timeOfDayHMS', e);
            })), void (i = this.rwtDockablePanels.shadowRoot.getElementById('timezone-offset')).addEventListener('change', (() => {
                this.rwtOrthographicEarth.broadcastMessage('menu/timezoneOffset', i.value);
            }));

          case 'point-of-reference':
            (o = this.rwtDockablePanels.shadowRoot.getElementById('named-longitude')).addEventListener('change', (() => {
                var t = o.value;
                this.rwtOrthographicEarth.broadcastMessage('menu/tangentLongitude', t);
            })), (s = this.rwtDockablePanels.shadowRoot.getElementById('longitude-pov')).addEventListener('change', (() => {
                var t = CB.fromUserLongitude(s.value);
                this.rwtOrthographicEarth.broadcastMessage('menu/tangentLongitude', t);
            })), (i = this.rwtDockablePanels.shadowRoot.getElementById('longitude-pov-slider')).addEventListener('input', (() => {
                var t = i.value;
                this.rwtOrthographicEarth.broadcastMessage('menu/tangentLongitude', t);
            })), (n = this.rwtDockablePanels.shadowRoot.getElementById('named-latitude')).addEventListener('change', (() => {
                var t = n.value;
                this.rwtOrthographicEarth.broadcastMessage('menu/tangentLatitude', t);
            }));
            var e = this.rwtDockablePanels.shadowRoot.getElementById('latitude-pov');
            e.addEventListener('change', (() => {
                var t = CB.fromUserLatitude(e.value);
                this.rwtOrthographicEarth.broadcastMessage('menu/tangentLatitude', t);
            }));
            var a = this.rwtDockablePanels.shadowRoot.getElementById('latitude-pov-slider');
            return void a.addEventListener('input', (() => {
                var t = a.value;
                this.rwtOrthographicEarth.broadcastMessage('menu/tangentLatitude', t);
            }));

          case 'equation-of-time':
          case 'solar-events':
          case 'geocentric-coords':
          case 'topocentric-coords':
            return;

          case 'zoom':
            var r = this.rwtDockablePanels.shadowRoot.getElementById('map-scale');
            return r.addEventListener('change', (() => {
                this.rwtOrthographicEarth.broadcastMessage('menu/mapScale', r.value);
            })), void this.rwtDockablePanels.shadowRoot.getElementById('map-scale-slider').addEventListener('input', (() => {
                this.rwtOrthographicEarth.broadcastMessage('menu/mapScale', r.value);
            }));

          case 'space':
            return (o = this.rwtDockablePanels.shadowRoot.getElementById('adjust-km-x')).addEventListener('change', (() => {
                this.rwtOrthographicEarth.broadcastMessage('menu/translationEastWest', o.value);
            })), (s = this.rwtDockablePanels.shadowRoot.getElementById('adjust-km-x-slider')).addEventListener('input', (() => {
                this.rwtOrthographicEarth.broadcastMessage('menu/translationEastWest', s.value);
            })), (i = this.rwtDockablePanels.shadowRoot.getElementById('adjust-km-y')).addEventListener('change', (() => {
                this.rwtOrthographicEarth.broadcastMessage('menu/translationNorthSouth', i.value);
            })), void (n = this.rwtDockablePanels.shadowRoot.getElementById('adjust-km-y-slider')).addEventListener('input', (() => {
                this.rwtOrthographicEarth.broadcastMessage('menu/translationNorthSouth', n.value);
            }));

          case 'canvas':
            var o, s, i, n;
            return (o = this.rwtDockablePanels.shadowRoot.getElementById('adjust-px-x')).addEventListener('change', (() => {
                this.rwtOrthographicEarth.broadcastMessage('menu/centerPointX', o.value);
            })), (s = this.rwtDockablePanels.shadowRoot.getElementById('adjust-px-x-slider')).addEventListener('input', (() => {
                this.rwtOrthographicEarth.broadcastMessage('menu/centerPointX', s.value);
            })), (i = this.rwtDockablePanels.shadowRoot.getElementById('adjust-px-y')).addEventListener('change', (() => {
                this.rwtOrthographicEarth.broadcastMessage('menu/centerPointY', i.value);
            })), void (n = this.rwtDockablePanels.shadowRoot.getElementById('adjust-px-y-slider')).addEventListener('input', (() => {
                this.rwtOrthographicEarth.broadcastMessage('menu/centerPointY', n.value);
            }));

          case 'locate':
          case 'layers':
          case 'identify':
            return;

          case 'time-lapse':
            var l = this.rwtDockablePanels.shadowRoot.getElementById('time-lapse-rotation');
            return void l.addEventListener('change', (() => {
                var t = l.value;
                this.rwtOrthographicEarth.broadcastMessage('menu/timeLapseRotation', t);
            }));

          case 'earth-orbit':
          case 'telescope':
          case 'flyby':
            return;

          default:
            console.log(`unexpected panel '${t}' when registering broadcasters`);
        }
    }
    registerListeners(t) {
        switch (t) {
          case 'season':
            return this.rwtOrthographicEarth.addEventListener('earthPosition/civilDate', (t => {
                var e = t.detail, a = e.getUTCFullYear();
                this.rwtDockablePanels.shadowRoot.getElementById('season-dmy-utc').value = CB.toUserDayMonthYear(e);
                var r = this.rwtDockablePanels.shadowRoot.getElementById('season-day-of-year-slider'), o = EarthPosition.isLeapYear(a) ? 366 : 365;
                r.setAttribute('max', o);
                var s = this.rwtDockablePanels.shadowRoot.getElementById('season-day-of-year');
                s.value > o && (s.value = o);
            })), this.rwtOrthographicEarth.addEventListener('earthPosition/specialDay', (t => {
                var e = t.detail;
                this.rwtDockablePanels.shadowRoot.getElementById('season-special-day').value = e;
            })), void this.rwtOrthographicEarth.addEventListener('earthPosition/dayOfYear', (t => {
                var e = t.detail;
                this.rwtDockablePanels.shadowRoot.getElementById('season-day-of-year').value = e, 
                this.rwtDockablePanels.shadowRoot.getElementById('season-day-of-year-slider').value = e, 
                this.rwtDockablePanels.shadowRoot.getElementById('season-special-day').value = '';
            }));

          case 'time-of-day':
            return this.rwtOrthographicEarth.addEventListener('earthPosition/timeOfDayHMS', (t => {
                var e = t.detail, a = CB.numSecondsSinceMidnightUTC(e);
                this.rwtDockablePanels.shadowRoot.getElementById('time-of-day-hms').value = CB.toUserTimeOfDay(a), 
                this.rwtDockablePanels.shadowRoot.getElementById('time-of-day-hms-slider').value = CB.toSliderTimeOfDay(a);
            })), this.rwtOrthographicEarth.addEventListener('earthPosition/timezoneOffset', (t => {
                var e = t.detail;
                this.rwtDockablePanels.shadowRoot.getElementById('timezone-offset').value = e;
            })), this.rwtOrthographicEarth.addEventListener('earthPosition/civilDate', (t => {
                var e = t.detail;
                this.rwtDockablePanels.shadowRoot.getElementById('season-civil-date').innerHTML = `<p style='text-align:center'>${e.toUTCString()}</p>`;
            })), void this.rwtOrthographicEarth.addEventListener('earthPosition/timezoneLocalTime', (t => {
                var e = t.detail;
                this.rwtDockablePanels.shadowRoot.getElementById('timezone-local-time').innerHTML = `<p style='text-align:center'>${e.isoDateTimeFormat}</p>`;
            }));

          case 'point-of-reference':
            return this.rwtOrthographicEarth.addEventListener('ortho/tangentLongitude', (t => {
                this.rwtDockablePanels.shadowRoot.getElementById('longitude-pov').value = CB.toUserLongitude(t.detail), 
                this.rwtDockablePanels.shadowRoot.getElementById('longitude-pov-slider').value = this.twoDigits(t.detail), 
                this.rwtDockablePanels.shadowRoot.getElementById('named-longitude').value = t.detail;
            })), void this.rwtOrthographicEarth.addEventListener('ortho/tangentLatitude', (t => {
                this.rwtDockablePanels.shadowRoot.getElementById('latitude-pov').value = CB.toUserLatitude(t.detail), 
                this.rwtDockablePanels.shadowRoot.getElementById('latitude-pov-slider').value = this.twoDigits(t.detail), 
                this.rwtDockablePanels.shadowRoot.getElementById('named-latitude').value = t.detail;
            }));

          case 'equation-of-time':
            return this.rwtOrthographicEarth.addEventListener('earthPosition/civilDate', (t => {
                var e = t.detail;
                this.rwtDockablePanels.shadowRoot.getElementById('equation-of-time-civil-date').innerHTML = CB.formatDateYMD(e);
            })), void this.rwtOrthographicEarth.addEventListener('earthPosition/equationOfTime', (t => {
                var e = t.detail, a = CB.formatEquationOfTime(e.equationOfTime);
                this.rwtDockablePanels.shadowRoot.getElementById('equation-of-time-sundial-correction').innerHTML = `Sundial correction: ${a}`;
            }));

          case 'solar-events':
            return void this.rwtOrthographicEarth.addEventListener('earthPosition/topocentricCoordinates', (t => {
                var e = t.detail, a = CB.formatSunriseSunset(e.sunrise), r = CB.formatHMSfromMinutes(e.solarNoon), o = CB.formatSunriseSunset(e.sunset);
                this.rwtDockablePanels.shadowRoot.getElementById('solar-events-longitude').innerHTML = CB.toUserLongitude(e.placeOfInterest.longitude), 
                this.rwtDockablePanels.shadowRoot.getElementById('solar-events-latitude').innerHTML = CB.toUserLatitude(e.placeOfInterest.latitude), 
                this.rwtDockablePanels.shadowRoot.getElementById('solar-events-timezone').innerHTML = CB.formatTimezone(e.timezoneOffset), 
                this.rwtDockablePanels.shadowRoot.getElementById('solar-events-sunrise').innerHTML = `Sunrise: ${a}`, 
                this.rwtDockablePanels.shadowRoot.getElementById('solar-events-solar-noon').innerHTML = `Solar noon: ${r}`, 
                this.rwtDockablePanels.shadowRoot.getElementById('solar-events-sunset').innerHTML = `Sunset: ${o}`;
            }));

          case 'geocentric-coords':
            return this.rwtOrthographicEarth.addEventListener('earthPosition/civilDate', (t => {
                var e = t.detail;
                this.rwtDockablePanels.shadowRoot.getElementById('geocentric-civil-date').innerHTML = CB.formatDateYMD(e);
            })), this.rwtOrthographicEarth.addEventListener('earthPosition/declination', (t => {
                var e = CB.toUserDeclination(t.detail);
                this.rwtDockablePanels.shadowRoot.getElementById('geocentric-declination').innerHTML = `Declination: ${e}`;
            })), this.rwtOrthographicEarth.addEventListener('earthPosition/rightAscension', (t => {
                var e = CB.formatRightAscensionHMS(t.detail);
                this.rwtDockablePanels.shadowRoot.getElementById('geocentric-right-ascension').innerHTML = `Right ascension: ${e}`;
            })), void this.rwtOrthographicEarth.addEventListener('earthPosition/distanceValues', (t => {
                var e = t.detail;
                this.rwtDockablePanels.shadowRoot.getElementById('geocentric-perihelion').innerHTML = `${e.year} Perihelion: ${e.perihelion}`, 
                this.rwtDockablePanels.shadowRoot.getElementById('geocentric-aphelion').innerHTML = `${e.year} Aphelion: ${e.aphelion}`;
            }));

          case 'topocentric-coords':
            return this.rwtOrthographicEarth.addEventListener('earthPosition/timezoneLocalTime', (t => {
                var e = t.detail;
                this.rwtDockablePanels.shadowRoot.getElementById('topocentric-local-time').innerHTML = e.hmsTimeFormat;
            })), void this.rwtOrthographicEarth.addEventListener('earthPosition/topocentricCoordinates', (t => {
                var e = t.detail, a = CB.formatAltitude(e.altitude), r = CB.formatAzimuth(e.azimuth), o = CB.formatHourAngle(e.sunriseHourAngle), s = e.solarPhase;
                this.rwtDockablePanels.shadowRoot.getElementById('topocentric-longitude').innerHTML = CB.toUserLongitude(e.placeOfInterest.longitude), 
                this.rwtDockablePanels.shadowRoot.getElementById('topocentric-latitude').innerHTML = CB.toUserLatitude(e.placeOfInterest.latitude), 
                this.rwtDockablePanels.shadowRoot.getElementById('topocentric-altitude').innerHTML = `Altitude: ${a}`, 
                this.rwtDockablePanels.shadowRoot.getElementById('topocentric-azimuth').innerHTML = `Azimuth: ${r}`, 
                this.rwtDockablePanels.shadowRoot.getElementById('topocentric-sunrise-hour-angle').innerHTML = `Hour angle: ${o}`, 
                this.rwtDockablePanels.shadowRoot.getElementById('topocentric-solar-phase').innerHTML = `Visibility: ${s}`;
            }));

          case 'zoom':
            return void this.rwtOrthographicEarth.addEventListener('carte/mapScale', (t => {
                var e = parseFloat(t.detail);
                e <= 10 ? e = e.toFixed(1) : (e > 20 && (e = 2 * Math.round(e / 2)), e > 40 && (e = 5 * Math.round(e / 5)), 
                e > 100 && (e = 10 * Math.round(e / 10)), e > 200 && (e = 20 * Math.round(e / 20)), 
                e > 500 && (e = 50 * Math.round(e / 50)), e = e.toFixed(0)), this.rwtDockablePanels.shadowRoot.getElementById('map-scale').value = e, 
                this.rwtDockablePanels.shadowRoot.getElementById('map-scale-slider').value = this.valueToSliderPosition(1, 100, 1, 1e3, t.detail);
                var a = this.rwtDockablePanels.shadowRoot.getElementById('adjust-km-x-slider'), r = this.rwtDockablePanels.shadowRoot.getElementById('adjust-km-y-slider'), o = this.rwtOrthographicEarth.canvas.width, s = this.rwtOrthographicEarth.canvas.height, i = this.rwtOrthographicEarth.earth.getVisualizedRadius(), n = Math.round(e * (o + i) / 2), l = Math.round(e * (s + i) / 2), d = Math.round(2 * n / 100), h = Math.round(2 * l / 100);
                null != a && null != r && (a.setAttribute('min', -1 * n), a.setAttribute('max', n), 
                a.setAttribute('step', d), r.setAttribute('min', -1 * l), r.setAttribute('max', l), 
                r.setAttribute('step', h));
            }));

          case 'space':
            return this.rwtOrthographicEarth.addEventListener('carte/translationEastWest', (t => {
                var e = parseInt(t.detail);
                this.rwtDockablePanels.shadowRoot.getElementById('adjust-km-x').value = e, this.rwtDockablePanels.shadowRoot.getElementById('adjust-km-x-slider').value = e;
            })), void this.rwtOrthographicEarth.addEventListener('carte/translationNorthSouth', (t => {
                var e = parseInt(t.detail);
                this.rwtDockablePanels.shadowRoot.getElementById('adjust-km-y').value = e, this.rwtDockablePanels.shadowRoot.getElementById('adjust-km-y-slider').value = e;
            }));

          case 'canvas':
            return this.rwtOrthographicEarth.addEventListener('viewport/centerPointX', (t => {
                var e = parseInt(t.detail);
                this.rwtDockablePanels.shadowRoot.getElementById('adjust-px-x').value = e, this.rwtDockablePanels.shadowRoot.getElementById('adjust-px-x-slider').value = e;
            })), void this.rwtOrthographicEarth.addEventListener('viewport/centerPointY', (t => {
                var e = parseInt(t.detail);
                this.rwtDockablePanels.shadowRoot.getElementById('adjust-px-y').value = e, this.rwtDockablePanels.shadowRoot.getElementById('adjust-px-y-slider').value = e;
            }));

          case 'locate':
            return void this.rwtOrthographicEarth.addEventListener('user/latitudeLongitude', (t => {
                var e = t.detail;
                if (null == e.longitude || null == e.latitude || 1 != e.isOnEarth) this.rwtDockablePanels.shadowRoot.getElementById('locate-position').innerHTML = ''; else {
                    var a = Math.abs(e.longitude.toFixed(2)), r = e.longitude < 0 ? a + '° W' : a + '° E', o = Math.abs(e.latitude.toFixed(2)), s = `longitude: ${r}<br />latitude: ${e.latitude < 0 ? o + '° S' : o + '° N'}`;
                    this.rwtDockablePanels.shadowRoot.getElementById('locate-position').innerHTML = s;
                }
            }));

          case 'layers':
            return this.rwtOrthographicEarth.addEventListener('catalog/packageAdded', (t => {
                var e = t.detail, a = e.id, r = e.identifiable;
                if ('disallow' == r) var o = ''; else o = `<input id=layers-${a}-identifiable type=checkbox data-layer-id=${a} ${'yes' == r ? 'checked' : ''} />`;
                var s = e.layerName, i = this.rwtDockablePanels.shadowRoot.getElementById('layers-table'), n = document.createElement('tr');
                n.id = `layers-${a}`, n.innerHTML = `\n\t\t\t\t\t\t<td class='chef-center'><input id=layers-${a}-visible type=checkbox data-layer-id=${a} checked /></td>\t\t\t\t\t\n\t\t\t\t\t\t<td class='chef-center'>${o}</td>\t\t\t\t\t\n\t\t\t\t\t\t<td style='padding: 0 10px'>${s}</td>`, 
                i.insertBefore(n, i.childNodes[1]), this.rwtOrthographicEarth.invalidateCanvas(), 
                this.rwtDockablePanels.shadowRoot.getElementById(`layers-${a}-visible`).addEventListener('change', (t => {
                    var e = t.currentTarget.attributes['data-layer-id'].value;
                    this.rwtOrthographicEarth.getLayer(e).changeVisibility(t.currentTarget.checked);
                    var r = this.rwtDockablePanels.shadowRoot.getElementById(`layers-${a}-identifiable`);
                    null != r && (r.disabled = !t.currentTarget.checked);
                }));
                var l = this.rwtDockablePanels.shadowRoot.getElementById(`layers-${a}-identifiable`);
                null != l && l.addEventListener('change', (t => {
                    var e = t.currentTarget.attributes['data-layer-id'].value;
                    this.rwtOrthographicEarth.getLayer(e).changeIdentifiability(t.currentTarget.checked);
                }));
            })), void this.rwtOrthographicEarth.addEventListener('catalog/packageRemoved', (t => {
                var e = t.detail, a = this.rwtDockablePanels.shadowRoot.getElementById('layers-table'), r = this.rwtDockablePanels.shadowRoot.getElementById(`layers-${e}`);
                a.removeChild(r), this.rwtOrthographicEarth.invalidateCanvas();
            }));

          case 'identify':
            return void this.rwtOrthographicEarth.addEventListener('user/identifiedFeatures', (t => {
                var e = t.detail, a = [];
                for (let t of e) a.push(`<p>${t.layerName}: <b>${t.featureName}</b></p>`);
                this.rwtDockablePanels.shadowRoot.getElementById('identify-text').innerHTML = a.join('');
            }));

          case 'time-lapse':
            return void this.rwtOrthographicEarth.addEventListener('animation/rotationDegreesPerSecond', (t => {
                var e = t.detail;
                this.rwtDockablePanels.shadowRoot.getElementById('time-lapse-rotation').value = e;
            }));

          case 'earth-orbit':
          case 'telescope':
          case 'flyby':
            return;

          default:
            console.log(`unexpected panel '${t}' when registering listeners`);
        }
    }
    twoDigits(t) {
        if (void 0 === t) return '0.00';
        var e = parseFloat(t);
        return isNaN(e) ? '0.00' : e.toFixed(2);
    }
    valueToSliderPosition(t, e, a, r, o) {
        a = Math.log(a);
        var s = ((r = Math.log(r)) - a) / (e - t);
        return (Math.log(o) - a) / s + t;
    }
}