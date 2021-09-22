import {
    toggleDeleteSegmentModal,
    toggleRenameSegmentModal,
} from "actions/conversionModuleActions";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import {
    groupMenuActions,
    getCustomSegmentGroupsWithData,
} from "components/SecondaryBar/NavBars/ConversionAnalysisNavBar/utils";
import { SegmentsGroups } from "./NavGroups/SegmentsGroups";
import { i18nFilter } from "filters/ngFilters";
import { ISegmentData, ISegmentGroupData } from "pages/conversion/ConversionSegmentsUtils";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { ISegmentsData } from "services/conversion/ConversionSegmentsService";
import styled from "styled-components";
import { SwTrack } from "services/SwTrack";
import { periodOverPeriodService } from "services/PeriodOverPeriodService";

const BodyContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 8px;
`;

interface IConversionNavBarBodyProps {
    toggleDeleteSegmentModal: (isOpen, gid) => {};
    toggleRenameSegmentModal: (isOpen, gid) => {};
    params: any;
    segments: ISegmentsData;
}

const DEFAULT_COMPARED_DURATION = "12m";
const CONVERSION_WIZARD_STATE = "conversion-wizard";
const CUSTOM_SEGMENT_STATE = "conversion-customsegement";

const ConversionAnalysisNavBarBody: FC<IConversionNavBarBodyProps> = ({
    params,
    segments,
    toggleDeleteSegmentModal,
    toggleRenameSegmentModal,
}) => {
    const services = useMemo(() => {
        return {
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            periodOverPeriodService,
            translate: i18nFilter(),
        };
    }, []);

    const [customSegmentGroups, setCustomSegmentGroups] = useState(
        getCustomSegmentGroupsWithData(segments),
    );
    const [selectedGroupId, setSelectedGroupId] = useState(params?.gid ? params.gid : "");
    const [selectedSegmentId, setSelectedSegmentId] = useState(params?.sid ? params.sid : "");

    useMemo(() => {
        setSelectedGroupId(params.gid);
    }, [params.gid]);

    useMemo(() => {
        setSelectedSegmentId(params.sid);
    }, [params.sid]);

    useEffect(() => {
        const userSegmentGroupsWithData = getCustomSegmentGroupsWithData(segments);
        setCustomSegmentGroups(userSegmentGroupsWithData);
    }, [segments, setCustomSegmentGroups]);

    const trackInternalLink = (segment?: ISegmentData, group?: ISegmentGroupData) => {
        SwTrack.all.trackEvent(
            "Internal Link",
            "click",
            `Side Bar/Analyze ${segment ? `website` : `group`}/${
                segment ? segment.domain : group.id
            }/${segment ? segment.id : group.name}`,
        );
    };

    const onCreateNewClick = useCallback(() => {
        SwTrack.all.trackEvent("Button", "click", `Side Bar/Add Group`);
        services.swNavigator.go(CONVERSION_WIZARD_STATE);
    }, [services]);

    const onAllGroupsClick = () => {
        services.swNavigator.go("conversion-homepage");
    };

    const onGroupSelect = useCallback(
        (group) => {
            const params = group.id.split(":");
            if ((params && params.length === 2) || params.length === 0) {
                return;
            }
            const stateName = "conversion-customgroup";
            trackInternalLink(undefined, group);
            const { country, tab } = services.swNavigator.getParams();
            setSelectedGroupId(group.id);
            services.swNavigator.go(stateName, {
                gid: group.id,
                country,
                duration: "6m",
                comparedDuration: DEFAULT_COMPARED_DURATION,
                tab,
            });
        },
        [customSegmentGroups],
    );

    const onSiteSearchNavigation = useCallback(
        (internalLinkParams) => {
            const { gid, sid } = services.swNavigator.getParams();
            const isSelected =
                `${gid}:${sid}` === `${internalLinkParams.gid}:${internalLinkParams.sid}`;

            isSelected
                ? services.swNavigator.applyUpdateParams(internalLinkParams)
                : services.swNavigator.go(CUSTOM_SEGMENT_STATE, { ...internalLinkParams });
        },
        [params.gid, params.sid],
    );

    const onSegmentClick = useCallback(
        (groupId, segment, isOssClick) => {
            trackInternalLink(segment);
            const { tab, duration, country, comparedDuration } = services.swNavigator.getParams();
            const isDisabled = !segment.countries.includes(parseInt(country, 10));
            const isPeriodOverPeriodAllowed = services.periodOverPeriodService._periodOverPeriodEnabled(
                duration,
                comparedDuration || DEFAULT_COMPARED_DURATION,
                [],
                "Conversion",
            );
            const internalLinkParams = {
                sid: segment.id,
                gid: groupId,
                country: !isDisabled
                    ? country
                    : isOssClick
                    ? segment.ossCountries[0]
                    : segment.countries[0],
                duration,
                comparedDuration: isPeriodOverPeriodAllowed
                    ? comparedDuration || DEFAULT_COMPARED_DURATION
                    : undefined,
                tab: isOssClick ? "1" : tab,
            };
            if (isOssClick) {
                onSiteSearchNavigation(internalLinkParams);
            } else {
                services.swNavigator.go(CUSTOM_SEGMENT_STATE, {
                    ...internalLinkParams,
                    tab,
                });
            }
        },
        [customSegmentGroups],
    );

    const handleMenuToggle = () => {
        SwTrack.all.trackEvent("Button", "click", `Side bar/Additional Options/Toggle`);
    };

    const handleMenuItemClick = (gid, country, action) => {
        switch (action) {
            case groupMenuActions.DELETE:
                return () => {
                    SwTrack.all.trackEvent("Button", "click", `Side bar/Delete group/${gid}`);
                    toggleDeleteSegmentModal(true, gid);
                };
            case groupMenuActions.RENAME:
                return () => {
                    SwTrack.all.trackEvent("Button", "click", `Side bar/Rename group/${gid}`);
                    toggleRenameSegmentModal(true, gid);
                };
            case groupMenuActions.ADD:
            case groupMenuActions.REMOVE:
                return () => {
                    SwTrack.all.trackEvent("Button", "click", `Side bar/${action} sites/${gid}`);
                    services.swNavigator.go(CONVERSION_WIZARD_STATE, { gid, country });
                };
            default:
                return;
        }
    };

    return (
        <BodyContainer>
            <SegmentsGroups
                country={params.country}
                segments={segments}
                groups={customSegmentGroups}
                onGroupClick={onGroupSelect}
                onSegmentClick={onSegmentClick}
                onAllGroupsClick={onAllGroupsClick}
                onCreateNewClick={onCreateNewClick}
                selectedGroupId={selectedGroupId}
                selectedSegmentId={selectedSegmentId}
                onMenuToggle={handleMenuToggle}
                handleMenuItemClick={handleMenuItemClick}
            />
        </BodyContainer>
    );
};

const mapStateToProps = (store) => {
    const {
        routing: { params },
        conversionModule: { segments },
    } = store;
    return {
        params,
        segments,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleDeleteSegmentModal: (isOpen, gid) => {
            dispatch(toggleDeleteSegmentModal(isOpen, gid));
        },
        toggleRenameSegmentModal: (isOpen, gid) => {
            dispatch(toggleRenameSegmentModal(isOpen, gid));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConversionAnalysisNavBarBody);
