import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import React, { useMemo, useEffect, useState } from "react";
import { connect } from "react-redux";
import { CompetitiveTrackingEditPage } from "./CompetitiveTrackingEditPage";
import { SwLog } from "@similarweb/sw-log";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { CompetitiveTrackerService } from "services/competitiveTracker/competitiveTrackerService";
import { ICompetitiveTrackingServices } from "../homepage/CompetitiveTrackingHomepageTypes";
import { getCountries } from "components/filters-bar/utils";
import { ICountry } from "components/filters-bar/country-filter/CountryFilterTypes";
import { ETrackerAssetType, ITracker } from "services/competitiveTracker/types";
import {
    ICompetitiveTrackingEditMetaData,
    ICompetitiveTrackingEditPageWrapperProps,
} from "./CompetitiveTrackingEditPageTypes";
import { PageWrapper } from "../common/styles/CompetitiveTrackingStyles";
import { IWebsitesFavicons } from "services/sitesResource/types";
import { sitesResourceService } from "services/sitesResource/sitesResourceService";
import { MAX_SUPPORTED_COMPETITORS } from "pages/competitive-tracking/wizard/CompetitiveTrackingWizard";
import { EMPTY_CUSTOM_SEGMENTS } from "services/segments/segmentsApiService";

const TRACKER_PAGE_STATE = "companyResearch_competitiveTracking_tracker";

const CompetitiveTrackingEditPageWrapper: React.FunctionComponent<ICompetitiveTrackingEditPageWrapperProps> = (
    props,
) => {
    const { trackerId, segmentsData, isSegmentsLoading } = props;
    const [websitesFavicons, setWebsitesFavicons] = useState<IWebsitesFavicons>();
    const [isWebsitesFaviconsLoading, setIsWebsitesFaviconsLoading] = useState<boolean>(true);
    const isLoading = isSegmentsLoading || isWebsitesFaviconsLoading;
    const services = useMemo<ICompetitiveTrackingServices>(() => {
        return {
            translate: i18nFilter(),
            logger: SwLog,
            navigator: Injector.get<SwNavigator>("swNavigator"),
            loggingTracker: TrackWithGuidService,
            trackerService: CompetitiveTrackerService,
        };
    }, []);

    const trackerToEdit = useMemo(() => {
        return services.trackerService.getById(trackerId);
    }, [trackerId]);

    useEffect(() => {
        setIsWebsitesFaviconsLoading(true);
        const { mainPropertyType, competitors, mainPropertyId } = trackerToEdit;
        const websites = [...competitors[ETrackerAssetType.Website]];
        if (mainPropertyType === ETrackerAssetType.Website) {
            websites.push(mainPropertyId);
        }
        const uniqueWebsites = Array.from(new Set(websites));
        sitesResourceService
            .getWebsitesFavicons(uniqueWebsites)
            .then((websitesFavicons) => {
                setWebsitesFavicons(websitesFavicons);
            })
            .finally(() => setIsWebsitesFaviconsLoading(false));
    }, [trackerId]);

    const metaData = useMemo<ICompetitiveTrackingEditMetaData>(() => {
        return {
            countries: getCountries(true) as ICountry[],
            segments: segmentsData,
            websitesFavicons,
        };
    }, [segmentsData, websitesFavicons]);

    const trackEvent = (action: string) => {
        services.loggingTracker.trackWithGuid("competitive.tracking.edit", action, {
            tracker: trackerId,
        });
    };

    const handleEditSubmit = async (updatedTracker: ITracker) => {
        try {
            trackEvent("submit-ok");
            await services.trackerService.modify(updatedTracker);
        } catch (e) {
            trackEvent("submit-server-error");
            services.logger.error(e);
        } finally {
            services.navigator.go(TRACKER_PAGE_STATE, { trackerId });
        }
    };

    const handleEditCancel = () => {
        trackEvent("cancel");
        services.navigator.go(TRACKER_PAGE_STATE, { trackerId });
    };
    return (
        <PageWrapper>
            {trackerToEdit && (
                <CompetitiveTrackingEditPage
                    tracker={trackerToEdit}
                    services={services}
                    metaData={metaData}
                    onEditSubmit={handleEditSubmit}
                    onEditCancel={handleEditCancel}
                    maxSupportedCompetitors={MAX_SUPPORTED_COMPETITORS}
                    isLoading={isLoading}
                />
            )}
        </PageWrapper>
    );
};

const mapStateToProps = ({
    routing: { params },
    segmentsModule: { segmentsLoading, customSegmentsMeta = EMPTY_CUSTOM_SEGMENTS },
}) => {
    return {
        trackerId: params.trackerId,
        isSegmentsLoading: segmentsLoading,
        segmentsData: customSegmentsMeta,
    };
};

const connected = connect(mapStateToProps)(CompetitiveTrackingEditPageWrapper);
SWReactRootComponent(connected, "CompetitiveTrackingEditPageWrapper");
export { connected as CompetitiveTrackingEditPageWrapper };
