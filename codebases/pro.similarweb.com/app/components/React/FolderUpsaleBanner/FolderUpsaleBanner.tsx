import React, { useState, useCallback, useRef } from "react";
import { Banner } from "@similarweb/ui-components/dist/banner";
import { AssetsService } from "services/AssetsService";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import styled from "styled-components";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { i18nFilter } from "filters/ngFilters";

interface IFolderUpsaleBannerProps {
    isVisible: boolean;
}

const FolderUpsaleBannerContainer = styled.div`
    margin-bottom: 26px;
`;

const FolderUpsaleBanner: React.FunctionComponent<IFolderUpsaleBannerProps> = (props) => {
    // Mark if the user has seen the banner. used for logging in mixpanel
    const [didShowToUser, setDidShowToUser] = React.useState(false);
    const swNavigator = useRef(Injector.get<SwNavigator>("swNavigator"));

    const goToSegments = useCallback(() => {
        TrackWithGuidService.trackWithGuid("folders.analysis.upsale.banner.click", "click");
        swNavigator.current.go("companyresearch_segments-homepage");
    }, []);

    const logUserImpression = useCallback(() => {
        // In case of multiple renders of the component, we want to log the event where
        // the user has seen the banner only once.
        if (!didShowToUser) {
            TrackWithGuidService.trackWithGuid("folders.analysis.upsale.banner.show", "show");
            setDidShowToUser(true);
        }
    }, []);

    const { key: website } = swNavigator.current.getParams();

    const { isVisible } = props;

    return (
        isVisible && (
            <FolderUpsaleBannerContainer>
                <Banner
                    title={i18nFilter()("folder.upsale.banner.title")}
                    subtitle={i18nFilter()("folder.upsale.banner.subtitle", { website })}
                    buttonType="upsell"
                    buttonText={i18nFilter()("folder.upsale.banner.button")}
                    onButtonClick={goToSegments}
                    iconImagePath={AssetsService.assetUrl(
                        "/images/segments/segments-pie-chart.svg",
                    )}
                    iconImageHeight={56}
                    iconImageWidth={56}
                    onInitialRender={logUserImpression}
                />
            </FolderUpsaleBannerContainer>
        )
    );
};

SWReactRootComponent(FolderUpsaleBanner, "FolderUpsaleBanner");
export default FolderUpsaleBanner;
