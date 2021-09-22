import React, { useMemo } from "react";
import UseCaseHomepage from "@similarweb/ui-components/dist/homepages/use-case/src/UseCaseHomepage";
import { TrackersWrapper } from "./TrackersWrapper";
import { i18nFilter } from "filters/ngFilters";
import { LoadingSpinner } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { HomePageImage, HomePageImageContainer } from "pages/competitive-tracking/homepage/styled";
import { LoaderContainer } from "../trackerpage/tabs/styled";
import { AssetsService } from "services/AssetsService";

export const CompetitiveTrackersOverview = ({ segmentsModule }) => {
    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
            assets: AssetsService,
        };
    }, []);

    const { segmentsLoading } = segmentsModule;
    if (segmentsLoading) {
        return (
            <LoaderContainer>
                <LoadingSpinner />
            </LoaderContainer>
        );
    }
    return (
        <>
            <UseCaseHomepage
                title={services.translate("competitive.tracking.home.page.title")}
                titlePosition={"centered"}
                subtitle={services.translate("competitive.tracking.home.page.subtitle")}
                headerImageUrl={services.assets.assetUrl(
                    "/images/secondary-home-page-header-light.png",
                )}
                searchComponents={
                    <TrackersWrapper key="trackers-wrapper" segmentsModule={segmentsModule} />
                }
                showSearchComponentsInTheBody={true}
                renderIcon={() => (
                    <HomePageImageContainer>
                        <HomePageImage
                            imageUrl={services.assets.assetUrl(
                                "/images/competitive-tracking/create-tracker.svg",
                            )}
                        />
                    </HomePageImageContainer>
                )}
                paddingTop={"0px"}
            />
        </>
    );
};
