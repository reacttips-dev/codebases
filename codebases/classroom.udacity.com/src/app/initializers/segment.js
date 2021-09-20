import Analytics from '@udacity/ureact-analytics';
import AnalyticsService from 'services/analytics-service';
import AuthenticationService from 'services/authentication-service';
import webPerf from '@udacity/web-perf-metrics';

Analytics.init(CONFIG.segmentWriteKey);

// we call this in a timeout to make sure the ajax initializer has run first
// and the current user jwt is present in reqs.
setTimeout(() => {
    if (AuthenticationService.isAuthenticated()) {
        var user = AuthenticationService.getCurrentUser();
        if (user) {
            AnalyticsService.identify(user);
        }
    }
}, 0);

webPerf.track('Classroom');