import ExternalScriptLoader from 'helpers/external-script-loader';

var initted = false;

const AUTH_OPTIONS = {
    client_id: CONFIG.googleClientId,
    scope: 'profile email',
};

var GoogleApiService = {
    initAuth() {
        if (initted) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            window.googleAsyncInit = () => {
                window.gapi.load('client:auth2', () => {
                    window.gapi.auth2.init(AUTH_OPTIONS).then(() => {
                        initted = true;
                        resolve();
                    });
                });
            };

            ExternalScriptLoader.load(
                '//apis.google.com/js/client:platform.js?onload=googleAsyncInit',
                'google-jssdk'
            );
        });
    },

    initClient(options) {
        return new Promise((resolve, reject) => {
            this.loadScript().then(() => {
                window.gapi.load('client:auth2', {
                    callback: () => {
                        window.gapi.client
                            .init(options)
                            .then(() => {
                                resolve();
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    },
                    timeout: 5000,
                    onerror: () => {
                        reject(new Error('Google library failed to load!'));
                    },
                    ontimeout: () => {
                        reject(new Error('Google library load timed out!'));
                    },
                });
            });
        });
    },

    loadScript() {
        return ExternalScriptLoader.promisedLoad(
            'https://apis.google.com/js/client:platform.js',
            'gclientapi-jssdk'
        );
    },

    getCurrentUser() {
        return window.gapi.auth2.getAuthInstance().currentUser.get();
    },

    getCurrentUserEmail() {
        return this.getCurrentUser().getBasicProfile().getEmail();
    },

    isSignedIn() {
        if (!this.isGapiLoaded()) {
            return false;
        }

        let auth2 = window.gapi.auth2;

        if (auth2) {
            return window.gapi.auth2.getAuthInstance().isSignedIn.get();
        } else {
            return false;
        }
    },

    isGapiLoaded() {
        return typeof window.gapi !== 'undefined';
    },

    signIn() {
        window.gapi.auth2.getAuthInstance().signIn();
    },

    signOut() {
        window.gapi.auth2.getAuthInstance().signOut();
    },

    subscribeSignInChanges(fn) {
        return window.gapi.auth2.getAuthInstance().currentUser.listen(fn);
    },

    getDoc(docId) {
        return window.gapi.client.docs.documents.get({
            documentId: docId,
        });
    },

    fetchName() {
        return this.initAuth().then(() => {
            return new Promise((resolve) => {
                if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
                    var profile = window.gapi.auth2
                        .getAuthInstance()
                        .currentUser.get()
                        .getBasicProfile();
                    resolve(profile.getName());
                }
            });
        });
    },
};

export default GoogleApiService;