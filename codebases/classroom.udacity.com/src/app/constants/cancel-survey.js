import {
    TYPES
} from './survey';
import {
    __
} from 'services/localization-service';

const TIME = 'time';
const QUALITY = 'quality';
const FIT = 'fit';
const COST = 'cost';
const SUPPORT = 'support';
const OTHER = 'Other';

function formatReasons(reasons, key, opts = {}) {
    const cache = {};
    // use cache to keep radio answers the same for the follow up question
    // otherwise react reorders the radio answers when selecting one
    if (cache[key]) {
        return cache[key];
    }

    const answers = _.map(reasons, (option) => {
        if (opts.dropdown) {
            return {
                value: option,
                translated: __(option),
            };
        } else if (_.isString(option)) {
            return {
                raw: option,
                translated: __(option),
            };
        } else {
            const {
                reason,
                key
            } = option;
            return {
                key,
                raw: reason,
                translated: __(reason),
            };
        }
    });
    const value = opts.noShuffle ? answers : _.shuffle(answers);
    if (key) {
        cache[key] = value;
    }
    return value;
}

const REASONS = formatReasons(
    [{
            key: TIME,
            reason: 'I am not able to dedicate enough time to this Nanodegree program',
        },
        {
            key: FIT,
            reason: 'This Nanodegree program is not a great fit for me'
        },
        {
            key: QUALITY,
            reason: 'I am not happy with the quality of your content'
        },
        {
            key: COST,
            reason: `I don't feel this Nanodegree program is worth the cost`,
        },
        {
            key: SUPPORT,
            reason: `I wasn't happy with the level of support or mentorship I received`,
        },
    ],
    'main'
);

const REASONS_SHORT_VARIATION = formatReasons(
    [{
            key: COST,
            reason: 'I think the price is too high'
        },
        {
            key: TIME,
            reason: 'I do not have enough time to complete this program'
        },
        {
            key: FIT,
            reason: 'I would like to switch to a different program'
        },
    ],
    'main', {
        noShuffle: true
    }
);

const FOLLOW_UP_QUESTIONS = {
    [TIME]: {
        question: __(
            'What is the main reason you are not able to dedicate enough time?'
        ),
        options: formatReasons(
            [
                'Work commitments',
                'Family commitments',
                'The program is not engaging enough for me',
                `I'm putting my time towards other learning platforms`,
                'Deadlines are too aggressive',
                `I can't seem to schedule time to work on the program`,
            ],
            TIME
        ),
        hasOtherOption: true,
        type: TYPES.RADIO,
    },
    [FIT]: {
        question: __(
            'What is the main reason the Nanodegree program is not a good fit?'
        ),
        options: formatReasons(
            [
                'The content was not what I was looking for',
                'I am no longer interested in the content',
                'I was looking for more foundational content',
                'I was looking for more advanced content',
                `I don't like the format or style of the course`,
            ],
            FIT
        ),
        hasOtherOption: true,
        type: TYPES.RADIO,
    },
    [QUALITY]: {
        question: __('I am not happy with the quality of your content'),
        options: formatReasons(
            [
                'The content is not the right level of difficulty for me',
                'The coverage of the topics is not deep or thorough enough',
                'The program content is disorganized, unclear, or confusing',
                `There isn't enough hands-on practice`,
                'The content, format, or instructors are not engaging',
                'Some of the projects were not valuable for me',
            ],
            QUALITY
        ),
        hasOtherOption: true,
        type: TYPES.RADIO,
    },
    [COST]: {
        question: __('Why is the program not worth the cost?'),
        type: TYPES.TEXT_AREA,
    },
    [SUPPORT]: {
        question: __(
            'Which option best describes why you are not happy with the level of support or mentorship?'
        ),
        options: formatReasons(
            [
                `I couldn't get a timely response from my mentor`,
                'The mentor did not have relevant technical skills',
                'The mentor did not have good communication skills',
                'I did not get a timely resolution to my support requests over email',
                'I needed more or better interaction with fellow students',
            ],
            SUPPORT
        ),
        hasOtherOption: true,
        type: TYPES.RADIO,
    },
};

export const CANCEL_SURVEY = {
    TIME,
    FIT,
    QUALITY,
    COST,
    SUPPORT,
    OTHER,

    get FOLLOW_UP_QUESTIONS() {
        return FOLLOW_UP_QUESTIONS;
    },

    getReasons({
        isPreorder
    }) {
        return _.filter(REASONS, ({
            key
        }) => {
            let res = true;
            if (isPreorder) {
                res = res && key !== QUALITY;
            }
            return res;
        });
    },

    getReasonsShortVariation() {
        return REASONS_SHORT_VARIATION;
    },

    getFollowUpQuestion(key) {
        return _.get(FOLLOW_UP_QUESTIONS, key);
    },
};