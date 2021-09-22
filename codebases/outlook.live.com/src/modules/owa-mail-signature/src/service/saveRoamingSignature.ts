import type { ObservableMap } from 'mobx';
import type { Signature } from '../store/schema/SignatureStore';
import { store as signatureStore } from '../store/signatureStore';
import { makePatchRequest } from 'owa-ows-gateway';
import {
    CLOUD_SETTING_BASE_URL,
    SIGNATURE_LIST_SETTING_NAME,
    DEFAULT_SIGNATURE_SETTING_NAME,
    DEFAULT_SIGNATURE_REPLY_SETTING_NAME,
} from '../utils/constants';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

const BASE_TICKS = 621355968000000000;
const TICKS_PER_MILLI = 10000;
const SIGNATURE_ENCODING_TYPE = 'encoding:utf-8';

const CUSTOM_REQUEST_HEADER = {
    'x-outlook-client': 'owa',
    Accept: 'application/json',
    'x-overridetimestamp': true,
};

export function saveRoamingSignature(roamingSignatureOption: ObservableMap<string, Signature>) {
    const patchBody: any[] = [];
    roamingSignatureOption.forEach((signature, key) => {
        patchBody.push(...signatureToRequestBody(signature));
    });

    if (patchBody.length > 0) {
        makePatchRequest(
            CLOUD_SETTING_BASE_URL /*URL */,
            patchBody /* body */,
            undefined /* correlationId */,
            true /* returnFullResponse */,
            {
                ...CUSTOM_REQUEST_HEADER,
                'x-islargesetting': true,
            } /* customHeader */
        );
    }
}

export function saveRoamingSignatureList() {
    const { roamingSignatureMap } = signatureStore;
    const roamingSignatureList: string[] = [];
    roamingSignatureMap.forEach(signature => {
        if (signature.html?.name) {
            roamingSignatureList.push(signature.html.name);
        }
    });
    const requestBody = [
        getRequestObject(
            SIGNATURE_LIST_SETTING_NAME /* name */,
            roamingSignatureList.join() /* value */,
            'BlobArray' /* type */,
            'RoamingSetting' /* itemClass */,
            SIGNATURE_LIST_SETTING_NAME /* secondaryKey */,
            false /* isLargeSetting */
        ),
    ];

    makePatchRequest(
        CLOUD_SETTING_BASE_URL /*URL */,
        requestBody /* body */,
        undefined /* correlationId */,
        true /* returnFullResponse */,
        CUSTOM_REQUEST_HEADER
    ); /* customHeader */
}

export function saveDefaultRoamingSignature(defaultSignatureName: string) {
    const requestBody = [
        getRequestObject(
            DEFAULT_SIGNATURE_SETTING_NAME /* name */,
            defaultSignatureName /* value */,
            'String' /* type */,
            'RoamingSetting' /* itemClass */,
            DEFAULT_SIGNATURE_SETTING_NAME /* secondaryKey */,
            false /* isLargeSetting */
        ),
    ];

    makePatchRequest(
        CLOUD_SETTING_BASE_URL /*URL */,
        requestBody /* body */,
        undefined /* correlationId */,
        true /* returnFullResponse */,
        CUSTOM_REQUEST_HEADER
    ); /* customHeader */
}

export function saveDefaultReplyRoamingSignature(defaultReplySignatureName: string) {
    const requestBody = [
        getRequestObject(
            DEFAULT_SIGNATURE_REPLY_SETTING_NAME /* name */,
            defaultReplySignatureName /* value */,
            'String' /* type */,
            'RoamingSetting' /* itemClass */,
            DEFAULT_SIGNATURE_REPLY_SETTING_NAME /* secondaryKey */,
            false /* isLargeSetting */
        ),
    ];

    makePatchRequest(
        CLOUD_SETTING_BASE_URL /*URL */,
        requestBody /* body */,
        undefined /* correlationId */,
        true /* returnFullResponse */,
        CUSTOM_REQUEST_HEADER
    ); /* customHeader */
}

function signatureToRequestBody(signature: Signature) {
    const signatureName = signature.html?.name;
    const txtValue = signature.txt ? signature.txt.value : '';
    return [
        getRequestObject(
            signatureName /* name */,
            signature.html?.value /* value */,
            'Blob' /* type */,
            'RoamingSetting' /* itemClass */,
            'htm' /* secondaryKey */,
            true /* isLargeSetting */,
            'roaming_signature_list' /* parentSetting */
        ),
        getRequestObject(
            signatureName /* name */,
            txtValue /* value */,
            'Blob' /* type */,
            'RoamingSetting' /* itemClass */,
            'txt' /* secondaryKey */,
            true /* isLargeSetting */,
            'roaming_signature_list' /* parentSetting */
        ),
    ];
}

function getRequestObject(
    name: string | undefined,
    value: string | undefined,
    type: string,
    itemClass: string,
    secondaryKey: string,
    isLargeSetting: boolean,
    parentSetting?: string
) {
    const scope = getUserConfiguration().SessionSettings?.UserEmailAddress;
    const timestamp = BASE_TICKS + Date.now() * TICKS_PER_MILLI;
    const metadata = SIGNATURE_ENCODING_TYPE;
    const requestObj = {
        name,
        value,
        type,
        scope,
        itemClass,
        timestamp,
        secondaryKey,
        metadata,
    };

    if (parentSetting) {
        requestObj['parentSetting'] = parentSetting;
    }

    if (isLargeSetting) {
        requestObj['value@is.Large'] = isLargeSetting;
    }

    return requestObj;
}
