import {
    LEADING_FOLDERS_DATA_READY,
    LEADING_FOLDERS_FETCH_DATA,
} from "../../pages/website-analysis/website-content/leading-folders/LeadingFoldersActions";

function getDefaultState() {
    return {
        leadingFolderHeader: undefined,
    };
}
export default function (state = getDefaultState(), action) {
    switch (action.type) {
        case LEADING_FOLDERS_DATA_READY:
            return {
                ...state,
                leadingFolderHeader: action.data ? action.data.Header : undefined,
            };
        case LEADING_FOLDERS_FETCH_DATA:
            return getDefaultState();
        default:
            return state;
    }
}
