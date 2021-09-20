import $ from 'jquery';
import AuthenticationService from 'services/authentication-service';
import {
    browserHistory
} from 'react-router';

/* Handle authentication errors (due to expired or missing JWT token) */
$(document).ajaxError(function(event, request, settings) {
    if (request.status === 401 && settings.url.startsWith(CONFIG.serverUrl)) {
        AuthenticationService.authenticate(window.location);
        browserHistory.replace('/loading');
        event.stopImmediatePropagation();
    }
});