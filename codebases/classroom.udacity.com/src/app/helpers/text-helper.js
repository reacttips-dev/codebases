import DateHelper from 'helpers/date-helper';
import {
    __
} from 'services/localization-service';
import moment from 'moment';

const ARABIC = /[\u0600-\u06FF]/;

const TextHelper = {
    pluralize(count, label, pluralLabel = null) {
        var isArabic = TextHelper.isTextArabic(__(label));
        pluralLabel = pluralLabel || label + 's';

        if (isArabic) {
            if (count <= 1 || count >= 11) {
                return `${count} ${__(label)}`;
            } else if (count === 2) {
                return `${__(label + '_dual')}`;
            } else if (count >= 3 && count <= 10) {
                return `${count} ${__(pluralLabel)}`;
            }
        } else {
            if (count === 1) {
                return `${count} ${__(label)}`;
            } else {
                return `${count} ${__(pluralLabel)}`;
            }
        }
    },

    formatDuration(durationMins) {
        const oneDay = 24 * 60;
        const twoDays = 48 * 60;
        const resetRelativeTimeThresholds = DateHelper.setRelativeTimeThresholds({
            h: 48,
            d: 100,
        });

        if (durationMins < twoDays) {
            let hours = moment.duration(durationMins, 'm').hours();
            if (durationMins > oneDay) {
                hours += 24;
            }

            const minutes = moment.duration(durationMins, 'm').minutes();
            const humanizedHours = `${moment.duration(hours, 'h').humanize()} `;
            const humanizedMinutes = moment.duration(minutes, 'm').humanize();

            resetRelativeTimeThresholds();
            return _.trimEnd(
                `${hours ? humanizedHours : ''}${minutes ? humanizedMinutes : ''}`
            );
        } else {
            const days = moment.duration(durationMins, 'minutes').asDays();
            const humanizedDays = moment.duration(days, 'd').humanize();

            resetRelativeTimeThresholds();
            return humanizedDays;
        }
    },

    formatDurationShort(durationMins) {
        let formattedDuration = TextHelper.formatDuration(durationMins);

        return _.chain(formattedDuration)
            .replace(/\sdays*/, __('d'))
            .replace(/\shours*/, __('h'))
            .replace(/\sminutes*/, __('m'))
            .value();
    },

    isTextArabic(text) {
        var match = ARABIC.test(text);

        return match;
    },

    directionClass(text) {
        if (_.isString(text)) {
            return TextHelper.isTextArabic(text) ? 'rtl' : 'ltr';
        }

        return null;
    },

    camelCaseToUnderscore(text) {
        return _.chain(text)
            .replace(/([a-z](?=[A-Z]))/g, '$1_')
            .toLower()
            .value();
    },
};

export default TextHelper;