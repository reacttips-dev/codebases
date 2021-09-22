import { swLog } from "@similarweb/sw-log";

const engagementEndpoint = "/api/userdata/engagements";

const getAll = async () => {
    try {
        const response = await fetch(`${engagementEndpoint}/`, {
            credentials: "include",
        });
        if (!response.ok) {
            swLog.error(response.statusText);
            return {};
        }
        return response.json();
    } catch (ex) {
        swLog.error(ex);
        return {};
    }
};

const getShowUpdates = async () => {
    try {
        const response = await fetch(`${engagementEndpoint}/pu`, {
            credentials: "include",
        });
        if (!response.ok) {
            swLog.error(response.statusText);
            return {};
        }
        return response.json();
    } catch (ex) {
        swLog.error(ex);
        return {};
    }
};

const logEngagement = async (params) => {
    try {
        const paramsString = Object.entries(params).reduce((prev, [key, value]) => {
            return `${prev}&${key}=${value}`;
        }, "");
        return fetch(`${engagementEndpoint}/add?${paramsString}`);
    } catch (ex) {
        swLog.error(ex);
        return {};
    }
};

export default {
    logEngagement,
    getShowUpdates,
    getAll,
};
