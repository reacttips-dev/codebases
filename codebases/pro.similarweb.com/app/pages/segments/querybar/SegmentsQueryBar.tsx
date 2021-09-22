import React from "react";
import { connect } from "react-redux";
import { IconButton } from "@similarweb/ui-components/dist/button";
import {
    QueryBarIconButton,
    QueryBarButtonsContainer,
    QueryBarContainer,
    SubNavOutsideOverlay,
    QueryBarInfoCardContainerStyles,
} from "./styledComponents";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { SegmentsQueryBarGroupItem } from "pages/segments/querybar/SegmentsQueryBarGroupItem";
import { SegmentsQueryBarSegmentItem } from "pages/segments/querybar/SegmentsQueryBarSegmentItem";
import { ENABLE_FIREBOLT, SegmentsUtils } from "services/segments/SegmentsUtils";
import {
    ICustomSegment,
    ICustomSegmentAccount,
    ICustomSegmentsGroup,
} from "services/segments/segmentsApiService";
import { MODE } from "pages/segments/analysis/SegmentsAnalysisTrafficContainer";
import { toggleCreateUpdateSegmentGroupModal } from "actions/segmentsModuleActions";
import {
    SegmentsBackButton,
    SegmentsBackButtonContainer,
    SegmentsUpsellButton,
} from "pages/segments/styleComponents";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { itsMyOwnSegment } from "pages/segments/analysis/CustomSegmentsTableConfig";
import { SegmentTooltip } from "components/React/Tooltip/SegmentTooltip/SegmentTooltip";
import { PopupTarget } from "./PopupTarget";
import { SegmentsQueryBarAutocomplete } from "pages/segments/querybar/SegmentsQueryBarAutocomplete";
import { IWithUseAdvancedPref, withUseAdvancedPref } from "pages/segments/withUseAdvancedPref";
import { CompareButtonContainer } from "./styledComponents";
import AddToGroupDropdown from "./AddToGroupDropdown";
import { i18nFilter } from "filters/ngFilters";
import { SwTrack } from "services/SwTrack";

interface ISegmentsQueryBarProps extends IWithUseAdvancedPref {
    params: { [key: string]: any };
    segments: ICustomSegment[];
    allSegments: ICustomSegmentAccount[];
    groups: ICustomSegmentsGroup[];
    toggleCreateUpdateSegmentGroupModal: Function;
    isMidTierUser?: boolean;
}

export const SegmentsQueryBarComponent = (props: ISegmentsQueryBarProps) => {
    const {
        params,
        segments,
        allSegments,
        groups,
        toggleCreateUpdateSegmentGroupModal,
        isMidTierUser,
        useAdvancedPref,
    } = props;
    const { mode, id } = params;

    const services = React.useMemo(
        () => ({
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            i18n: i18nFilter(),
        }),
        [],
    );

    const { segmentsGroup, singleSegment } = React.useMemo(() => {
        let segmentsGroup, singleSegment;
        switch (mode) {
            case MODE.group:
                segmentsGroup = SegmentsUtils.getSegmentGroupById(groups, id);
                break;
            case MODE.single:
                singleSegment = SegmentsUtils.getSegmentById(
                    { segments: allSegments },
                    id,
                ) as ICustomSegmentAccount;
                break;
        }
        return { segmentsGroup, singleSegment };
    }, [mode, id, groups, allSegments, toggleCreateUpdateSegmentGroupModal]);

    const allowAdvanced = !ENABLE_FIREBOLT || useAdvancedPref.value;
    const [mySegmentsSorted, accountSegmentsSorted, myGroupsSorted] = React.useMemo(
        () => [
            (segments ?? [])
                .filter((segment) => segment.id !== singleSegment?.id)
                .sort(SegmentsUtils.sortSegments.byDomainName),
            (allSegments ?? [])
                .filter(
                    (segment) =>
                        segment.id !== singleSegment?.id && !itsMyOwnSegment(segment.userId),
                )
                .sort(SegmentsUtils.sortSegments.byDomainName),
            (groups ?? [])
                .filter((group) => group.id !== segmentsGroup?.id)
                .sort(SegmentsUtils.sortSegmentsGroups.byName),
        ],
        [segments, allSegments, groups, allowAdvanced, segmentsGroup?.id, singleSegment?.id],
    );

    const [isOpenMainQueryBarPopup, setIsOpenMainQueryBarPopup] = React.useState(false);
    const opMainQueryBarPopup = React.useMemo(
        () => ({
            toggle: () => setIsOpenMainQueryBarPopup((prevIsOpen) => !prevIsOpen),
            open: () => setIsOpenMainQueryBarPopup(true),
            close: () => setIsOpenMainQueryBarPopup(false),
        }),
        [setIsOpenMainQueryBarPopup],
    );

    const onBackClick = React.useCallback(() => {
        const currentModule = services.swNavigator.getCurrentModule();
        const segmentsHomepage = `${currentModule}-homepage`;
        services.swNavigator.go(segmentsHomepage);
    }, []);

    const editSegmentClick = React.useCallback(() => {
        SwTrack.all.trackEvent(
            "Internal Link",
            "click",
            `segmentCard/editSegment/${singleSegment.id}`,
        );
        const currentModule = services.swNavigator.getCurrentModule();
        const segmentWizardState = `${currentModule}-wizard`;
        services.swNavigator.go(segmentWizardState, { sid: singleSegment.id });
    }, [singleSegment?.id]);

    const onClickCompare = React.useCallback(() => {
        toggleCreateUpdateSegmentGroupModal(true, undefined, singleSegment.id);
        SwTrack.all.trackEvent("Button", "click", `Segments/Single/Compare/${singleSegment.id}`);
    }, [toggleCreateUpdateSegmentGroupModal, singleSegment?.id]);

    const onClickEditGroup = React.useCallback(() => {
        toggleCreateUpdateSegmentGroupModal(true, segmentsGroup);
        SwTrack.all.trackEvent("Button", "click", `Segments/Group/Edit/${segmentsGroup.id}`);
    }, [toggleCreateUpdateSegmentGroupModal, segmentsGroup]);

    const navigateChangeEntity = (mode: string, entity: ICustomSegment | ICustomSegmentsGroup) => {
        services.swNavigator.updateParams({ mode, id: entity.id });
        SwTrack.all.trackEvent("Query Bar", "Navigate", `Segments/${mode}/${entity.id}`);
    };

    const renderQueryBarMainPopup = () => {
        return (
            <SegmentsQueryBarAutocomplete
                mySegments={mySegmentsSorted}
                accountSegments={accountSegmentsSorted}
                myGroups={myGroupsSorted}
                navigateChangeEntity={navigateChangeEntity}
                defaultTab={{ single: "segments", group: "groups" }[mode]}
                closeFn={opMainQueryBarPopup.close}
            />
        );
    };

    const renderQueryBarMainItem = () => {
        switch (params.mode) {
            case "single":
                return (
                    <>
                        <QueryBarInfoCardContainerStyles />
                        <PopupTarget
                            isOpen={isOpenMainQueryBarPopup}
                            renderPopup={renderQueryBarMainPopup}
                            closeFn={opMainQueryBarPopup.close}
                        >
                            <SegmentTooltip
                                dateModified={singleSegment.lastUpdated}
                                segmentName={singleSegment.segmentName}
                                domain={singleSegment.domain}
                                isOrgSegment={!itsMyOwnSegment(singleSegment.userId)}
                                segmentId={singleSegment.id}
                                onClick={editSegmentClick}
                                debounce={600}
                                cssClassContainer="QueryBarInfoCardContainer"
                            >
                                <div>
                                    <SegmentsQueryBarSegmentItem
                                        segmentName={singleSegment.segmentName}
                                        segmentWebsite={singleSegment.domain}
                                        segmentImage={singleSegment.favicon}
                                        onItemClick={opMainQueryBarPopup.toggle}
                                    />
                                </div>
                            </SegmentTooltip>
                        </PopupTarget>
                    </>
                );
            case "group":
                return (
                    <PopupTarget
                        isOpen={isOpenMainQueryBarPopup}
                        renderPopup={renderQueryBarMainPopup}
                        closeFn={opMainQueryBarPopup.close}
                    >
                        <SegmentsQueryBarGroupItem
                            groupName={segmentsGroup.name}
                            groupSize={segmentsGroup.members.length}
                            onItemClick={opMainQueryBarPopup.toggle}
                        />
                    </PopupTarget>
                );
        }
    };

    const renderButtons = () => {
        switch (mode) {
            case MODE.single:
                return isMidTierUser ? (
                    <SegmentsUpsellButton onClick={SegmentsUtils.openMidTierUserUpsellModal}>
                        {services.i18n("segments.module.header.compare.btn")}
                    </SegmentsUpsellButton>
                ) : (
                    <QueryBarButtonsContainer>
                        <CompareButtonContainer>
                            <IconButton onClick={onClickCompare} iconName="add">
                                {services.i18n("segment.analysis.query.bar.single.compare.button")}
                            </IconButton>
                        </CompareButtonContainer>
                        <AddToGroupDropdown groups={groups} currentSegmentId={id} />
                    </QueryBarButtonsContainer>
                );
            case MODE.group:
                return (
                    <QueryBarButtonsContainer>
                        <PlainTooltip
                            placement="bottom"
                            tooltipContent={services.i18n("segments.querybar.group.edit.tooltip")}
                        >
                            <span>
                                <QueryBarIconButton
                                    onClick={onClickEditGroup}
                                    iconName="edit-group"
                                    type="flat"
                                    iconSize="sm"
                                />
                            </span>
                        </PlainTooltip>
                    </QueryBarButtonsContainer>
                );
        }
    };

    return (
        <QueryBarContainer>
            <SegmentsBackButtonContainer>
                <SegmentsBackButton onClick={onBackClick} />
            </SegmentsBackButtonContainer>
            {renderQueryBarMainItem()}
            {renderButtons()}
            {isOpenMainQueryBarPopup ? <SubNavOutsideOverlay /> : null}
        </QueryBarContainer>
    );
};

const mapStateToProps = (store) => {
    const {
        segmentsModule: { customSegmentsMeta },
        routing: { params },
    } = store;
    return {
        segments: customSegmentsMeta?.Segments,
        allSegments: customSegmentsMeta?.AccountSegments,
        groups: customSegmentsMeta?.SegmentGroups,
        params,
    };
};

const mapDispatchToProps = {
    toggleCreateUpdateSegmentGroupModal,
};

export default withUseAdvancedPref(
    connect(mapStateToProps, mapDispatchToProps)(SegmentsQueryBarComponent),
);
