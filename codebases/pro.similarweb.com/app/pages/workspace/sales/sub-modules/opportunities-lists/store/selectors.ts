import { RootState } from "single-spa/store/types";
import { WithOpportunitiesListId } from "../types";
import { selectOpportunitiesSlice } from "../../../store/selectors";
import { createStatePropertySelector } from "../../../helpers";

const select = createStatePropertySelector(selectOpportunitiesSlice);

export const selectUpdatingList = select("updatingList");
export const selectActiveWebsite = select("selectedWebsite");
export const selectSimilarWebsites = select("similarWebsites");

/**
 * Ignores given state and returns opportunitiesListId from given props
 * @param _
 * @param props
 */
export const selectOpportunitiesListIdFromProps = <P extends WithOpportunitiesListId>(
    _: RootState,
    props: P,
) => {
    return props.opportunitiesListId;
};
