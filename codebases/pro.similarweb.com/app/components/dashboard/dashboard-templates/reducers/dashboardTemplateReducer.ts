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
} from "../actions/dashboardTemplateActionTypes";
import { EDashboardOriginType, EDashboardParentType } from "../DashboardTemplateService";
import { StateObjectType } from "userdata";

export interface IDashboardTemplateState {
    keys?: Array<{ name: string; type?: string }>;
    country?: number;
    selectedTemplate?: number;
    parentType?: EDashboardParentType;
    parentId?: string;
    originType?: EDashboardOriginType;
    originId?: string;
    initialTitle?: string;
}

const initialState: IDashboardTemplateState = {
    keys: [],
    selectedTemplate: null,
    country: null,
    parentType: null,
    parentId: null,
    originType: null,
    originId: null,
    initialTitle: null,
};

export default function (state: IDashboardTemplateState = initialState, action) {
    switch (action.type) {
        case SELECT_TEMPLATE:
            const keyType = action.keyType;
            // remove keys that has invalid type (if action.type is defined)
            let keys = state.keys.filter((key) => !keyType || key.type === keyType);
            if (action.maxItems) {
                keys = keys.slice(0, action.maxItems);
            }
            return {
                ...state,
                selectedTemplate: action.id,
                keys,
            };
        case CLEAR_SELECTED_TEMPLATE:
            return {
                ...state,
                ...initialState,
            };
        case TEMPLATE_ADD_KEY:
            return {
                ...state,
                keys: [...state.keys, action.key],
            };
        case TEMPLATE_ADD_KEYS:
            return {
                ...state,
                keys: [...state.keys, ...action.keys],
            };
        case TEMPLATE_REMOVE_KEY:
            return {
                ...state,
                keys: state.keys.filter((key) => {
                    return key.name !== action.key.name;
                }),
            };
        case TEMPLATE_CHANGE_COUNTRY:
            return {
                ...state,
                country: action.country,
            };
        case TEMPLATE_SET_PARENT:
            return {
                ...state,
                parentType: action.parentType,
                parentId: action.parentId,
            };
        case TEMPLATE_SET_ORIGIN:
            return {
                ...state,
                originType: action.originType,
                originId: action.originId,
            };
        case TEMPLATE_SET_INITIAL_TITLE:
            return {
                ...state,
                initialTitle: action.initialTitle,
            };
        default:
            return {
                ...state,
            };
    }
}
