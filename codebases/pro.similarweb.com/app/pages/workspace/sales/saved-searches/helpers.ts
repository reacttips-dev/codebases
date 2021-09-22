import _ from "lodash";
import { ISavedSearchesItem } from "pages/workspace/common/types";

export const getOnlyWithAutoReRunEnabled = (
    savedSearches: ISavedSearchesItem[],
): ISavedSearchesItem[] => {
    return savedSearches.filter(_.property("queryDefinition.auto_rerun_activated"));
};
