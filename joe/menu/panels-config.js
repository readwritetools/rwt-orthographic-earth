/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import * as CB from './panel-callbacks.js';

export default {
    toolbar: {
        titlebar: '<span style=\'font-weight: 900\'>HELLO</span> <span style=\'font-weight: 300\'>WORLD</span>'
    },
    panels: [ {
        options: {
            id: 'interaction',
            titlebar: 'Pointer interaction',
            tooltip: 'Mouse gestures for manipulation and interaction'
        },
        panelLines: [ {
            lineType: 'table',
            id: 'interaction-table',
            maxHeightInPx: '400px',
            innerHTML: '\n\t\t\t\t<tr><th class=\'chef-center\'>Cursor</th><th class=\'chef-center\'>Keyboard</th><th class=\'chef-center\'>Action</th></tr>\t            \n\t\t\t\t<tr><td class=\'chef-center\' style=\'padding-top:4px\'><img src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAYElEQVRYw+2WQQrAIBADk/7/z/HQWy1UsbAsTM5BBzSblTorSU7PuP7gqAYQAAC0BlB1DFHzx7+7oPco9kqr2fZXC6543vzeiNPkTaLHvd6MqMv/AIMIsZSykAAAAF0wAKyaKQpq4jOcAAAAAElFTkSuQmCC\' /></td>\n\t\t\t\t\t<td class=\'chef-center\'>- none -</td>\n\t\t\t\t\t<td class=\'chef-center\'>Hover to discover features and location</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr><td class=\'chef-center\' style=\'padding-top:4px\'><img src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAnUlEQVRYw+2VwQ6AIAxDV8P//3I9GIkSkIGwXdaz0LfROZFQKBQKDYokRYSr7ju8C8Jg5e/DAMwA7raTlMIXte+0nmkClh/wGbJ6wQXO59nZFrJVecu8gMjeWDUcGvMCAkunoGYOQHo53TaG2gFJ1oa7ADCbi11PwK9cmGSgYw7zXVAz91hG+LMLhjOgAXBfx8kqhK3/hHsHAsB9Ck7xMjAzGwQtsgAAAABJRU5ErkJggg==\' /></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>Shift</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'>Identify underlying<br>feature details</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr><td class=\'chef-center\' style=\'padding-top:4px\'><img src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAe0lEQVRYw+1WQQ7AIAiThf9/ubvMi0M3RSXL2qNJa2kATYn4O8Q4wyDvDffGU1MFbR0R+/4Wr8ap6AAzY770TM0jugdogAbCDSwbr88kII7Ky00n2wzk2AGUK7ZbT53JwVnInF5c0dx8jGiABrZBe9bt09odGd/wbzlBnBGZNQ4RBhTBAAAAAElFTkSuQmCC\' /></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>Ctrl</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'>Select underlying<br>features</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr><td class=\'chef-center\' style=\'padding-top:4px\'><img src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABFUlEQVRYw91W0RKDMAgznv//y9mD9sbYSlOo5936ZrUlhhDAllt0zxjsd9exZRHwHQsAW7C2D0C6Z9/WLWYOLQFg2XgEQAVEGYDNdQbESg08lwJV8f/LQIWFVQBQOajYKgZmg6wR4aweeiphN9ue/dbsDeyBYdr2CVsNL7teTrNwNCQVOy2IFHtEYzvkwTn3Y6OGZEyT0o4nzsODNMDof+zXvQAozwMBMF8hSDGg6qBnODhfMKOBTdGBaDxIVcENUxCUFH5pwKbBmk8UvFMhVNmAMO0yMwGpzekQcoiIeh/IAcMsAxNVyaxQ17TRqDcYQPcxMNKE2C3zA8nl+x8BM1NReSKqdtFSCp7UQFeIau6XAaje+wLo8I5BQUpGKwAAAABJRU5ErkJggg==\' /></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>Alt</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'>Reorient point of observation</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr><td class=\'chef-center\' style=\'padding-top:4px\'><img src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACsUlEQVRYw+2XQWsTQRTH/7vT7KyBapOSQHYLpQXrpYHetiS72SB4tbdKD/UD1JNID6aUBRFEv4AehKIg6Em/QUKlIIIiBa2gveihUMk2NjWJcZPnZVs36bZp6W5O/mEOA8O8H+//5s0M8F//RD3G85mZmetEJAcZVOwgIPIdpmkCwLW9vb0GACe0DPioTUQ0MTHxLRqNvgEQC9UCP83Pz78VRXEVQD6MoGKvBYqiXEomk3HG2I/Qi9DVHyJqerOQzWabiqJ8YoxF+mLB3Nzc2tLSUsMLkclkfo+MjHwGEBoELS8vO6qqbjDG7oyOjn4xDKPVDaEoygqAc6EATE1NlQcHB++58wtjY2MPdV2vddthmubjMIpQYIxdrFarD9z5T9u2b21tbb02DKMFAKVSCY7jOPV6nQcFIHgKQALQFgSho9HE4/FoLBZ7qarqlUajUdvc3PxaqVRutlqtIhGRIAgd+5xWAwckgtD0W2Dbdo0xdnV8fPzF7u6uXS6XnwIoBZ6B0x6XQxu5qegLgHs5gYjQFVcIvBMeAy74zPOc84LX2n5d4wCQHxoaegeAUqnUq7B6xVHKJxKJdV3XHcuyKJfLtROJxOoxECLnXDyDA53BVVXdyOVy7WKxeNCwXIj1IyBE1ybpzNE553cBkGVZh65ywzBaw8PDH7oDJZPJJ56X1pk1wDlf0TTtl997wgMRASBJknQ7k8lUTdMMDAAAIpzzBU3TdvwgdF13YrHYewCldDq9vW9VkAAAIMqy/EzTtJofRKFQqM/Ozq566yRogH2IG5qmVegECgNgH+LRUZnoBwAASLIs319cXLR7AYghAbSJ6HytVtvp9++KAVhIpVIfs9ls01tw/bBAkCRpLZ1Ob1uWRb2CBw4wOTkZBbA9PT39nU6ooDMQAXD5BJ/cjvEXdZyYDo2qEJUAAAAASUVORK5CYII=\' /></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>Z</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'>Zoom in / Zoom out</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr><td class=\'chef-center\' style=\'padding-top:4px\'><img src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA7UlEQVRYw9VXWxLFEBTD2BaLZ2G5P3VH9Xi/z1dbIwmpgLGbSykFpRS2kbtaLsInXy6CIl8mIkU+XUQJeYsIWSNCa/16N8aQ369aBWJ3lojZIdOE46Z3lIAUlqA6uJ9rZBljGCVC9JADAGMMPSJkjtzvYK3lpdOeEqG1xgurNGT8kcfaYu2xsJItfnLOHdH/+bGCV2OlLAgTLrQAAB4BPGUBhUvaGVpRuAxRs4eEmCIcYUOuF087NfJPDjSKaCLvitDSzSiHE10FVWoTlcPZvhvKGktq2kfN4PQj2T2H0iOO5UdcTI64mh1xOR1VP15vH3cdOtO+AAAAAElFTkSuQmCC\' /></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>X</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'>Earth\'s position in space (km)</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr><td class=\'chef-center\' style=\'padding-top:4px\'><img src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA2UlEQVRYw+1XQRLEIAgjTP//5exhOztqW1HB6mE5YxJQiUJEKHZAxsLEPkREyOc8YJT7VGBga7XsL7lHAawCdCJ5kwiVxaHG3jGAg7VzoGXb03YFiMjIS/xMQLLnCBJxIb/DRwKORgAP+WVGIADItQZB1UR0zRTBxrPQkxs71wdz3XeMUwbRW4Go0YZB23T5PMlysnXjHc7O0VnI67djv2uoneeOwbnrR/EWZrTUjvXh0eF1NetR88PXm6QoS30SkePXHo1Bfl7F//8L9voXTBBRJS/nwJLv+QdJO7cIafBehwAAAABJRU5ErkJggg==\' /></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>C</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'> Earth\'s position on viewport (px)</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr><td class=\'chef-center\' style=\'padding-top:4px\'><img src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAkElEQVRYw+1VWw7AIAwqxvtfmX3NuEbNtKlmWfm3DygoEggEAoHAl0GSIkJLjXR6CRg2fxYCsG2Am3aSovpO18tG5mhcZP2hYgMtht70gq9Byn10+6VNdt1qQx7PgcHG3CpBbdHeUMmb/kY+0dMFHB1cNRA8GFj6lLLX8WnqFTMlvLxzAFpmLRGcJcBsNP8PF3m/Mg840tlhAAAAAElFTkSuQmCC\' /></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>A</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'>Set great circle<br>embarkation point</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr><td class=\'chef-center\' style=\'padding-top:4px\'><img src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAeUlEQVRYw+2USw6AQAhDYTL3v3JdmShxiMoIUfv2/JpSEUIIIeTNAICIINKjVR+hgcv3jVQ1bYFVdgBi5l7u14PKIXjI/UKjhp40oz6xgGeNrUcOZ7bEl53qAV9n8xCeMuU50LPkHsUEPfAfD5QrMDLh1CRMiv6PsQCxoCcckE3CggAAAABJRU5ErkJggg==\' /></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>B</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'>Set great circle<br>destination point</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr><td class=\'chef-center\' style=\'padding-top:4px\'><img src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABAElEQVRYw+1Wuw7CMAyMoy4sLVQq6sKAYABV/P93wQ8cS4EQ5WG76VApJ3Wq7bMvjmNjKiq2BACDMQapD8C0BvHNIwnCs+lLkXc54lgiAPZLyXcx8oBtLIlRSz6FyBl+oSQOMXtKxZoD/oyJiJk8HJ8kl40EeGjJfdtPjLmX2Ar8VS8hDymRUsEmnLkEnL6I/rMSOaXg+DZLpHWqgzbRRlnZl9ztt8ytKpeAQwTGdU7CSuSWnjFncNmczAI1jCZWbBCN0kpy1QM4b2cUz0GOvnzcxyhwW07aF7Et8BwPixoIQEtET+549irviOhVYivqFSvZZY3d8M5YSq91fa/YFN4zXXhLKb8COQAAAABJRU5ErkJggg==\' /></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>D</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'>Set place of interest</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td colspan=2 class=\'chef-center\'><kbd class=\'chef-kbd\'>Alt</kbd><kbd class=\'chef-kbd\'>X</kbd><kbd class=\'chef-kbd\'>C</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>⬆</kbd><br>North</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td colspan=2 class=\'chef-center\'><kbd class=\'chef-kbd\'>Alt</kbd><kbd class=\'chef-kbd\'>X</kbd><kbd class=\'chef-kbd\'>C</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>⬇</kbd><br>South</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td colspan=2 class=\'chef-center\'><kbd class=\'chef-kbd\'>Alt</kbd><kbd class=\'chef-kbd\'>X</kbd><kbd class=\'chef-kbd\'>C</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>➡</kbd><br>East</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td colspan=2 class=\'chef-center\'><kbd class=\'chef-kbd\'>Alt</kbd><kbd class=\'chef-kbd\'>X</kbd><kbd class=\'chef-kbd\'>C</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>⬅</kbd><br>West</td>\n\t\t\t\t</tr>\n\t\t\t\t\n\t\t\t\t<tr>\n\t\t\t\t\t<td colspan=2 class=\'chef-center\'><kbd class=\'chef-kbd\'>Z</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>⬆</kbd><br>Zoom out</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td colspan=2 class=\'chef-center\'><kbd class=\'chef-kbd\'>Z</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>⬇</kbd><br>Zoom in</td>\n\t\t\t\t</tr>\n\n\t\t\t\t<tr>\n\t\t\t\t\t<td colspan=2 class=\'chef-center\'><kbd class=\'chef-kbd\'>Z</kbd><kbd class=\'chef-kbd\'>X</kbd><kbd class=\'chef-kbd\'>C</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>Home</kbd><br>Reset position</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td colspan=2 class=\'chef-center\'><kbd class=\'chef-kbd\'>Alt</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>Page Up</kbd><br>North Pole</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td colspan=2 class=\'chef-center\'><kbd class=\'chef-kbd\'>Alt</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>Page Down</kbd><br>South Pole</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td colspan=2 class=\'chef-center\'><kbd class=\'chef-kbd\'>Alt</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>End</kbd><br>Dateline</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td colspan=2 class=\'chef-center\'><kbd class=\'chef-kbd\'>Alt</kbd></td>\n\t\t\t\t\t<td class=\'chef-center\'><kbd class=\'chef-kbd\'>Home</kbd><br>Prime Meridian</td>\n\t\t\t\t</tr>\n\t\t\t\t'
        } ]
    }, {
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
            tooltip: 'Press \'n Drag pointer —➤ Change the longitude/latitude of the observation point'
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
            tooltip: '<Alt> Drag pointer —➤ Change the map\'s scale'
        },
        panelLines: [ {
            lineType: 'slider+input',
            id: 'map-scale',
            labelText: 'Map Scale',
            textAfter: 'km / pixel',
            minPosition: '1',
            maxPosition: '27',
            stepPosition: '1',
            curve: 'callback',
            toUser: CB.sliderToMapScale,
            fromUser: CB.mapScaleToSlider,
            tooltip: 'Map scale (25m/px —➤ 1000km/px'
        } ]
    }, {
        options: {
            id: 'space',
            titlebar: 'Space',
            tooltip: '<Shift> \'n Drag pointer —➤ Shift the space point of view'
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
            id: 'layers',
            titlebar: 'Layers',
            tooltip: 'Choose which layers to display'
        },
        panelLines: [ {
            lineType: 'table',
            id: 'layers-table',
            maxHeightInPx: '320px',
            innerHTML: '<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th class=\'chef-center\'>Show</th>\n\t\t\t\t\t\t\t<th class=\'chef-center\'>Identify</th>\n\t\t\t\t\t\t\t<th class=\'chef-center\'>Select</th>\n\t\t\t\t\t\t\t<th class=\'chef-center\'>Layer</th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</thead>\n\t\t\t\t\t<tbody id=\'layers-table-body\'>\n\t\t\t\t\t</tbody>'
        } ]
    }, {
        options: {
            id: 'locate',
            titlebar: 'Location',
            tooltip: 'Hover pointer —➤ Display longitude and latitude of mouse position'
        },
        panelLines: [ {
            lineType: 'generic',
            id: 'locate-position',
            heightInPx: '52px',
            overflowY: 'hidden'
        } ]
    }, {
        options: {
            id: 'discover',
            titlebar: 'Feature discovery',
            tooltip: 'Hover pointer —➤ Discover features at pointer position'
        },
        panelLines: [ {
            lineType: 'table',
            id: 'discover-table',
            heightInPx: '200px',
            overflowY: 'auto'
        } ]
    }, {
        options: {
            id: 'identify',
            titlebar: 'Feature identification',
            tooltip: '<Shift> \'n Click —➤ Identify underlying feature details'
        },
        panelLines: [ {
            lineType: 'table',
            id: 'identify-table',
            minHeightInPx: '300px',
            maxHeightInPx: '600px',
            overflowY: 'auto',
            innerHTML: '<tr><th class=\'chef-center\'>&lt;Shift&gt; \'n Click —➤ Identify underlying feature details</th></tr>'
        } ]
    }, {
        options: {
            id: 'select',
            titlebar: 'Feature selection',
            tooltip: '<Ctrl> \'n Click —➤ Highlight underlying features'
        },
        panelLines: [ {
            lineType: 'table',
            id: 'select-table',
            minHeightInPx: '300px',
            maxHeightInPx: '600px',
            overflowY: 'auto',
            innerHTML: '<tbody><tr data-instructions=true><th class=\'chef-center\'>&lt;Ctrl&gt; \'n Click —➤ Highlight underlying features</th></tr><tbody>'
        } ]
    }, {
        options: {
            id: 'distance',
            titlebar: 'Measure distance',
            tooltip: '"A" \'n Click —➤ Embarkation  "B" \'n Click —➤ Destination'
        },
        panelLines: [ {
            lineType: 'table',
            id: 'distance-table',
            minHeightInPx: '200px',
            maxHeightInPx: '300px',
            overflowY: 'auto',
            innerHTML: '<tbody><tr data-instructions=true><th class=\'chef-center\'>"A" \'n Click —➤ Set embarkation point <br>"B" \'n Click —➤ Set destination point</th></tr><tbody>'
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