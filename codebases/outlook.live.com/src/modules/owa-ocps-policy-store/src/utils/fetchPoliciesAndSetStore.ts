import getBusinessUserOcpsPolicies from '../services/getBusinessUserOcpsPolicies';
import {
    FEEDBACK_SETTING_ID,
    EMAILCOLLECTION_SETTING_ID,
    NPS_SURVEY_SETTING_ID,
    SCREENSHOT_SETTING_ID,
    RECOMMEND_OUTLOOK_SETTING_ID,
    CHEKIN_INTERVAL_HEADER_KEY,
    USER_OCPS_POLICIES_EXPIRATION,
    USER_OCPS_NPS_SURVEY_ENABLED,
    USER_OCPS_FEEDBACK_ENABLED,
    USER_OCPS_EMAIL_COLLECTION_ENABLED,
    USER_OCPS_SCREENSHOT_ENABLED,
    USER_OCPS_OUTLOOK_RECOMMENDATION_ENABLED,
} from './constants';
import { getItem, setItem, itemExists } from 'owa-local-storage';
import { owaDate, addMinutes } from 'owa-datetime';
import type OcpsPolicyResponse from '../store/schema/OcpsPolicyResponse';

let fetchOcpsPoliciesPromise: Promise<void>;

export default async function fetchPoliciesAndSetStore(): Promise<void> {
    if (!fetchOcpsPoliciesPromise) {
        fetchOcpsPoliciesPromise = fetchPoliciesAndSetStorePromise();
    }

    return fetchOcpsPoliciesPromise;
}

async function fetchPoliciesAndSetStorePromise(): Promise<void> {
    let userOcpsPoliciesExpiration: string | null = '';

    if (itemExists(window, USER_OCPS_POLICIES_EXPIRATION)) {
        userOcpsPoliciesExpiration = getItem(window, USER_OCPS_POLICIES_EXPIRATION);
    }

    if (
        !userOcpsPoliciesExpiration ||
        owaDate('UTC') > owaDate('UTC', new Date(userOcpsPoliciesExpiration).toISOString())
    ) {
        let response: Response;
        try {
            response = await getBusinessUserOcpsPolicies();
        } catch (error) {
            setItem(window, USER_OCPS_FEEDBACK_ENABLED, '1');
            setItem(window, USER_OCPS_EMAIL_COLLECTION_ENABLED, '1');
            setItem(window, USER_OCPS_NPS_SURVEY_ENABLED, '1');
            setItem(window, USER_OCPS_SCREENSHOT_ENABLED, '1');
            setItem(window, USER_OCPS_OUTLOOK_RECOMMENDATION_ENABLED, '1');
            return;
        }

        let checkinInterval = response.headers.has(CHEKIN_INTERVAL_HEADER_KEY)
            ? response.headers.get(CHEKIN_INTERVAL_HEADER_KEY)
            : '90';

        let ocpsResponse: OcpsPolicyResponse = await response.json();
        let today = owaDate('UTC', new Date().toISOString());
        if (checkinInterval) {
            setItem(
                window,
                USER_OCPS_POLICIES_EXPIRATION,
                addMinutes(today, parseInt(checkinInterval)).toString()
            );
        }

        if (ocpsResponse?.value[0]?.policiesPayload.length > 0) {
            ocpsResponse.value[0].policiesPayload.forEach(policy => {
                if (policy.settingId == FEEDBACK_SETTING_ID) {
                    setItem(window, USER_OCPS_FEEDBACK_ENABLED, policy.value);
                }
                if (policy.settingId == EMAILCOLLECTION_SETTING_ID) {
                    setItem(window, USER_OCPS_EMAIL_COLLECTION_ENABLED, policy.value);
                }
                if (policy.settingId == NPS_SURVEY_SETTING_ID) {
                    setItem(window, USER_OCPS_NPS_SURVEY_ENABLED, policy.value);
                }
                if (policy.settingId == SCREENSHOT_SETTING_ID) {
                    setItem(window, USER_OCPS_SCREENSHOT_ENABLED, policy.value);
                }
                if (policy.settingId == RECOMMEND_OUTLOOK_SETTING_ID) {
                    setItem(window, USER_OCPS_OUTLOOK_RECOMMENDATION_ENABLED, policy.value);
                }
            });
        }
    }

    return;
}
