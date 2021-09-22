import React, { useMemo } from "react";
import { AssetsService } from "services/AssetsService";
import {
    StartPageContainer,
    StartPageTitle,
    StartPageImage,
    StartPageSubtitle,
} from "pages/competitive-tracking/startpage/CompetitiveTrackingStartPageStyles";
import { i18nFilter } from "filters/ngFilters";
import { CreateNewTracker } from "pages/competitive-tracking/homepage/CreateNewTracker";

export const CompetitiveTrackingStartPage = () => {
    const imageUrl = useMemo(() => {
        return AssetsService.assetUrl("/images/competitive-tracking/create-tracker.svg");
    }, []);

    const i18n = i18nFilter();

    return (
        <StartPageContainer>
            <StartPageImage imageUrl={imageUrl} />
            <StartPageTitle>{i18n("competitive.tracker.home.title")}</StartPageTitle>
            <StartPageSubtitle>{i18n("competitive.tracker.home.subtitle")}</StartPageSubtitle>
            <CreateNewTracker />
        </StartPageContainer>
    );
};
