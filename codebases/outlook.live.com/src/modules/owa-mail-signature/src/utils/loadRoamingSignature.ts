import { makeGetRequest } from 'owa-ows-gateway';
import setDefaultSignatureName from '../actions/setDefaultSignatureName';
import setLegacySignatureInStore from '../actions/setLegacySignatureInStore';
import setRoamingSignatureInStore from '../actions/setRoamingSignatureInStore';
import populateFirstSignature from './populateFirstSignature';
import {
    CLOUD_SETTING_BASE_URL,
    HTML_SIGNATURE_SETTING_NAME,
    TXT_SIGNATURE_SETTING_NAME,
    SIGNATURE_LIST_SETTING_NAME_LO,
    DEFAULT_SIGNATURE_SETTING_NAME_LO,
    DEFAULT_SIGNATURE_REPLY_SETTING_NAME_LO,
} from './constants';

let loadRoamingSignaturePromise: Promise<void>;

export default async function loadRoamingSignature() {
    if (!loadRoamingSignaturePromise) {
        loadRoamingSignaturePromise = makeGetRequest(
            `${CLOUD_SETTING_BASE_URL}?settingname=${HTML_SIGNATURE_SETTING_NAME},${TXT_SIGNATURE_SETTING_NAME},${SIGNATURE_LIST_SETTING_NAME_LO},${DEFAULT_SIGNATURE_SETTING_NAME_LO},${DEFAULT_SIGNATURE_REPLY_SETTING_NAME_LO}`,
            undefined /* CorrellationId  */,
            false /* ReturnFullRequest */,
            {
                'x-outlook-client': 'owa',
            } /* CustomHeader */
        ).then(settingResponse => {
            let signatureList;
            settingResponse.forEach(response => {
                const settingName = response.name?.toLowerCase();
                //Currently Desktop has some problem with the capitalization of the settings name
                //settings name should not be case sensitive but desktop is having some trouble peeling
                //depencencies from the case sensitivity. Here we add toLowerCase to all the case name
                //to avoid any case caused issues.
                switch (settingName) {
                    case HTML_SIGNATURE_SETTING_NAME:
                        setLegacySignatureInStore('html', response);
                        break;
                    case TXT_SIGNATURE_SETTING_NAME:
                        setLegacySignatureInStore('txt', response);
                        break;
                    case SIGNATURE_LIST_SETTING_NAME_LO:
                        signatureList = response.value;
                        loadAllSignaturesInList(response.value);
                        break;
                    case DEFAULT_SIGNATURE_SETTING_NAME_LO:
                        setDefaultSignatureName(response.value, false /* isReply */);
                        break;
                    case DEFAULT_SIGNATURE_REPLY_SETTING_NAME_LO:
                        setDefaultSignatureName(response.value, true /* isReply */);
                        break;
                }
            });
            if (!signatureList || signatureList == '') {
                // if the user does not have any signature
                // we create the first roaming signature based on the legacy signature
                populateFirstSignature();
            }
        });
    }
    return loadRoamingSignaturePromise;
}

function loadAllSignaturesInList(signatureNameList: string) {
    makeGetRequest(
        `${CLOUD_SETTING_BASE_URL}?settingname=${signatureNameList}`,
        undefined /* correlationId */,
        false /* returnFullResponse */,
        {
            'x-islargesetting': true,
        }
    ).then(settingResponse => {
        settingResponse.forEach(signatureResponse => {
            setRoamingSignatureInStore(signatureResponse);
        });
    });
}
