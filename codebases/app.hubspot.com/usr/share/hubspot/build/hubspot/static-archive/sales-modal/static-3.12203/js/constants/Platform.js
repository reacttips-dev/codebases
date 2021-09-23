'use es6';

import PropTypes from 'prop-types';
export var CRM = 'CRM';
export var SEQUENCESUI = 'SequencesUI'; // https://git.hubteam.com/HubSpot/SidekickEmailModal/blob/master/static/js/constants/Platforms.js

export var GMAIL = 'GMAIL';
export var OUTLOOK = 'OUTLOOK';
export var OUTLOOK_365 = 'OUTLOOK_365';
export var PlatformPropType = PropTypes.oneOf([CRM, SEQUENCESUI, GMAIL, OUTLOOK, OUTLOOK_365]);