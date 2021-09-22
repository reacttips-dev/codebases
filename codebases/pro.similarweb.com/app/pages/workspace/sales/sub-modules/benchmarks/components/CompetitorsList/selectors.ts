import { createSelector } from "reselect";
import { RootState } from "store/types";
import { selectSimilarWebsites } from "../../../opportunities-lists/store/selectors";
import { OpportunityMode } from "../../constants";
import { disableOnOpportunityChange } from "../../helpers";

const selectCurrentSimilarWebsites = createSelector(
    selectSimilarWebsites,
    (_state, { opportunityMode, greaterIsBetter, prospectValue }) => ({
        opportunityMode,
        greaterIsBetter,
        prospectValue,
    }),
    (similarSites, { opportunityMode, greaterIsBetter, prospectValue }) => {
        return disableOnOpportunityChange(
            similarSites,
            opportunityMode,
            greaterIsBetter,
            prospectValue,
        );
    },
);

export const mapStateToProps = (
    state: RootState,
    props: { opportunityMode: OpportunityMode; greaterIsBetter: boolean; prospectValue: number },
) => {
    // TODO: Move "similarWebsites" to BenchmarksContext
    return {
        similarWebsites: selectCurrentSimilarWebsites(state, props),
    };
};
