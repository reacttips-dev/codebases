import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {
    AgeService,
    LocalizationService
} from './services';
import {
    i18n
} from './services/localization-service';
import Analytics from '@udacity/ureact-analytics';
import webPerf from '@udacity/web-perf-metrics';
import {
    config,
    initialize
} from 'config';
import RoutesHelper from './app/helpers/routes-helper';

import './app/app.module.scss';
import './app/initializers/sentry';
import './app/initializers/adblock';

const SITE_IDENTIFIER = 'auth-web';

// Flip configs to staging if necessary
initialize();

/**
 * Segment analytics
 */
Analytics.init(config.SEGMENT_KEY);

i18n
    .activate()
    .then((locale) => {
        const rtlLangs = [
            'ar',
            'arc',
            'dz',
            'far',
            'ha',
            'he',
            'khw',
            'ks',
            'ku',
            'ps',
            'ur',
            'yi'
        ];

        document.body.lang = locale;

        // If the locale is a Right-to-Left (RTL) language, set the direction
        // on the document body
        if (rtlLangs.indexOf(locale) !== -1) {
            document.body.dir = 'rtl';
        } else {
            document.body.dir = 'ltr';
        }
    })
    .then(() => {
        i18n
            .fetchGeoLocation()
            .then((data) => {
                const countryCode =
                    RoutesHelper.getQueryParam(window.location, 'override_location') ||
                    data.countryCode;
                LocalizationService.setGeoLocation(countryCode);
                // Save this result so we don't need to call geode again
                AgeService.setAgeRequirement({
                    ageRequired: data.ageRequired,
                    ageMinimum: data.ageMinimum
                });
            })
            .catch((error) => {
                // eslint-disable-next-line
                console.log(
                    'Failed to determine location, using default of US: ' + error
                );
                LocalizationService.setGeoLocation('US');
            })
            .then(() => {
                // Don't import this at the top, else it will trigger calls to
                // ureact-i18n that has not been activated yet.
                const App = require('./app/app').default;
                ReactDOM.render( < App / > , document.getElementById('root'));
                // The virtual DOM is now rendered into the real DOM, this is the first
                // time the user sees something.
                webPerf.track(SITE_IDENTIFIER);
            });
    })
    // eslint-disable-next-line
    .catch((error) => console.log(error));