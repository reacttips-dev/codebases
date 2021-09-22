import * as _ from "lodash";
import engagementResource from "../../../scripts/common/resources/userEngagementResource";

const DID_COMPARE = "didCompare";
export const STATE_COMPARE_PREFIX = "compareMode";

declare const window;

export const getWebsiteLink = (domain = "") => {
    if (_.startsWith(domain, "*")) {
        return null;
    } else {
        return `http://${domain}`;
    }
};

export const getDisplayName = (name) => {
    if (window.innerWidth <= 768) {
        return name.substring(0, 2);
    } else {
        return name;
    }
};

export const setUserCompareStatue = () => {
    return engagementResource.logEngagement({ engType: DID_COMPARE });
};

export const getUserCompareStatue = async () => {
    const userEngagements = await engagementResource.getAll();
    const userCompareStatus = userEngagements.hasOwnProperty(DID_COMPARE);
    return userCompareStatus;
};

export const setStateCompareStatus = (stateId) => {
    return engagementResource.logEngagement({ engType: `${stateId}` });
};

export const getStateCompareStatus = async (stateId) => {
    const userEngagements = await engagementResource.getAll();
    const stateCompareStatus = userEngagements.hasOwnProperty(`${STATE_COMPARE_PREFIX}_${stateId}`);
    return stateCompareStatus;
};

export const getAllStatesCompareStatus = async () => {
    const userEngagements = await engagementResource.getAll();
    const states = Object.keys(userEngagements).filter(
        (key) => key.indexOf(STATE_COMPARE_PREFIX) > -1,
    );
    return states;
};
