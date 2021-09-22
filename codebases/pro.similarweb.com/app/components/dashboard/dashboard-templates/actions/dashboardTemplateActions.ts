import {
    DashboardTemplateService,
    EDashboardOriginType,
    EDashboardParentType,
    IDashboardTemplateService,
} from "../DashboardTemplateService";
import {
    CLEAR_SELECTED_TEMPLATE,
    SELECT_TEMPLATE,
    TEMPLATE_ADD_KEY,
    TEMPLATE_ADD_KEYS,
    TEMPLATE_CHANGE_COUNTRY,
    TEMPLATE_REMOVE_KEY,
    TEMPLATE_SET_INITIAL_TITLE,
    TEMPLATE_SET_ORIGIN,
    TEMPLATE_SET_PARENT,
} from "./dashboardTemplateActionTypes";
import { EFamilyTypes } from "../components/DashboardTemplatesConfig";

const getKeyType = (familyType: EFamilyTypes): string => {
    switch (familyType) {
        case EFamilyTypes.Website:
            return "website";
        case EFamilyTypes.Apps:
            return "app";
        case EFamilyTypes.Categories:
            return "industry";
        case EFamilyTypes.Keyword:
            return "keyword";
        default:
            return null;
    }
};

export const selectDashboardTemplate = (
    id,
    service: IDashboardTemplateService = DashboardTemplateService,
) => {
    const dashboardTemplate = service.getTemplateById(id);
    const keyType = getKeyType(dashboardTemplate ? dashboardTemplate.familyType : null);
    const maxItems = dashboardTemplate ? dashboardTemplate.maxItems : null;
    return {
        type: SELECT_TEMPLATE,
        id,
        keyType,
        maxItems,
    };
};

export const clearSelectedTemplate = () => {
    return {
        type: CLEAR_SELECTED_TEMPLATE,
    };
};

export const templateAddKey = (key) => {
    return {
        type: TEMPLATE_ADD_KEY,
        key,
    };
};

export const templateAddKeys = (keys) => {
    return {
        type: TEMPLATE_ADD_KEYS,
        keys,
    };
};

export const templateRemoveKey = (key) => {
    return {
        type: TEMPLATE_REMOVE_KEY,
        key,
    };
};

export const templateChangeCountry = (country: number) => {
    return {
        type: TEMPLATE_CHANGE_COUNTRY,
        country,
    };
};

export const templateSetParent = (parentType: EDashboardParentType, parentId: string) => {
    return {
        type: TEMPLATE_SET_PARENT,
        parentType,
        parentId,
    };
};

export const templateSetOrigin = (originType: EDashboardOriginType, originId: string) => {
    return {
        type: TEMPLATE_SET_ORIGIN,
        originType,
        originId,
    };
};

export const templateSetInitialTitle = (initialTitle: string) => {
    return {
        type: TEMPLATE_SET_INITIAL_TITLE,
        initialTitle,
    };
};
