import moment from 'moment';

export default function initializeMoment() {
    moment.updateLocale('en', {
        longDateFormat: {
            l: 'MMM D',
        },
        relativeTime: {
            future: 'in %s',
            past: '%s ago',
            s: 'seconds',
            m: '1 minute',
            mm: '%d minutes',
            h: '1 hour',
            hh: '%d hours',
            d: '1 day',
            dd: '%d days',
            M: '1 month',
            MM: '%d months',
            y: '1 year',
            yy: '%d years',
        },
        calendar: {
            lastDay: '[Yesterday]',
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            lastWeek: '[Last] dddd',
            nextWeek: 'dddd, MMM Do',
        },
    });

    moment.relativeTimeThreshold('m', 60);
}

initializeMoment();