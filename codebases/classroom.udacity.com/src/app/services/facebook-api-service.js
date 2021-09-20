import ExternalScriptLoader from 'helpers/external-script-loader';

var FacebookApiService = {
    init() {
        if (window.FB) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            window.fbAsyncInit = function() {
                window.FB.init({
                    appId: CONFIG.facebookAppId,
                    xfbml: true,
                    version: 'v2.7',
                    status: true,
                });
                resolve();
            };

            ExternalScriptLoader.load(
                '//connect.facebook.net/en_US/sdk.js',
                'facebook-jssdk'
            );
        });
    },

    fetchName() {
        return this.init().then(() => {
            return new Promise((resolve) => {
                window.FB.getLoginStatus((response) => {
                    if (response.status === 'connected') {
                        window.FB.api('/me', (response) => {
                            if (response.error) {
                                resolve('Error loading name from Facebook');
                            } else {
                                resolve(response.name);
                            }
                        });
                    } else {
                        resolve('Not logged into Facebook');
                    }
                });
            });
        });
    },
};

export default FacebookApiService;