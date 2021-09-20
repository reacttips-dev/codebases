import AuthenticationService from 'services/authentication-service';
import Hashes from 'jshashes';

if (CONFIG.newRelicAppId) {
    window.NREUM.info = {
        beacon: 'bam.nr-data.net',
        errorBeacon: 'bam.nr-data.net',
        licenseKey: '2059d2614a',
        applicationID: CONFIG.newRelicAppId,
        sa: 1,
    };
}

setTimeout(() => {
    if (AuthenticationService.isAuthenticated()) {
        const user = AuthenticationService.getCurrentUser();
        if (user) {
            const SHA256 = new Hashes.SHA256();
            window.newrelic.setCustomAttribute('sid', SHA256.hex(user.uid));
        }
    }
}, 0);