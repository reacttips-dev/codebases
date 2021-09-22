import { DefaultFetchService } from "services/fetchService";

interface ExtraConfigs {
    phoneNumber: string;
}

interface ListResults {
    IsIssueRequiredBeforeVerify: boolean;
    Extras: ExtraConfigs;
    Provider: string;
    Vendor: string;
    Type: string;
    Result: string;
}

interface APIResult {
    result;
    Succeeded: boolean;
    Status: string;
}

const fetchService = DefaultFetchService.getInstance();
let aborting = false;
let reqController;

/**
 * Check if the user should perform a 2 factor authentication
 * in order to use the impersonation function.
 *
 * @returns {boolean} True if the use needs an authentication.
 */
const shouldAuthenticate = async () => {
    return new Promise((resolve, reject) => {
        if (!initRequest()) reject();

        fetchService
            .get("/2fa")
            .then((res: APIResult) => {
                if (!res.Succeeded) reject();
                else resolve(res.Status === "NeedTwoFactorAuthentication"); //need 2fa authentication
            })
            .catch((err) => {
                console.error(err);
                reject();
            })
            .finally(() => finishRequest());
    });
};

/**
 * @returns {Array<ListResults>} A list of all available authentication methods.
 */
const listAuthenticationOptions = async () => {
    return new Promise((resolve, reject) => {
        if (!initRequest()) reject();

        fetchService
            .get("/2fa/list")
            .then((res: APIResult) => {
                if (!res.Succeeded) reject();
                else resolve(res.result);
            })
            .catch((err) => {
                console.error(err);
                reject();
            })
            .finally(() => finishRequest());
    });
};

/**
 * Verify an authentication code or issued transaction.
 *
 * @param provider - The name of the transaction provider
 * @param vendor - The name of the transaction vendor
 * @param type - The type of transaction
 * @param transactionId - The transaction ID to verify (optional)
 * @param code - The code to verify (optional)
 * @returns {boolean} True if the authentication is verified.
 */
const verify = async (
    provider: string,
    vendor = "",
    type: string,
    transactionId = "",
    code = "",
) => {
    return new Promise((resolve, reject) => {
        if (!initRequest()) reject();

        const vendorEntry = vendor ? `&vendor=${vendor}` : "";
        const url = `/2fa/verify?provider=${provider}${vendorEntry}&factorType=${type}`;
        const body = {
            TransactionId: transactionId,
            Secret: code,
        };

        fetchService
            .post(url, body, { numberOfRetry: 1, cancellation: reqController.signal })
            .then((res: APIResult) => {
                if (!res.Succeeded) resolve(false);
                else {
                    const verification = res.result.Result;
                    resolve(verification === "Accepted");
                }
            })
            .catch((err) => {
                console.error(err);
                reject();
            })
            .finally(() => finishRequest());
    });
};

/**
 * Push a notification to the user's phone via Okta.
 *
 * @returns {boolean} True if the push notification has been confirmed.
 */
const pushNotification = async () => {
    return new Promise((resolve, reject) => {
        if (!initRequest()) reject();

        const provider = "okta";
        const vendor = "okta";
        const type = "push";
        const url = `/2fa/issue?provider=${provider}&vendor=${vendor}&factorType=${type}`;

        fetchService
            .get(url)
            .then(async (res: APIResult) => {
                if (!res.Succeeded) reject();
                else {
                    const transaction = res.result.TransactionId;
                    const verified = await verify(provider, vendor, type, transaction);
                    resolve(verified);
                }
            })
            .catch((err) => {
                finishRequest();
                console.error(err);
                reject();
            });
    });
};

/**
 * Send an SMS message, containing a code, to the user's phone.
 */
const sendSMS = async () => {
    return new Promise((resolve, reject) => {
        if (!initRequest()) reject();

        const provider = "okta";
        const vendor = "okta";
        const type = "sms";
        const url = `/2fa/issue?provider=${provider}&vendor=${vendor}&factorType=${type}`;

        fetchService
            .get(url)
            .then(async (res: APIResult) => {
                if (!res.Succeeded) reject();
                else resolve(res);
            })
            .catch((err) => {
                console.error(err);
                reject();
            })
            .finally(() => finishRequest());
    });
};

/**
 * Abort the current request if possible.
 */
const abort = () => {
    if (reqController) {
        aborting = true;
        reqController.abort();
        reqController = null;
    }
};

/**
 * Initiate the AbortController object
 * and check if the request should be made.
 *
 * @returns True if the request should be made,
 *          or false if it is already aborted.
 */
const initRequest = () => {
    if (!aborting) {
        reqController = new AbortController();
        return true;
    } else return false;
};

/**
 * Indicate that the current request is over.
 */
const finishRequest = () => {
    reqController = null;
    aborting = false;
};

export default {
    shouldAuthenticate,
    listAuthenticationOptions,
    pushNotification,
    sendSMS,
    verify,
    abort,
};

export { ListResults };
