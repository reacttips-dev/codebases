import AuthService from 'services/authentication-service';
import {
    __
} from 'services/localization-service';

export default {
    fetchInvoice(params) {
        // adapted from https://stackoverflow.com/a/29039823
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();

            request.onreadystatechange = function() {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        resolve(request.response);
                    } else {
                        reject(request.response);
                    }
                } else if (request.readyState === 2) {
                    if (request.status === 200) {
                        request.responseType = 'blob'; // get blob to render pdf
                    } else {
                        request.responseType = 'json'; // get error as json
                    }
                }
            };
            request.open('POST', `${CONFIG.printerApiUrl}/v2/invoice`, true);
            request.setRequestHeader(
                'Authorization',
                `Bearer ${AuthService.getJWTToken()}`
            );
            request.send(JSON.stringify(params));
        });
    },

    mapInvoiceError(error) {
        switch (true) {
            case _.includes(error, '.html: no such file or directory'):
                return __('Unable to create invoice. Your language is not supported.');
            case _.includes(error, 'jwt missing'):
                return __('Unable to create invoice. You are not logged in.');
            default:
                return __('Unable to create invoice.');
        }
    },
};