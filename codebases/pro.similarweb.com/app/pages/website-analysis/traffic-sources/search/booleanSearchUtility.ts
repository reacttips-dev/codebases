import {
    IBooleanSearchChipItem,
    EBooleanSearchActionsTypes,
} from "@similarweb/ui-components/dist/boolean-search/src/BooleanSearch";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

const DEFAULT_SEPARATOR = ",";
// Angular doesnt allow + in URL, using | instead
export const booleanSearchToString = (
    chipsObject: IBooleanSearchChipItem[],
    shouldEncode = true,
) => {
    return chipsObject
        .map((item) => {
            const text = shouldEncode ? encodeURIComponent(item.text) : item.text;
            return `${
                item.action === EBooleanSearchActionsTypes.excludeKeyword ? "-" : "|"
            }${text}`;
        })
        .join(DEFAULT_SEPARATOR);
};
//Hotfix: SIM-31477
export const booleanSearchToStringIncludeTerms = (chipsObject: IBooleanSearchChipItem[]) => {
    return chipsObject
        .map((item) => (item.action !== EBooleanSearchActionsTypes.excludeKeyword ? item.text : ""))
        .join(",");
};
export const booleanSearchUrlToComponent = (param) => (param ? param.replace(/\|/g, "+") : "");

const getArrayFromApiString = (value, sign) => {
    if (value === "") {
        return [];
    }
    return value.split(DEFAULT_SEPARATOR).map((x) => `${sign}${x}`);
};

export const itemToId = (item: string) => `${item}${Math.random().toString(36).slice(2)}`;

const apiParamToChipsObject = (apiParam, exclude = false): IBooleanSearchChipItem[] => {
    if (apiParam === "") {
        return [];
    }
    return apiParam.split(DEFAULT_SEPARATOR).map((item) => {
        return {
            text: item,
            exclude,
            id: itemToId(item),
            action: exclude
                ? EBooleanSearchActionsTypes.excludeKeyword
                : EBooleanSearchActionsTypes.includeKeyword,
        };
    });
};

export const booleanSearchApiParamsToChipsObject = ({
    IncludeTerms = "",
    ExcludeTerms = "",
}): IBooleanSearchChipItem[] => {
    return [...apiParamToChipsObject(IncludeTerms), ...apiParamToChipsObject(ExcludeTerms, true)];
};

export const booleanSearchApiParamsToChips = ({ IncludeTerms = "", ExcludeTerms = "" }) => {
    const includeString = getArrayFromApiString(IncludeTerms, "+");
    const excludeString = getArrayFromApiString(ExcludeTerms, "-");
    return [...includeString, ...excludeString].join(DEFAULT_SEPARATOR);
};
export const booleanSearchChipsObjectToApiParams = (chipsObject: IBooleanSearchChipItem[]) => {
    const IncludeTerms = [];
    const ExcludeTerms = [];
    const IncludeUrls = [];
    const ExcludeUrls = [];
    chipsObject.forEach((item) => {
        switch (item.action) {
            case EBooleanSearchActionsTypes.excludeKeyword:
                ExcludeTerms.push(item.text);
                break;
            case EBooleanSearchActionsTypes.excludeUrl:
                ExcludeUrls.push(item.text);
                break;
            case EBooleanSearchActionsTypes.includeUrl:
                IncludeUrls.push(item.text);
                break;
            case EBooleanSearchActionsTypes.includeKeyword:
                IncludeTerms.push(item.text);
                break;
        }
    });
    return {
        IncludeTerms: IncludeTerms.join(DEFAULT_SEPARATOR),
        ExcludeTerms: ExcludeTerms.join(DEFAULT_SEPARATOR),
        IncludeUrls: IncludeUrls.join(DEFAULT_SEPARATOR),
        ExcludeUrls: ExcludeUrls.join(DEFAULT_SEPARATOR),
    };
};
export const booleanSearchToObject = (param) => {
    let IncludeTerms = "";
    let ExcludeTerms = "";
    if (param) {
        const chips = param.split(DEFAULT_SEPARATOR);
        const include = [];
        const exclude = [];
        chips.forEach((chip) => {
            const type = chip.substring(0, 1);
            const value = chip.substring(1);
            if (type === "|") {
                include.push(value);
            }
            if (type === "-") {
                exclude.push(value);
            }
        });
        IncludeTerms = include.join(DEFAULT_SEPARATOR);
        ExcludeTerms = exclude.join(DEFAULT_SEPARATOR);
    }
    return { IncludeTerms, ExcludeTerms };
};

export const booleanSearchTermsMixin = <T extends object>(
    BooleanSearchTerms: string,
    obj: T,
): T & { ExcludeTerms?: string; IncludeTerms?: string } => {
    const { IncludeTerms, ExcludeTerms } = booleanSearchToObject(BooleanSearchTerms);
    if (ExcludeTerms) {
        obj["ExcludeTerms"] = ExcludeTerms;
    } else {
        delete obj["ExcludeTerms"];
    }
    if (IncludeTerms) {
        obj["IncludeTerms"] = IncludeTerms;
    } else {
        delete obj["IncludeTerms"];
    }
    return obj;
};

const getFilterType = (item) => (item.exclude ? "exclude" : "include");
export const onChipAdd = (item) => {
    TrackWithGuidService.trackWithGuid("boolean.search.add.term", "click", {
        type: getFilterType(item),
        term: item.text,
    });
};
export const onChipRemove = (item) => {
    TrackWithGuidService.trackWithGuid("boolean.search.remove.term", "remove", {
        type: getFilterType(item),
        term: item.text,
    });
};

export const booleanSearchActionsTypesEnumToString = (action) => {
    switch (action) {
        case EBooleanSearchActionsTypes.includeKeyword:
            return "includeKeyword";
        case EBooleanSearchActionsTypes.excludeKeyword:
            return "excludeKeyword";
        case EBooleanSearchActionsTypes.includeUrl:
            return "includeUrl";
        case EBooleanSearchActionsTypes.excludeUrl:
            return "excludeUrl";
    }
};
