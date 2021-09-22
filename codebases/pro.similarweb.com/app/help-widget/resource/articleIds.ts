import { swSettings } from "common/services/swSettings";

const parseJSONSafe = (str, fallback) => {
    if (!str) {
        return fallback;
    }

    try {
        // HACK: sometimes the backend returns a string and sometimes it returns an already parsed value
        return typeof str === "object" ? str : JSON.parse(str);
    } catch (e) {
        return fallback;
    }
};

const helpComponentsMap = () =>
    parseJSONSafe(swSettings?.components?.WidgetForEducation?.resources?.ComponentArticles, {});

const articleByComponentId = (helpComponentId) => {
    const map = helpComponentsMap();
    return map && helpComponentId && map[helpComponentId];
};

export const getArticleId = (helpComponentId) => articleByComponentId(helpComponentId);
