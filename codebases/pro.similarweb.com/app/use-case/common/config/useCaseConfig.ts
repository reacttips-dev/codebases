import { SWSettings } from "common/services/swSettings";
import { ITile } from "use-case/common/types";

const parseJSONSafe = <T>(str: string, fallback: T): T => {
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

export const getUseCaseConfig = (swSettings: SWSettings): ITile[] =>
    parseJSONSafe<ITile[]>(swSettings?.components?.UseCaseScreen?.resources?.Config, []);

export const hasUseCaseConfig = (swSettings: SWSettings): boolean =>
    Boolean(getUseCaseConfig(swSettings)?.length);
