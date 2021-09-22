import 'js/app/polyfills';
import timing from 'js/lib/timing';
import 'js/constants/userAgent';
import initializeHeartbeatTracking from 'js/lib/heartbeat';

// execute on module load
require('bundles/ads-tracking/safeEnableAdsTracking').default();

initializeHeartbeatTracking();

timing.setMark('loaderExecuted');
