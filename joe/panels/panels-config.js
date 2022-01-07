/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import * as CB from './panel-callbacks.js';

export default {
    toolbar: {
        titlebar: '<span style=\'font-weight: 900\'>HELLO</span> <span style=\'font-weight: 300\'>WORLD</span>'
    },
    panels: [ {
        options: {
            id: 'season',
            titlebar: 'Season',
            tooltip: 'Change the reference date'
        },
        panelLines: [ {
            lineType: 'input',
            id: 'season-dmy-utc',
            labelText: 'Day Month Year',
            widthInPx: '105px',
            textAfter: '',
            tooltip: 'Specify a date AD or BC'
        }, {
            lineType: 'dropdown',
            id: 'season-special-day',
            labelText: 'Special days',
            tooltip: 'Equinox and solstice for the year',
            selections: [ {
                v: '',
                t: ' '
            }, {
                v: 'MarchEquinox',
                t: 'Mar Equinox'
            }, {
                v: 'JuneSolstice',
                t: 'Jun Solstice'
            }, {
                v: 'SeptemberEquinox',
                t: 'Sep Equinox'
            }, {
                v: 'DecemberSolstice',
                t: 'Dec Solstice'
            } ]
        }, {
            lineType: 'slider+input',
            id: 'season-day-of-year',
            labelText: 'Day of year',
            textAfter: '',
            minPosition: '1',
            maxPosition: '366',
            stepPosition: '1',
            minValue: '1',
            maxValue: '366',
            curve: 'linear',
            tooltip: 'Day number, counting from January 1'
        } ]
    }, {
        options: {
            id: 'time-of-day',
            titlebar: 'Time of day',
            tooltip: 'Change the time of day'
        },
        panelLines: [ {
            lineType: 'slider+input',
            id: 'time-of-day-hms',
            widthInPx: '60px',
            labelText: 'HH:MM:SS',
            textAfter: 'UTC',
            minPosition: '0',
            maxPosition: '96',
            stepPosition: '1',
            minValue: '0',
            maxValue: '96',
            curve: 'callback',
            fromUser: CB.fromUserTimeOfDay,
            toUser: CB.toUserTimeOfDay,
            fromSlider: CB.fromSliderTimeOfDay,
            toSlider: CB.toSliderTimeOfDay,
            tooltip: 'UTC time of day (00:00:00 to 23:59:59)'
        }, {
            lineType: 'generic',
            id: 'season-civil-date',
            innerHTML: '<p style=\'text-align:center\'></p>',
            heightInPx: '40px'
        }, {
            lineType: 'generic',
            id: 'season-hr',
            innerHTML: '<hr>',
            heightInPx: '30px'
        }, {
            lineType: 'dropdown',
            id: 'timezone-offset',
            labelText: 'Timezone',
            tooltip: 'Timezone offsets',
            selections: [ {
                v: '-12',
                t: 'UTC -12:00'
            }, {
                v: '-11',
                t: 'UTC -11:00'
            }, {
                v: '-10',
                t: 'UTC -10:00'
            }, {
                v: '-9.5',
                t: 'UTC -9:30'
            }, {
                v: '-9',
                t: 'UTC -9:00'
            }, {
                v: '-8',
                t: 'UTC -8:00'
            }, {
                v: '-7',
                t: 'UTC -7:00'
            }, {
                v: '-6',
                t: 'UTC -6:00'
            }, {
                v: '-5',
                t: 'UTC -5:00'
            }, {
                v: '-4',
                t: 'UTC -4:00'
            }, {
                v: '-3.5',
                t: 'UTC -3:30'
            }, {
                v: '-3',
                t: 'UTC -3:00'
            }, {
                v: '-2',
                t: 'UTC -2:00'
            }, {
                v: '-1',
                t: 'UTC -1:00'
            }, {
                v: '0',
                t: 'UTC +0:00'
            }, {
                v: '1',
                t: 'UTC +1:00'
            }, {
                v: '2',
                t: 'UTC +2:00'
            }, {
                v: '3',
                t: 'UTC +3:00'
            }, {
                v: '3.5',
                t: 'UTC +3:30'
            }, {
                v: '4',
                t: 'UTC +4:00'
            }, {
                v: '4.5',
                t: 'UTC +4:30'
            }, {
                v: '5',
                t: 'UTC +5:00'
            }, {
                v: '5.5',
                t: 'UTC +5:30'
            }, {
                v: '5.75',
                t: 'UTC +5:45'
            }, {
                v: '6',
                t: 'UTC +6:00'
            }, {
                v: '6.5',
                t: 'UTC +6:30'
            }, {
                v: '7',
                t: 'UTC +7:00'
            }, {
                v: '8',
                t: 'UTC +8:00'
            }, {
                v: '8.75',
                t: 'UTC +8:45'
            }, {
                v: '9',
                t: 'UTC +9:00'
            }, {
                v: '9.5',
                t: 'UTC +9:30'
            }, {
                v: '10',
                t: 'UTC +10:00'
            }, {
                v: '10.5',
                t: 'UTC +10:30'
            }, {
                v: '11',
                t: 'UTC +11:00'
            }, {
                v: '12',
                t: 'UTC +12:00'
            }, {
                v: '13',
                t: 'UTC +13:00'
            }, {
                v: '13.75',
                t: 'UTC +13:45'
            }, {
                v: '14',
                t: 'UTC +14:00'
            } ]
        }, {
            lineType: 'generic',
            id: 'timezone-local-time',
            innerHTML: '<p style=\'text-align:center\'></p>',
            heightInPx: '60px'
        } ]
    }, {
        options: {
            id: 'point-of-reference',
            titlebar: 'Point of observation',
            tooltip: 'Change the longitude/latitude of the observation point'
        },
        panelLines: [ {
            lineType: 'dropdown',
            id: 'named-longitude',
            labelText: 'Fixed Longitudes',
            tooltip: 'Fixed longitudes',
            selections: [ {
                v: '0',
                t: 'Prime Meridian'
            }, {
                v: '180',
                t: 'Dateline'
            } ]
        }, {
            lineType: 'slider+input',
            id: 'longitude-pov',
            widthInPx: '60px',
            labelText: 'Degrees',
            textAfter: '(E / W)',
            minPosition: '-179',
            maxPosition: '180',
            stepPosition: '1',
            minValue: '-179',
            maxValue: '180',
            curve: 'callback',
            toUser: CB.toUserLongitude,
            fromUser: CB.fromUserLongitude,
            tooltip: 'Angular distance from the Prime Meridian (180.00 E to 179.99 W)'
        }, {
            lineType: 'dropdown',
            id: 'named-latitude',
            labelText: 'Named Latitudes',
            tooltip: 'Named Earth latitudes',
            selections: [ {
                v: 90,
                t: 'North Pole'
            }, {
                v: 66.56,
                t: 'Arctic Circle'
            }, {
                v: 23.44,
                t: 'Tropic of Cancer'
            }, {
                v: 0,
                t: 'Equator'
            }, {
                v: -23.44,
                t: 'Tropic of Capricorn'
            }, {
                v: -66.56,
                t: 'Antarctic Circle'
            }, {
                v: -90,
                t: 'South Pole'
            } ]
        }, {
            lineType: 'slider+input',
            id: 'latitude-pov',
            widthInPx: '60px',
            labelText: 'Degrees',
            textAfter: '(N / S)',
            minPosition: '-90',
            maxPosition: '90',
            stepPosition: '1',
            minValue: '-90',
            maxValue: '90',
            curve: 'callback',
            toUser: CB.toUserLatitude,
            fromUser: CB.fromUserLatitude,
            tooltip: 'Angular distance from the Equator (90.0 N to 90.0 S)'
        } ]
    }, {
        options: {
            id: 'equation-of-time',
            titlebar: 'Equation of time',
            tooltip: 'The variance between mean solar noon and actual solar noon'
        },
        panelLines: [ {
            lineType: 'generic',
            id: 'equation-of-time-sunrise-notes',
            innerHTML: 'Angular offset of the Sun, on <b id=equation-of-time-civil-date></b>, from its mean noontime position.',
            heightInPx: '60px'
        }, {
            lineType: 'generic',
            id: 'equation-of-time-sundial-correction',
            innerHTML: 'Sundial correction: xxx',
            heightInPx: '40px'
        } ]
    }, {
        options: {
            id: 'solar-events',
            titlebar: 'Solar events',
            tooltip: 'The time of sunrise, solar noon, and sunset'
        },
        panelLines: [ {
            lineType: 'generic',
            id: 'solar-events-notes',
            innerHTML: 'Solar events for the selected place of interest [<b id=solar-events-latitude></b>, <b id=solar-events-longitude></b>]',
            heightInPx: '60px'
        }, {
            lineType: 'generic',
            id: 'solar-events-sunrise',
            innerHTML: 'Sunrise: xxx',
            heightInPx: '40px'
        }, {
            lineType: 'generic',
            id: 'solar-events-solar-noon',
            innerHTML: 'Solar noon: xxx',
            heightInPx: '40px'
        }, {
            lineType: 'generic',
            id: 'solar-events-sunset',
            innerHTML: 'Sunset: xxx',
            heightInPx: '40px'
        }, {
            lineType: 'generic',
            id: 'solar-events-notes2',
            innerHTML: '* Times shown using <b id=solar-events-timezone></b>',
            heightInPx: '40px'
        } ]
    }, {
        options: {
            id: 'geocentric-coords',
            titlebar: 'Geocentric coords',
            tooltip: 'The Earth\'s declination and right ascension for the current date and time'
        },
        panelLines: [ {
            lineType: 'generic',
            id: 'geocentric-notes',
            innerHTML: 'Position of the Earth in its orbit around the Sun on <b id=geocentric-civil-date></b>.',
            heightInPx: '60px'
        }, {
            lineType: 'generic',
            id: 'geocentric-declination',
            innerHTML: 'Declination: xxx',
            heightInPx: '40px'
        }, {
            lineType: 'generic',
            id: 'geocentric-right-ascension',
            innerHTML: 'Right ascension: xxx',
            heightInPx: '40px'
        }, {
            lineType: 'generic',
            id: 'geocentric-hr',
            innerHTML: '<hr>',
            heightInPx: '30px'
        }, {
            lineType: 'generic',
            id: 'geocentric-perihelion',
            innerHTML: 'Perihelion yyyy: xxx',
            heightInPx: '40px'
        }, {
            lineType: 'generic',
            id: 'geocentric-aphelion',
            innerHTML: 'Aphelion yyyy: xxx',
            heightInPx: '40px'
        } ]
    }, {
        options: {
            id: 'topocentric-coords',
            titlebar: 'Topocentric coords',
            tooltip: 'The position of the sun for the current location and time'
        },
        panelLines: [ {
            lineType: 'generic',
            id: 'topocentric-notes',
            innerHTML: 'Apparent position of the Sun <br>at location [<b id=topocentric-latitude></b>, <b id=topocentric-longitude></b>]<br>local time <b id=topocentric-local-time></b>.',
            heightInPx: '60px'
        }, {
            lineType: 'generic',
            id: 'topocentric-altitude',
            innerHTML: 'Altitude: xxx',
            heightInPx: '40px'
        }, {
            lineType: 'generic',
            id: 'topocentric-azimuth',
            innerHTML: 'Azimuth: xxx',
            heightInPx: '40px'
        }, {
            lineType: 'generic',
            id: 'topocentric-sunrise-hour-angle',
            innerHTML: 'Hour angle: xxx',
            heightInPx: '40px'
        }, {
            lineType: 'generic',
            id: 'topocentric-solar-phase',
            innerHTML: 'Visibility: xxx',
            heightInPx: '40px'
        } ]
    }, {
        options: {
            id: 'zoom',
            titlebar: 'Zoom',
            tooltip: 'Change the map\'s scale'
        },
        panelLines: [ {
            lineType: 'slider+input',
            id: 'map-scale',
            labelText: 'Map Scale',
            textAfter: 'km / pixel',
            minPosition: '0',
            maxPosition: '100',
            stepPosition: '0.25',
            minValue: '0.025',
            maxValue: '1000',
            curve: 'log',
            numDecimals: 3,
            tooltip: 'Map scale (1:100,000 - 1:10,000,000)'
        } ]
    }, {
        options: {
            id: 'space',
            titlebar: 'Space',
            tooltip: 'Shift the space point of view'
        },
        panelLines: [ {
            lineType: 'slider+input',
            id: 'adjust-km-y',
            labelText: 'Pan South / North',
            textAfter: 'kilometers',
            minPosition: '-384000',
            maxPosition: '384000',
            stepPosition: '1000',
            minValue: '-384000',
            maxValue: '384000',
            curve: 'linear',
            tooltip: 'Shift space north or south (km)'
        }, {
            lineType: 'slider+input',
            id: 'adjust-km-x',
            labelText: 'Pan West / East',
            textAfter: 'kilometers',
            minPosition: '-384000',
            maxPosition: '384000',
            stepPosition: '1000',
            minValue: '-384000',
            maxValue: '384000',
            curve: 'linear',
            tooltip: 'Shift space east or west (km)'
        } ]
    }, {
        options: {
            id: 'canvas',
            titlebar: 'Canvas',
            tooltip: 'Shift the canvas origin'
        },
        panelLines: [ {
            lineType: 'slider+input',
            id: 'adjust-px-y',
            labelText: 'Pan down / up',
            textAfter: 'pixels',
            minPosition: '-500',
            maxPosition: '500',
            stepPosition: '1',
            minValue: '-500',
            maxValue: '500',
            curve: 'linear',
            tooltip: 'Shift the canvas origin up or down (px)'
        }, {
            lineType: 'slider+input',
            id: 'adjust-px-x',
            labelText: 'Pan left / right',
            textAfter: 'pixels',
            minPosition: '-500',
            maxPosition: '500',
            stepPosition: '1',
            minValue: '-500',
            maxValue: '500',
            curve: 'linear',
            tooltip: 'Shift the canvas origin left or right (px)'
        } ]
    }, {
        options: {
            id: 'locate',
            titlebar: 'Locate',
            tooltip: 'Display longitude and latitude of mouse position'
        },
        panelLines: [ {
            lineType: 'generic',
            id: 'locate-position',
            heightInPx: '52px',
            overflowY: 'hidden'
        } ]
    }, {
        options: {
            id: 'layers',
            titlebar: 'Layers',
            tooltip: 'Choose which layers to display'
        },
        panelLines: [ {
            lineType: 'table',
            id: 'layers-table',
            innerHTML: '<thead><tr><th class=\'chef-center\'>Show</th><th class=\'chef-center\'>Identify</th><th class=\'chef-center\'>Layer</th></tr></thead><tbody id=\'layers-table-body\'></tbody>',
            maxHeightInPx: '320px'
        } ]
    }, {
        options: {
            id: 'identify',
            titlebar: 'Identify',
            tooltip: 'Identify feature details'
        },
        panelLines: [ {
            lineType: 'table',
            id: 'identify-table',
            heightInPx: '200px',
            overflowY: 'auto'
        } ]
    }, {
        options: {
            id: 'time-lapse',
            titlebar: 'Time lapse',
            tooltip: 'Rotate the Earth'
        },
        panelLines: [ {
            lineType: 'dropdown',
            id: 'time-lapse-rotation',
            labelText: 'Rotation rate',
            tooltip: 'Time lapse speed of Earth\'s rotation about its axis',
            selections: [ {
                v: 0,
                t: 'off'
            }, {
                v: -.004167,
                t: 'realtime'
            }, {
                v: -.24,
                t: 'very slow'
            }, {
                v: -.5,
                t: 'slow'
            }, {
                v: -1,
                t: 'medium'
            }, {
                v: -2,
                t: 'fast'
            }, {
                v: -4,
                t: 'very fast'
            }, {
                v: -8,
                t: 'spin'
            } ]
        } ]
    }, {
        options: {
            id: 'interaction',
            titlebar: 'Pointer Interaction',
            tooltip: 'Mouse gestures for manipulation and interaction'
        },
        panelLines: [ {
            lineType: 'table',
            id: 'interaction-table',
            innerHTML: '\n<tr><th class=\'chef-center\'>Cursor</th><th class=\'chef-center\'>Key</th><th class=\'chef-center\'>Action</th></tr>\t            \n<tr><td class=\'chef-center\' style=\'padding-top:4px\'><img src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAWCAYAAADJqhx8AAACfElEQVQ4y53TP0gbYRgG8Cc5z1zuDyStgaoXQxPpYMDB0iaQQhQEF0GqIDh0cKk4d3JRwcmpix2bDqVVaGkpnRyUGtSlpRQqNUKDKDqUnGjMnzvlck+XRtporemzft/7g+/h/RCLxX4AuIf/jd/vZzgcJoCHAMS6gXA4zGw2y0QiQQDPADTUBYRCIZqmyXK5zMHBwVNN0x4DaLoy0NbWxuPjY5KkbducmJigpmmvAdy6EqDrOguFAquxLIuTk5OUZfkTgLt1AyRZKpU4NzfHzs7ObwCSlwKtra0sFousjeM4XFlZYSKR2APwoG6gms3NTfb09JgAHgFw1w2Q5NHREUdHRx1RFJ8CkOsGqhkZGaEgCJ8B+C4t8bKMjY1RluWMqqrXAQDBYPCvgG3bzOfzNAyDhmEwl8vRtm3OzMzQ6/VuKIrS3uByuc71UqlUIAgCdnZ2MDU1hXQ6XXK73ackXY7jQBRFViqVm7Ztv/8DIIn19XVks1kMDw9D13UEAgHs7u6mAbzTNO3U4/G4T05OoOt6g+M4XxAKhSrVVV5aWmJHR8e+x+P5mEqlSJJbW1vs6+v7CiB24R60tLSUTdPk8vIyo9HoPoBuAPf7+/vPupmenqaiKC8BBM4BwWCwuLi4yHg8vvFrGAD8zc3NqdnZWZKkYRgcGhrKAYifAxRFKXV1dX0HcLvmqHtgYGAvk8mQJOfn5xmJRF4AuFYLfPD5fHcueJ0UiUSeVLs4ODhgMpmkJEm9giCcNS94vd634+Pj26urq7WAfXh4aMmyHM/n800LCwtYW1srlMvlV4qibFuWxX9+9Wg0qkqS9FyW5TeqqvY2NjbekCRJ+P3OT156AYCdO5fkAAAAAElFTkSuQmCC\' /></td>\n\t<td class=\'chef-center\'>Hover</td>\n\t<td class=\'chef-center\'>identify features</td>\n</tr>\n<tr><td class=\'chef-center\' style=\'padding-top:4px\'><img src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAA9ElEQVQoz6WSMWrDQBBF3yzGhSpjjCCFg0HdqjP4AME3CAR0jBzFt9CCwTcIPoDB3aoTGKcwCBNUqXDhdWEWpEiRSfK7Hf6fmf3zhQ6sNmc3Cq4AlJXi/XUi3zmNwnp7cvPnqqsX+2PA28uTtIQfu083G1/ow+FryHIxFQDlJz0SAczGF9bbkwMYANTXK4qCNE3JsgwRQWtNkiSEYUidq1abs6t39SIA5xzWWowxLfOUd8/Di/pqo+B6/+NfoMqqqY3juEXSWjfeZaXu58jz3NXNMcZgre00ByCKIpFHh/8pCP8LAMByMZX9Meid5EWtrP4m5DdDwW587eQWhQAAAABJRU5ErkJggg==\' /></td>\n\t<td class=\'chef-center\'>Click</td>\n\t<td class=\'chef-center\'>set place of interest</td>\n</tr>\n<tr><td class=\'chef-center\' style=\'padding-top:4px\'><img src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABFUlEQVRYw91W0RKDMAgznv//y9mD9sbYSlOo5936ZrUlhhDAllt0zxjsd9exZRHwHQsAW7C2D0C6Z9/WLWYOLQFg2XgEQAVEGYDNdQbESg08lwJV8f/LQIWFVQBQOajYKgZmg6wR4aweeiphN9ue/dbsDeyBYdr2CVsNL7teTrNwNCQVOy2IFHtEYzvkwTn3Y6OGZEyT0o4nzsODNMDof+zXvQAozwMBMF8hSDGg6qBnODhfMKOBTdGBaDxIVcENUxCUFH5pwKbBmk8UvFMhVNmAMO0yMwGpzekQcoiIeh/IAcMsAxNVyaxQ17TRqDcYQPcxMNKE2C3zA8nl+x8BM1NReSKqdtFSCp7UQFeIau6XAaje+wLo8I5BQUpGKwAAAABJRU5ErkJggg==\' /></td>\n\t<td class=\'chef-center\'>Move</td>\n\t<td class=\'chef-center\'>change central viewpoint</td>\n</tr>\n<tr><td class=\'chef-center\' style=\'padding-top:4px\'><img src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACsUlEQVRYw+2XQWsTQRTH/7vT7KyBapOSQHYLpQXrpYHetiS72SB4tbdKD/UD1JNID6aUBRFEv4AehKIg6Em/QUKlIIIiBa2gveihUMk2NjWJcZPnZVs36bZp6W5O/mEOA8O8H+//5s0M8F//RD3G85mZmetEJAcZVOwgIPIdpmkCwLW9vb0GACe0DPioTUQ0MTHxLRqNvgEQC9UCP83Pz78VRXEVQD6MoGKvBYqiXEomk3HG2I/Qi9DVHyJqerOQzWabiqJ8YoxF+mLB3Nzc2tLSUsMLkclkfo+MjHwGEBoELS8vO6qqbjDG7oyOjn4xDKPVDaEoygqAc6EATE1NlQcHB++58wtjY2MPdV2vddthmubjMIpQYIxdrFarD9z5T9u2b21tbb02DKMFAKVSCY7jOPV6nQcFIHgKQALQFgSho9HE4/FoLBZ7qarqlUajUdvc3PxaqVRutlqtIhGRIAgd+5xWAwckgtD0W2Dbdo0xdnV8fPzF7u6uXS6XnwIoBZ6B0x6XQxu5qegLgHs5gYjQFVcIvBMeAy74zPOc84LX2n5d4wCQHxoaegeAUqnUq7B6xVHKJxKJdV3XHcuyKJfLtROJxOoxECLnXDyDA53BVVXdyOVy7WKxeNCwXIj1IyBE1ybpzNE553cBkGVZh65ywzBaw8PDH7oDJZPJJ56X1pk1wDlf0TTtl997wgMRASBJknQ7k8lUTdMMDAAAIpzzBU3TdvwgdF13YrHYewCldDq9vW9VkAAAIMqy/EzTtJofRKFQqM/Ozq566yRogH2IG5qmVegECgNgH+LRUZnoBwAASLIs319cXLR7AYghAbSJ6HytVtvp9++KAVhIpVIfs9ls01tw/bBAkCRpLZ1Ob1uWRb2CBw4wOTkZBbA9PT39nU6ooDMQAXD5BJ/cjvEXdZyYDo2qEJUAAAAASUVORK5CYII=\' /></td>\n\t<td class=\'chef-center\'>Alt</td>\n\t<td class=\'chef-center\'>zoom in / zoom out</td>\n</tr>\n<tr><td class=\'chef-center\' style=\'padding-top:4px\'><img src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA7UlEQVRYw9VXWxLFEBTD2BaLZ2G5P3VH9Xi/z1dbIwmpgLGbSykFpRS2kbtaLsInXy6CIl8mIkU+XUQJeYsIWSNCa/16N8aQ369aBWJ3lojZIdOE46Z3lIAUlqA6uJ9rZBljGCVC9JADAGMMPSJkjtzvYK3lpdOeEqG1xgurNGT8kcfaYu2xsJItfnLOHdH/+bGCV2OlLAgTLrQAAB4BPGUBhUvaGVpRuAxRs4eEmCIcYUOuF087NfJPDjSKaCLvitDSzSiHE10FVWoTlcPZvhvKGktq2kfN4PQj2T2H0iOO5UdcTI64mh1xOR1VP15vH3cdOtO+AAAAAElFTkSuQmCC\' /></td>\n\t<td class=\'chef-center\'>Shift</td>\n\t<td class=\'chef-center\'>change position in space</td>\n</tr>\n',
            maxHeightInPx: '320px'
        } ]
    }, {
        options: {
            id: 'hello-world',
            titlebar: 'Hello World',
            tooltip: 'Licensing information'
        },
        panelLines: [ {
            lineType: 'generic',
            id: 'hello-world-text',
            innerHTML: '<p>You must obtain a <a style=\'color:var(--pure-white)\' target=\'_blank\' href=\'https://readwritetools.com/licensing.blue\'>Read Write Tools</a> license to use this web component in any eBook, mobile app, desktop application or website.</p><p>Read the full text of the <a style=\'color:var(--pure-white)\' target=\'_blank\' href=\'/node_modules/rwt-orthographic-earth/license.html\'>JavaScript Orthographic Earth Software License Agreement</a> for terms and conditions.</p>',
            heightInPx: '170px'
        } ]
    } ]
};