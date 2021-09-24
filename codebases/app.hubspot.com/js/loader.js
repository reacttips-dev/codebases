'use es6';

import FireAlarmApp from './FireAlarmApp';
var hubspot = window.hubspot = window.hubspot || {};
hubspot.fireAlarm = hubspot.fireAlarm || new FireAlarmApp(hubspot).start();