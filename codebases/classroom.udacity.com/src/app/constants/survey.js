import {
    __
} from 'services/localization-service';

export const FREE_COURSE_SURVEY = 'free_course_survey';
export const COMPLETED_SURVEY = 'COMPLETED';
export const ATTEMPTED_SURVEY = 'ATTEMPTED';
export const TYPES = {
    RADIO: 'radio',
    CHECKBOX: 'checkbox',
    RATING: 'rating',
    CATEGORY_RATING: 'category_rating',
    TEXT_AREA: 'text_area',
    DROPDOWN: 'dropdown',
};

export const SURVEY_TEXTS = {
    get OTHER_TEXT_INPUT() {
        return __('Other');
    },

    get WELCOME_SURVEY_TITLE() {
        return __('Please help us improve our student experience');
    },

    get WELCOME_SURVEY_SUBTITLE() {
        return __('It will take less than a minute to complete this survey');
    },

    get NONE() {
        return __('None');
    },

    get SURVEYS() {
        return [{
                question: __('How did you find out about this course?'),
                answers: [
                    __('Knew about Udacity already and found it on Udacity.com'),
                    __('Found through a search engine (i.e. Google)'),
                    __('A friend, colleague, etc'),
                    __('Heard about Udacity through an advertisement'),
                ],
                type: TYPES.RADIO,
            },
            {
                question: __('What would you most like to get out of this course?'),
                answers: [
                    __('Expand my skills and/or advance in my career'),
                    __('Gain the skills to complete/build a personal project'),
                    __('General knowledge building'),
                    __('Just exploring the technology'),
                    __('See whether or not I like Udacity courses'),
                    __('Complete prerequisites for a Udacity Nanodegree program'),
                    SURVEY_TEXTS.OTHER_TEXT_INPUT,
                ],
                type: TYPES.RADIO,
                hasInput: true,
            },
            {
                question: __(
                    'What are the various platforms that you have used for online learning? Select all that apply'
                ),
                answers: [
                    __('Youtube'),
                    __('Text-based tutorial sites (e.g. W3schools)'),
                    __('Other online platforms (e.g. Coursera, Udemy, EdX)'),
                    SURVEY_TEXTS.OTHER_TEXT_INPUT,
                    SURVEY_TEXTS.NONE,
                ],
                type: TYPES.CHECKBOX,
                hasInput: true,
            },
            {
                question: __(
                    'How important is each of the following to you in a learning experience?'
                ),
                categories: [
                    __('Quality of lesson content'),
                    __('Community (collaboration with other students)'),
                    __('The projects I will complete'),
                ],
                range: 5,
                type: TYPES.CATEGORY_RATING,
                labels: [__('Not important at all'), __('Extremely important')],
            },
            {
                question: __(
                    'How important is each of the following to you in a learning experience? (Continue)'
                ),
                categories: [
                    __('Help services: getting help when I am stuck'),
                    __('Career services: help getting a job'),
                    SURVEY_TEXTS.OTHER_TEXT_INPUT,
                ],
                range: 5,
                type: TYPES.CATEGORY_RATING,
                hasInput: true,
                labels: [__('Not important at all'), __('Extremely important')],
            },
            {
                question: __('How much time do you spend per week on this course?'),
                answers: [
                    __('0 to 2 hours'),
                    __('2 to 5 hours'),
                    __('5 to 10 hours'),
                    __('10+ hours'),
                ],
                type: TYPES.RADIO,
            },
            {
                question: __('Which field are you most interested in?'),
                answers: [
                    __('Data Science / Data Analytics'),
                    __('Artificial Intelligence'),
                    __('Autonomous Systems'),
                    __('Programming / Development'),
                    __('Business (e.g. Digital Marketing)'),
                ],
                type: TYPES.RADIO,
            },
            {
                question: __(
                    'Based on your experience in the course so far, how likely are you to recommend a Udacity course to a friend or colleague?'
                ),
                range: 10,
                type: TYPES.RATING,
                labels: [__('Not likely at all'), __('Extremely likely')],
            },
            {
                question: __(
                    'Would you consider taking a paid Udacity Nanodegree Program?'
                ),
                range: 10,
                type: TYPES.RATING,
                labels: [__('Not likely at all'), __('Extremely likely')],
            },
        ];
    },
};