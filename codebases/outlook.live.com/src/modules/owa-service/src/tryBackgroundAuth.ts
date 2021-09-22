import getAuthenticationUrlOperation from './operation/getAuthenticationUrlOperation';
import AuthenticationUrlResponseCode from './contract/AuthenticationUrlResponseCode';

const WAIT_TIME_AFTER_ATTEMPT: number = 82800000; // 23 Hours in Milliseconds.
const ONEMINUTE: number = 60000; // 1 Minute in Milliseconds.
const BACKGROUND_AUTH: string = 'backgroundauth';

let iframe: HTMLIFrameElement | null = null;
let lastAttemptTime: number | null = null;

export async function tryBackgroundAuth() {
    if (iframe != null) {
        return;
    }

    if (lastAttemptTime != null && Date.now() - lastAttemptTime < WAIT_TIME_AFTER_ATTEMPT) {
        return;
    } else {
        lastAttemptTime = Date.now();
    }

    iframe = window.document.createElement('iframe');
    iframe.setAttribute('id', BACKGROUND_AUTH);
    iframe.style.display = 'none';

    getAuthenticationUrlOperation({})
        .then(response => {
            if (
                response.ResultCode != AuthenticationUrlResponseCode.Success ||
                response.AuthenticationUrl == null ||
                response.AuthenticationUrl == ''
            ) {
                iframe = null;
                return;
            }
            if (iframe) {
                window.document.body.appendChild(iframe);
                window.addEventListener('message', handleIframeResponse, false);
                iframe.src = response.AuthenticationUrl;
            }
            setupBackgroundAuthTimeOut();
        })
        .catch(function (e) {
            iframe = null;
        });
}

function setupBackgroundAuthTimeOut() {
    // Run the time out function after one minute.
    setTimeout(function () {
        if (iframe != null) {
            cleanUpIframe();
        }
    }, ONEMINUTE);
}

function handleIframeResponse(e) {
    if (e.origin == window.location.origin && e.data && e.data.split) {
        var action = e.data.split(':')[0];
        if (action == 'backgroundAuthResponse') {
            cleanUpIframe();
        }
    }
}

function cleanUpIframe() {
    if (iframe) {
        window.document.body.removeChild(iframe);
        iframe = null;
        window.document.removeEventListener('message', handleIframeResponse);
    }
}
