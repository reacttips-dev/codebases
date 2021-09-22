import { ETrackerAssetType, ITracker } from "services/competitiveTracker/types";
import CountryService from "services/CountryService";
import { i18nFilter } from "filters/ngFilters";
import {
    CustomIcon,
    Text,
    TrackerContainer,
    TrackerContentContainer,
    EditContainer,
    Loader,
} from "pages/competitive-tracking/homepage/styled";
import { SelectedCountryItem } from "pages/competitive-tracking/wizard/wizardSteps/fourtStep/selectedAssets/SelectedCountryItem";
import React, { useState } from "react";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { trackerAssetTypes } from "services/competitiveTracker/constants";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { CompetitiveTrackerService } from "services/competitiveTracker/competitiveTrackerService";
import { stopPropagation } from "UtilitiesAndConstants/UtilityFunctions/events";
import { DeleteTrackersConfirmModal } from "pages/competitive-tracking/homepage/DeleteTrackersConfirmModal";
import { getSegmentName } from "../trackerpage/TrackerOverview";
import { EditContextMenu } from "../common/components/EditContextMenu";

const onTrackerClicked = (trackerId) => () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    swNavigator.go("companyResearch_competitiveTracking_tracker", { trackerId });
};

const isPlural = (array) => array.length > 1;

const darkGray = colorsPalettes.carbon[300];
const lightGray = colorsPalettes.carbon[200];
const defaultTextSize = 11;

export const Tracker = (segmentsModule) => (tracker: ITracker) => {
    const { name, id, mainPropertyId, competitors, country, mainPropertyType } = tracker;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const countryObject = CountryService.getCountryById(country);
    const i18n = i18nFilter();
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const onEditToggle = (isOpen) => setIsEditOpen(isOpen);
    const onDeleteClick = async () => {
        const navigator = Injector.get<SwNavigator>("swNavigator");
        const removePromise = CompetitiveTrackerService.remove(id);
        try {
            setIsLoading(true);
            await removePromise;
            navigator.reload("companyresearch_competitivetracking_home");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <TrackerContainer key={id} onClick={onTrackerClicked(id)}>
            <div onClick={stopPropagation}>
                <DeleteTrackersConfirmModal
                    isOpen={isDeleteModalOpen}
                    deleteTracker={onDeleteClick}
                    closeModal={() => setIsDeleteModalOpen(false)}
                />
            </div>

            <CustomIcon iconName="tracker" />
            <TrackerContentContainer>
                <div>
                    <div style={{ height: "16px" }}>
                        <Text color={rgba(colorsPalettes.carbon[500], 0.8)} size={15}>
                            {name}
                        </Text>
                    </div>
                    <div style={{ alignItems: "flex-start", display: "flex" }}>
                        <Text size={defaultTextSize} color={darkGray} margin={`0 4px 0 0`}>
                            Property:
                        </Text>
                        <Text size={defaultTextSize} color={lightGray}>
                            {mainPropertyType === ETrackerAssetType.Website
                                ? mainPropertyId
                                : getSegmentName(segmentsModule)(mainPropertyId)}
                        </Text>
                        <Text size={defaultTextSize} color={darkGray} margin={`0 4px 0 10px`}>
                            Competitors:
                        </Text>
                        <Text size={defaultTextSize} color={lightGray} margin={`0 10px 0 0`}>
                            {Object.keys(competitors).map((competitorType) => {
                                const competitor = competitors[competitorType];
                                const { displayName } = trackerAssetTypes[competitorType];
                                const {
                                    singular: singularDisplayName,
                                    plural: pluralDisplayName,
                                } = displayName;
                                return competitor?.length
                                    ? ` ${competitor.length} ${i18n(
                                          isPlural(competitor)
                                              ? pluralDisplayName
                                              : singularDisplayName,
                                      )}`
                                    : null;
                            })}
                        </Text>
                        <SelectedCountryItem selectedCountry={countryObject} />
                    </div>
                </div>
                {isLoading ? (
                    <Loader />
                ) : (
                    <EditContainer opacity={isEditOpen ? 1 : 0} onClick={stopPropagation}>
                        <EditContextMenu
                            trackerId={id}
                            onDeleteClickCallback={() => setIsDeleteModalOpen(true)}
                            onToggle={onEditToggle}
                        />
                    </EditContainer>
                )}
            </TrackerContentContainer>
        </TrackerContainer>
    );
};
