import { CompetitiveTrackerService } from "services/competitiveTracker/competitiveTrackerService";
import React, { useMemo, useState } from "react";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { StyledDropdownContainer } from "pages/segments/start-page/StyledComponents";
import { DeleteTrackersConfirmModal } from "pages/competitive-tracking/homepage/DeleteTrackersConfirmModal";
import { useCompetitiveTrackerHighLevelMetricsContext } from "./context/context";
import {
    IconContainer,
    TrackerHeaderContainer,
    TrackerName,
} from "./CompetitiveTrackerHighLevelMetrics.styles";
import { EditContextMenu } from "../common/components/EditContextMenu";
import { ETabsState } from "./tabs/types";

export const TrackerHeader = () => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const { queryParams, setTrackerState } = useCompetitiveTrackerHighLevelMetricsContext();

    const services = useMemo(() => {
        return {
            navigator: Injector.get<SwNavigator>("swNavigator"),
            trackerService: CompetitiveTrackerService,
        };
    }, []);

    const trackerName = useMemo(() => {
        const tracker = services.trackerService.getById(queryParams.trackerId);
        return tracker?.name;
    }, [queryParams, services]);

    if (!trackerName) return null;

    const onDeleteClick = async () => {
        const removePromise = services.trackerService.remove(queryParams.trackerId);
        const { LOADING, LOADED } = ETabsState;
        try {
            setTrackerState(LOADING);
            await removePromise;
            services.navigator.go("companyresearch_competitivetracking_home");
        } finally {
            setTrackerState(LOADED);
        }
    };
    return (
        <TrackerHeaderContainer>
            <DeleteTrackersConfirmModal
                isOpen={isDeleteModalOpen}
                deleteTracker={onDeleteClick}
                closeModal={() => setIsDeleteModalOpen(false)}
            />
            <TrackerName>{trackerName}</TrackerName>
            <IconContainer>
                <StyledDropdownContainer>
                    <EditContextMenu
                        trackerId={queryParams.trackerId}
                        onDeleteClickCallback={() => setIsDeleteModalOpen(true)}
                    />
                </StyledDropdownContainer>
            </IconContainer>
        </TrackerHeaderContainer>
    );
};
