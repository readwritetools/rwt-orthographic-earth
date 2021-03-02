/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
const Static = {
    componentName: 'rwt-orthographic-earth',
    elementInstance: 1,
    vssURL: '/node_modules/rwt-orthographic-earth/joe/visualization/rwt-orthographic-earth.vss',
    rwtDockablePanels: '/node_modules/rwt-dockable-panels/rwt-dockable-panels.js',
    nextId: 1
};

Object.seal(Static);

import Earth from './joe/earth.class.js';

import Space from './joe/packages/space.class.js';

import Sphere from './joe/packages/sphere.class.js';

import Night from './joe/packages/night.class.js';

import Graticule from './joe/packages/graticule.class.js';

import NamedMeridians from './joe/packages/named-meridians.class.js';

import NamedParallels from './joe/packages/named-parallels.class.js';

import PlaceOfInterest from './joe/packages/place-of-interest.class.js';

import TopojsonPackage from './joe/packages/topojson-package.class.js';

import Animation from './joe/interaction/animation.class.js';

import InteractionHandler from './joe/interaction/interaction-handler.class.js';

import Menu from './joe/panels/menu.class.js';

export default class rwtOrthographicEarth extends HTMLElement {
    constructor() {
        super(), this.instance = Static.elementInstance++, this.isComponentLoaded = !1, 
        this.canvas = null, this.menu = null, this.earth = null, this.interactionHandler = null, 
        this.explicitMapScale = !1, this.explicitCenterPoint = !1, this.resizeObserver = null, 
        Object.seal(this);
    }
    async connectedCallback() {
        if (this.isConnected) try {
            this.attachShadow({
                mode: 'open'
            }), this.createCanvas(), this.createEarth(), this.createInteractionHandler(), this.addVisualizationStyleSheet(Static.vssURL), 
            await this.addDockablePanels(), this.registerMenuListeners(), this.registerUserListeners(), 
            this.registerEarthPositionListeners(), this.registerResizeListener(), this.resizeCanvas(), 
            this.setupAnimations(), this.initializeEarthValues(), this.reflectValues(), this.sendComponentLoaded(), 
            this.validate();
        } catch (e) {
            console.log(e.message);
        }
    }
    createCanvas() {
        this.canvas = document.createElement('canvas'), this.canvas.style.position = 'absolute', 
        this.canvas.style.touchAction = 'none', this.canvas.width = 100, this.canvas.height = 100, 
        this.shadowRoot.appendChild(this.canvas);
    }
    createEarth() {
        this.earth = new Earth(this);
    }
    createInteractionHandler() {
        this.interactionHandler = new InteractionHandler(this, this.canvas);
    }
    addVisualizationStyleSheet(e) {
        this.earth.addVisualizationStyleSheet(e);
    }
    async addDockablePanels() {
        this.style.position = 'relative', this.menu = new Menu(this), await this.menu.initialize();
    }
    registerResizeListener() {
        this.resizeObserver = new ResizeObserver(this.resizeCanvas.bind(this)), this.resizeObserver.observe(this);
    }
    initializeEarthValues() {
        var e = new Date;
        this.earth.earthPosition.changeUTC(e);
        var t = e.getTimezoneOffset() / 60 * -1;
        this.earth.changeTimezoneOffset(t);
        var a = 15 * t;
        this.earth.setTangentLongitude(a), this.setPlaceOfInterest(this.earth.getTangentLongitude(), this.earth.getTangentLatitude()), 
        'geolocation' in navigator && navigator.geolocation.getCurrentPosition((e => {
            this.earth.setTangentLongitude(e.coords.longitude), this.earth.setTangentLatitude(e.coords.latitude), 
            this.setPlaceOfInterest(e.coords.longitude, e.coords.latitude), this.earth.recalculateLongitudeDependants(), 
            this.earth.recalculateLatitudeDependants();
        }));
    }
    reflectValues() {
        this.earth.reflectValues(this.menu);
    }
    sendComponentLoaded() {
        this.isComponentLoaded = !0, this.dispatchEvent(new Event('component-loaded', {
            bubbles: !0
        }));
    }
    waitOnLoading() {
        return new Promise((e => {
            1 == this.isComponentLoaded ? e() : this.addEventListener('component-loaded', e);
        }));
    }
    broadcastMessage(e, t) {
        var a = new CustomEvent(e, {
            detail: t
        });
        this.dispatchEvent(a);
    }
    resizeCanvas() {
        if (this.canvas.width = this.offsetWidth, this.canvas.height = this.offsetHeight, 
        0 == this.explicitCenterPoint) {
            var e = Math.round(this.canvas.width / 2), t = Math.round(this.canvas.height / 2);
            this.earth.setCenterPoint({
                x: e,
                y: t
            });
        }
        if (0 == this.explicitMapScale) {
            var a = Math.min(this.canvas.width, this.canvas.height) / 2 - 10, s = this.menu.rwtDockablePanels.shadowRoot.getElementById('adjust-px-x-slider'), i = this.menu.rwtDockablePanels.shadowRoot.getElementById('adjust-px-y-slider');
            null != s && null != i && (s.setAttribute('min', (-1 * a).toFixed(0)), s.setAttribute('max', (this.canvas.width + a).toFixed(0)), 
            s.value = e, i.setAttribute('min', (-1 * a).toFixed(0)), i.setAttribute('max', (this.canvas.height + a).toFixed(0)), 
            i.value = t), this.earth.setMapScale(this.earth.getEarthRadius() / a);
        }
        this.invalidateCanvas();
    }
    invalidateCanvas() {
        null != this.earth && this.earth.invalidateCanvas();
    }
    setMenuTitlebar(e) {
        this.menu.rwtDockablePanels.setTitlebar(e);
    }
    async addLayer(e) {
        var t = e.id || 'id' + Static.nextId++, a = e.classname || '', s = e.layerName || t;
        switch (e.layerType) {
          case 'space':
            a = e.classname || '';
            this.earth.addPackage(new Space(this, s, t, a));
            break;

          case 'sphere':
            a = e.classname || 'sphere';
            this.earth.addPackage(new Sphere(this, s, t, a));
            break;

          case 'night':
            a = e.classname || 'night';
            this.earth.addPackage(new Night(this, s, t, a));
            break;

          case 'graticule':
            a = e.classname || '';
            var i = null == e.parallelFrequency ? 10 : e.parallelFrequency, n = null == e.meridianFrequency ? 10 : e.meridianFrequency, r = null != e.drawToPoles && e.drawToPoles;
            this.earth.addPackage(new Graticule(this, s, t, a, i, n, r));
            break;

          case 'named-meridians':
            a = e.classname || '';
            var o = e.namedMeridians || {}, h = e.frequency || 1;
            this.earth.addPackage(new NamedMeridians(this, s, t, a, o, h));
            break;

          case 'named-parallels':
            a = e.classname || '';
            var c = e.namedParallels || {};
            h = e.frequency || 1;
            this.earth.addPackage(new NamedParallels(this, s, t, a, c, h));
            break;

          case 'place-of-interest':
            a = e.classname || 'place-of-interest';
            this.earth.addPackage(new PlaceOfInterest(this, s, t, a));
            break;

          case 'topojson-package':
            a = e.classname || '';
            var l = e.url || '', d = e.embeddedName || '', m = e.featureKey || 'label', u = e.identifiable || 'yes', p = e.identifyCallback || null, g = new TopojsonPackage(this, s, t, a, m, u, p);
            this.earth.addPackage(g), await g.retrieveData('replace', l, d), this.invalidateCanvas();
            break;

          default:
            console.log(`Unrecognized layerType ${e.layerType}`);
        }
    }
    removeLayer(e) {
        this.earth.removePackage(e);
    }
    getLayer(e) {
        return this.earth.getPackage(e);
    }
    setDeclination(e) {
        this.earth.setDeclination(e);
    }
    setTangentLongitude(e) {
        this.earth.setTangentLongitude(e);
    }
    setTangentLatitude(e) {
        this.earth.setTangentLatitude(e);
    }
    setTranslationEastWest(e) {
        this.earth.setTranslationEastWest(e);
    }
    setTranslationNorthSouth(e) {
        this.earth.setTranslationNorthSouth(e);
    }
    setMapScale(e) {
        this.earth.setMapScale(e);
    }
    setCenterPoint(e) {
        this.earth.setCenterPoint(e);
    }
    setCenterPointX(e) {
        this.earth.setCenterPointX(e);
    }
    setCenterPointY(e) {
        this.earth.setCenterPointY(e);
    }
    changeTimezoneOffset(e) {
        this.earth.changeTimezoneOffset(e);
    }
    setPlaceOfInterest(e, t) {
        this.earth.setPlaceOfInterest(e, t);
    }
    setRotationSpeed(e) {
        this.earth.renderLoop.getAnimationByName('time-lapse-animation').setDeltaPerSecond(e), 
        this.broadcastMessage('animation/rotationDegreesPerSecond', e);
    }
    registerMenuListeners() {
        this.addEventListener('menu/seasonDayMonthYearUTC', (e => {
            var t = e.detail;
            this.earth.changeDayMonthYear(t), this.earth.recalculateJulianDateDependants();
        })), this.addEventListener('menu/seasonSpecialDay', (e => {
            this.earth.changeSpecialDay(e.detail), this.earth.recalculateJulianDateDependants();
        })), this.addEventListener('menu/seasonDayOfYear', (e => {
            this.earth.changeDayOfYear(e.detail), this.earth.recalculateJulianDateDependants();
        })), this.addEventListener('menu/timeOfDayHMS', (e => {
            this.earth.changeTimeOfDayHMS(e.detail), this.earth.recalculateJulianDateDependants();
        })), this.addEventListener('menu/timezoneOffset', (e => {
            this.earth.changeTimezoneOffset(e.detail), this.earth.recalculateTimezoneDependants();
        })), this.addEventListener('menu/tangentLongitude', (e => {
            this.earth.setTangentLongitude(e.detail), this.earth.recalculateLongitudeDependants();
        })), this.addEventListener('menu/tangentLatitude', (e => {
            this.earth.setTangentLatitude(e.detail), this.earth.recalculateLatitudeDependants();
        })), this.addEventListener('menu/timeLapseRotation', (e => {
            var t = e.detail;
            this.earth.renderLoop.getAnimationByName('time-lapse-animation').setDeltaPerSecond(t);
        })), this.addEventListener('menu/mapScale', (e => {
            this.earth.setMapScale(e.detail), this.explicitMapScale = !0;
        })), this.addEventListener('menu/translationEastWest', (e => {
            this.earth.setTranslationEastWest(e.detail);
        })), this.addEventListener('menu/translationNorthSouth', (e => {
            this.earth.setTranslationNorthSouth(e.detail);
        })), this.addEventListener('menu/centerPointX', (e => {
            this.earth.setCenterPointX(e.detail), this.explicitCenterPoint = !0;
        })), this.addEventListener('menu/centerPointY', (e => {
            this.earth.setCenterPointY(e.detail), this.explicitCenterPoint = !0;
        }));
    }
    registerUserListeners() {
        this.addEventListener('user/changeCanvasCoords', (e => {
            var t = e.detail;
            this.earth.changeCanvasCoords(t.x, t.y);
        })), this.addEventListener('user/changePlaceOfInterest', (e => {
            var t = e.detail;
            this.earth.changePlaceOfInterest(t.x, t.y), this.earth.recalculatePlaceOfInterestDependants();
        }));
    }
    registerEarthPositionListeners() {
        this.addEventListener('earthPosition/declination', (e => {
            this.earth.reflectDeclination(e.detail), this.earth.recalculateDeclinationDependants();
        }));
    }
    setupAnimations() {
        var e = this.earth.getTangentLongitude.bind(this.earth), t = this.earth.setTangentLongitude.bind(this.earth), a = new Animation('time-lapse-animation', this.earth, e, t, {
            deltaPerSecond: 0,
            maxThreshold: 180,
            minThreshold: -180,
            thresholdWrap: !0
        });
        this.earth.renderLoop.addAnimation(a);
    }
    async validate() {
        if (1 == this.instance) {
            var e = (i = window.location.hostname).split('.'), t = 25;
            if (e.length >= 2) {
                var a = e[e.length - 2].charAt(0);
                (a < 'a' || a > 'z') && (a = 'q'), t = a.charCodeAt(a) - 97, t = Math.max(t, 0), 
                t = Math.min(t, 25);
            }
            var s = new Date;
            s.setUTCMonth(0, 1), (Math.floor((Date.now() - s) / 864e5) + 1) % 26 == t && window.setTimeout(this.authenticate.bind(this), 5e3);
            var i = window.location.hostname, n = `Unregistered ${Static.componentName} component.`;
            try {
                var r = (await import('../../rwt-registration-keys.js')).default;
                for (let e = 0; e < r.length; e++) {
                    var o = r[e];
                    if (o.hasOwnProperty('product-key') && o['product-key'] == Static.componentName) return void (i != o.registration && console.warn(`${n} See https://readwritetools.com/licensing.blue to learn more.`));
                }
                console.warn(`${n} rwt-registration-key.js file missing "product-key": "${Static.componentName}"`);
            } catch (e) {
                console.warn(`${n} rwt-registration-key.js missing from website's root directory.`);
            }
        }
    }
    async authenticate() {
        var e = encodeURIComponent(window.location.hostname), t = encodeURIComponent(window.location.href), a = encodeURIComponent(Registration.registration), s = encodeURIComponent(Registration['customer-number']), i = encodeURIComponent(Registration['access-key']), n = {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            cache: 'no-cache',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            body: `product-name=${Static.componentName}&hostname=${e}&href=${t}&registration=${a}&customer-number=${s}&access-key=${i}`
        };
        try {
            var r = await fetch('https://validation.readwritetools.com/v1/genuine/component', n);
            if (200 == r.status) await r.json();
        } catch (e) {
            console.info(e.message);
        }
    }
}

window.customElements.define(Static.componentName, rwtOrthographicEarth);