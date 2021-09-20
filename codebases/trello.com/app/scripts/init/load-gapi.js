// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
const $ = require('jquery');
const { GoogleApi } = require('app/scripts/lib/google-api');

// Load the js api immediately
$.getScript('https://apis.google.com/js/api.js', () => GoogleApi.loadedAuth());
