/**
 * Created by Sahar.Rehani on 4/11/2018.
 */

import * as PropTypes from "prop-types";
import * as React from "react";
import { StatelessComponent } from "react";
import { TrackWithGuidService } from "../../../../../app/services/track/TrackWithGuidService";
import AllContexts from "../common components/AllContexts";
import CompareMode from "./compare/CompareMode";
import SingleMode from "./single/SingleMode";
import { SwNavigator } from "common/services/swNavigator";
import { AppPerformanceContainer } from "./StyledComponents";

export interface IAppPerformanceProps {
    compareMode: boolean;
    pageFilters: any;
    loading: boolean;
    data?: any;
    isPropertyTracked: boolean;
    translate: (key) => string;
    onAppTrack?: (a?) => void;
    track: (a?, b?, c?, d?) => void;
    getLink: (a, b?, c?) => string;
    getAssetsUrl: (a) => string;
    websiteTooltipComponent?: any;
    hideStoreSection?: boolean;
    showStoreSearchLink?: boolean;
    swNavigator: SwNavigator;
}

const AppPerformance: StatelessComponent<IAppPerformanceProps> = ({
    compareMode,
    pageFilters,
    loading,
    data = {},
    translate,
    isPropertyTracked,
    onAppTrack,
    track,
    getLink,
    getAssetsUrl,
    websiteTooltipComponent,
    hideStoreSection,
    showStoreSearchLink,
    swNavigator,
}) => {
    return (
        <AllContexts
            translate={translate}
            track={track}
            trackWithGuid={TrackWithGuidService.trackWithGuid}
            linkFn={{ getLink, getAssetsUrl, swNavigator }}
            filters={pageFilters}
        >
            <AppPerformanceContainer>
                {compareMode ? (
                    <CompareMode
                        loading={loading}
                        data={data.ranking}
                        hideStoreSection={hideStoreSection}
                    />
                ) : (
                    <SingleMode
                        loading={loading}
                        data={data}
                        isPropertyTracked={isPropertyTracked}
                        onAppTrack={onAppTrack}
                        websiteTooltipComponent={websiteTooltipComponent}
                        hideStoreSection={hideStoreSection}
                        showStoreSearchLink={showStoreSearchLink}
                    />
                )}
            </AppPerformanceContainer>
        </AllContexts>
    );
};
AppPerformance.propTypes = {
    compareMode: PropTypes.bool.isRequired,
    pageFilters: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object,
    translate: PropTypes.func.isRequired,
    getLink: PropTypes.func.isRequired,
    getAssetsUrl: PropTypes.func.isRequired,
    track: PropTypes.func.isRequired,
    onAppTrack: PropTypes.func,
    isPropertyTracked: PropTypes.bool.isRequired,
    websiteTooltipComponent: PropTypes.func,
    hideStoreSection: PropTypes.bool,
    showStoreSearchLink: PropTypes.bool,
};
AppPerformance.displayName = "AppPerformance";
export default AppPerformance;
