import { colorsPalettes, rgba } from "@similarweb/styles";
import swLog from "@similarweb/sw-log/index";
import { AutosizeInput } from "@similarweb/ui-components/dist/autosize-input";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { Type } from "@similarweb/ui-components/dist/item-icon";
import {
    groupCreatedUpdated,
    toggleCreateUpdateSegmentGroupModal,
} from "actions/segmentsModuleActions";
import { IProModalCustomStyles, ProModal } from "components/Modals/src/ProModal";
import I18n from "components/React/Filters/I18n";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { itsMyOwnSegment } from "pages/segments/analysis/CustomSegmentsTableConfig";
import { MODE } from "pages/segments/analysis/SegmentsAnalysisTrafficContainer";
import { SegmentSelectorDropdown } from "pages/segments/modals/SegmentSelectorDropdown";
import { default as React, useEffect, useState } from "react";
import { connect } from "react-redux";
import segmentsApiService, {
    ICustomSegment,
    ICustomSegmentAccount,
    ICustomSegmentGroupWebsite,
    ICustomSegmentsGroup,
    SEGMENT_TYPES,
} from "services/segments/segmentsApiService";
import { ICustomSegmentMember, SegmentsUtils } from "services/segments/SegmentsUtils";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";
import { Injector } from "common/ioc/Injector";
import { ReactIconButton } from "components/React/ReactIconButton/ReactIconButton";
import { BetaLabel } from "components/BetaLabel/BetaLabel";
import { MAX_SEGMENTS_IN_GROUP } from "pages/segments/analysis/SegmentsAnalysisHelper";
import { StyledItemIcon } from "components/core cells/src/CoreRecentCell/StyledComponents";
import { SegmentTypeBadge } from "pages/segments/StyledComponents";
import {
    Domain,
    DomainWrapper,
    SegmentCategory,
    SegmentLabel,
    flexFixed,
    flexAutoScroll,
    flexAutoScrollContainer,
} from "./styledComponents";
import { IconContainer } from "UtilitiesAndConstants/UtilitiesComponents/IconContainer";

const WARN_LARGE_GROUP_SEGMENTS = 10;

const proModalStyles: IProModalCustomStyles = {
    content: {
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: "600px",
        height: "600px",
        maxHeight: "calc(100% - 72px)",
    },
};

export interface ISegmentGroupModal {
    isOpen: boolean;
    segments: ICustomSegment[];
    allSegments: ICustomSegmentAccount[];
    segmentGroup?: ICustomSegmentsGroup;
    groupCreatedUpdated?: (group: ICustomSegmentsGroup) => any;
    toggleCreateUpdateSegmentGroupModal?: (
        isOpen: boolean,
        segmentGroup?: ICustomSegmentsGroup,
    ) => any;
    compareToSegment?: string;
}

const SegmentsCounterContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 12px;
    line-height: 14px;
    color: ${colorsPalettes.carbon["300"]};
    padding: 8px 0;
`;

const SegmentCounter = styled.span<{ isSmallList: boolean }>`
    color: ${({ isSmallList }) =>
        isSmallList ? colorsPalettes.red["400"] : colorsPalettes.carbon["300"]};
`;

const SegmentItemContainer = styled.div`
    display: flex;
    padding: 4px 8px;
    font-size: 12px;
    line-height: 14px;
    ${StyledItemIcon} {
        align-self: center;
    }
    ${SegmentCategory} {
        text-indent: 10px;
        font-size: 12px;
    }
    ${Domain} {
        font-size: 14px;
    }
`;

const SegmentRowContainer = styled.div`
    display: flex;
    flex-grow: 1;
    align-items: center;
    ${SegmentItemContainer} {
        flex-grow: 1;
    }
`;

const ModalFooter = styled.div`
    display: flex;
    margin-top: 15px;
    button {
        margin-left: 8px;
    }
    ${flexFixed}
`;
const ModalFooterButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    flex-wrap: nowrap;
    margin-left: auto;
`;
const ModalFooterWarning = styled.div`
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    color: ${colorsPalettes.carbon["400"]};
    font-size: 12px;
    line-height: 14px;
    background: ${rgba(colorsPalettes.carbon["500"], 0.05)};
    padding: 4px 8px;
    border-radius: 4px;
`;
const ModalFooterWarningText = styled.div`
    margin-left: 0.5em;
`;
const ModalContent = styled.div`
    ${flexAutoScrollContainer}
    flex: auto;
`;
const SegmentListContainer = styled.div`
    border: 1px solid ${colorsPalettes.carbon["50"]};
    flex: auto;
    ${flexAutoScrollContainer}
`;
const SegmentSelectorContainer = styled.div`
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
`;
export const SegmentItemsContainer = styled.div`
    padding: 0 12px;
    ${flexAutoScroll}
    ${SegmentRowContainer}+${SegmentRowContainer} {
        border-top: 1px solid ${colorsPalettes.carbon["50"]};
    }
`;

const SegmentTypeBadgeHorizontal = styled(SegmentTypeBadge)`
    text-indent: 0;
    margin-left: 10px;
`;

export const SegmentItem: React.FC<{ segment: ICustomSegment }> = ({ segment }) => (
    <SegmentItemContainer>
        <StyledItemIcon iconType={Type.Website} iconName="" iconSrc={segment.favicon} />
        <SegmentLabel hasCategory={!!segment.segmentName}>
            <DomainWrapper>
                <Domain>{segment.domain}</Domain>
            </DomainWrapper>
            {segment.segmentName && <SegmentCategory>{segment.segmentName}</SegmentCategory>}
        </SegmentLabel>
    </SegmentItemContainer>
);

export const WebsiteItem: React.FC<{
    website: ICustomSegmentGroupWebsite;
    displayPill?: boolean;
}> = ({ website, displayPill = true }) => (
    <SegmentItemContainer>
        <StyledItemIcon iconType={Type.Website} iconName="" iconSrc={website.favicon} />
        <SegmentLabel hasCategory={false}>
            <DomainWrapper>
                <Domain>{website.domain}</Domain>
                {displayPill && <SegmentTypeBadgeHorizontal>WEBSITE</SegmentTypeBadgeHorizontal>}
            </DomainWrapper>
        </SegmentLabel>
    </SegmentItemContainer>
);

export interface ISelectedSegmentContainer {
    segmentType: SEGMENT_TYPES;
    segment: ICustomSegmentMember;
    onRemoveSelected: (
        selectedSegment: ICustomSegmentMember,
        selectedSegmentType: SEGMENT_TYPES,
    ) => void;
    displayPill?: boolean;
}

export const SegmentItemRow: React.FC<ISelectedSegmentContainer> = ({
    segment,
    segmentType,
    onRemoveSelected,
    displayPill = true,
}) => {
    let segmentItemComponent;
    switch (segmentType) {
        case SEGMENT_TYPES.SEGMENT:
            segmentItemComponent = <SegmentItem segment={segment as ICustomSegment} />;
            break;
        case SEGMENT_TYPES.WEBSITE:
            segmentItemComponent = (
                <WebsiteItem
                    website={segment as ICustomSegmentGroupWebsite}
                    displayPill={displayPill}
                />
            );
            break;
    }
    const onRemoveProxy = React.useCallback(() => {
        onRemoveSelected(segment, segmentType);
    }, [segment, onRemoveSelected]);
    return (
        <SegmentRowContainer>
            {segmentItemComponent}
            <IconContainer size={20}>
                <ReactIconButton iconSize="xs" iconName="delete" onClick={onRemoveProxy} />
            </IconContainer>
        </SegmentRowContainer>
    );
};

const SegmentGroupModal: React.FC<any> = (props: ISegmentGroupModal) => {
    const { segmentsService } = React.useMemo(
        () => ({
            segmentsService: new segmentsApiService(),
        }),
        [],
    );
    const {
        isOpen,
        segmentGroup,
        groupCreatedUpdated,
        toggleCreateUpdateSegmentGroupModal,
        compareToSegment,
        segments,
        allSegments,
    } = props;
    const createCallInProgress = React.useRef(false);
    const [groupName, setGroupName] = useState("");
    const [selectedSegments, setSelectedSegments] = useState<
        [ICustomSegmentMember, SEGMENT_TYPES][]
    >([]);
    const [focusGroupName, setFocusGroupName] = useState(false);
    const [isSmallList, setIsSmallList] = useState(false);
    const [isNameMissingError, setIsNameMissingError] = useState(false);
    const swNavigator = React.useMemo(() => Injector.get<any>("swNavigator"), []);
    const currentRouteState = swNavigator.current();
    const currentModule = swNavigator.getCurrentModule();
    const segmentGEOState = `${currentModule}-analysis-geography`;

    useEffect(() => {
        setIsSmallList(false);
    }, [selectedSegments]);

    useEffect(() => {
        setGroupName(segmentGroup?.name ?? "");
        const segmentsIds = segmentGroup
            ? segmentGroup.members
            : compareToSegment
            ? [compareToSegment]
            : [];
        const newSelectedSegments = SegmentsUtils.getSegmentObjectsByKeys(segmentsIds, {
            segments: allSegments,
            websites: segmentGroup?.websites,
        });
        newSelectedSegments.sort((a, b) =>
            SegmentsUtils.sortSegments.byDomainName(a[0] as ICustomSegment, b[0] as ICustomSegment),
        );
        setSelectedSegments(newSelectedSegments);
    }, [segmentGroup, compareToSegment]);

    const resetModal = () => {
        createCallInProgress.current = false;
        setGroupName(undefined);
        setSelectedSegments([]);
    };

    const onChangeGroupName = React.useCallback((event) => {
        setGroupName(event?.currentTarget?.value);
        setIsNameMissingError(false);
    }, []);

    const onClickClose = React.useCallback(() => {
        TrackWithGuidService.trackWithGuid("segments.group.modal.close.btn", "click");
        toggleCreateUpdateSegmentGroupModal(false);
        resetModal();
    }, [toggleCreateUpdateSegmentGroupModal]);

    const createSegmentsGroup = React.useCallback(() => {
        if (createCallInProgress.current) {
            return;
        }
        if (groupName === "") {
            if (selectedSegments.length < 2) {
                setFocusGroupName(true);
                setIsNameMissingError(true);
                setIsSmallList(true);
                return;
            }
            setFocusGroupName(true);
            setIsNameMissingError(true);
            return;
        }
        if (selectedSegments.length < 2) {
            setIsSmallList(true);
            return;
        }
        createCallInProgress.current = true;
        TrackWithGuidService.trackWithGuid("segments.group.modal.create.btn", "click");
        const { segments: newSegments, websites: newWebsites } = selectedSegments.reduce(
            (acc, selectedSegment) => {
                const [selectedSegmentObj, selectedSegmentType] = selectedSegment;
                switch (selectedSegmentType) {
                    case SEGMENT_TYPES.SEGMENT:
                        acc.segments.push(selectedSegmentObj.id);
                        break;
                    case SEGMENT_TYPES.WEBSITE:
                        acc.websites.push(selectedSegmentObj.domain);
                        break;
                }
                return acc;
            },
            { segments: [], websites: [] },
        );
        const createUpdateGroupPromise = segmentGroup
            ? segmentsService.updateCustomSegmentsGroup({
                  name: groupName,
                  id: segmentGroup.id,
                  segments: newSegments,
                  websites: newWebsites,
              })
            : segmentsService.createCustomSegmentsGroup({
                  name: groupName,
                  segments: newSegments,
                  websites: newWebsites,
              });
        createUpdateGroupPromise
            .then((newGroup) => {
                // Resolve what is the current module, so that we could build the relevant segments
                // state name according to the module. this is done to support Solutions 2.0: segments analysis
                // has multiple routes in the platform.
                const currentRouteState = swNavigator.current();
                const currentModule = swNavigator.getCurrentModule();
                const segmentAnalysisState = `${currentModule}-analysis-traffic`;
                const segmentMMXState = `${currentModule}-analysis-marketingChannels`;
                const segmentGEOState = `${currentModule}-analysis-geography`;

                groupCreatedUpdated(newGroup);
                toggleCreateUpdateSegmentGroupModal(false);
                resetModal();
                if (
                    swNavigator.currentStateIncludes(segmentAnalysisState, {
                        mode: MODE.group,
                        id: newGroup.id,
                    }) ||
                    swNavigator.currentStateIncludes(segmentMMXState, {
                        mode: MODE.group,
                        id: newGroup.id,
                    }) ||
                    swNavigator.currentStateIncludes(segmentGEOState, {
                        mode: MODE.group,
                        id: newGroup.id,
                    })
                ) {
                    // if editing the current group in view
                    swNavigator.reload();
                } else {
                    const targetState = [
                        segmentAnalysisState,
                        segmentMMXState,
                        segmentGEOState,
                    ].includes(currentRouteState.name)
                        ? currentRouteState.name
                        : segmentAnalysisState;
                    swNavigator.go(targetState, {
                        id: newGroup.id,
                        mode: MODE.group,
                        ...SegmentsUtils.getPageFilterParams(newGroup.id),
                    }); // otherwise, go to the new group
                }
            })
            .catch((err) => {
                swLog.error("Failed to create segment group", err);
                createCallInProgress.current = false;
            });
    }, [
        segmentGroup,
        selectedSegments,
        groupName,
        groupCreatedUpdated,
        toggleCreateUpdateSegmentGroupModal,
    ]);

    const onSegmentSelection = React.useCallback(
        (selectedSegment: ICustomSegmentMember, selectedSegmentType: SEGMENT_TYPES) => {
            let matchSelectedAttr = "id";
            if (selectedSegmentType === SEGMENT_TYPES.WEBSITE) {
                matchSelectedAttr = "domain";
            }
            // avoid of adding existing members
            if (
                selectedSegments.findIndex(
                    ([memberObj, memberType]) =>
                        memberType === selectedSegmentType &&
                        memberObj[matchSelectedAttr] === selectedSegment[matchSelectedAttr],
                ) === -1
            ) {
                setSelectedSegments([[selectedSegment, selectedSegmentType], ...selectedSegments]);
            }
        },
        [selectedSegments],
    );

    const onRemoveSelection = React.useCallback(
        (selectedSegment: ICustomSegmentMember, selectedSegmentType: SEGMENT_TYPES) => {
            setSelectedSegments(
                selectedSegments.filter(
                    ([segment, segmentType]) =>
                        segment !== selectedSegment || segmentType !== selectedSegmentType,
                ),
            );
        },
        [selectedSegments],
    );

    const [mySegmentsSorted, accountSegmentsSorted] = React.useMemo(
        () => [
            (segments?.slice() ?? []).sort(SegmentsUtils.sortSegments.byCreationDomain),
            (allSegments?.filter((segment) => !itsMyOwnSegment(segment.userId)) ?? []).sort(
                SegmentsUtils.sortSegments.byCreationDomain,
            ),
        ],
        [segments, allSegments],
    );
    const [filteredMySegments, filteredAccountSegments] = React.useMemo(() => {
        const filteredMySegments = mySegmentsSorted?.filter(
            (segment) =>
                selectedSegments.findIndex(([selectedSeg]) => selectedSeg.id === segment.id) === -1,
        );
        const filteredAccountSegments = accountSegmentsSorted?.filter(
            (segment) =>
                selectedSegments.findIndex(([selectedSeg]) => selectedSeg.id === segment.id) === -1,
        );
        return [filteredMySegments, filteredAccountSegments];
    }, [selectedSegments, mySegmentsSorted, accountSegmentsSorted]);

    const segmentsCounterDataObj = React.useMemo(
        () => ({
            count: selectedSegments.length,
            max: MAX_SEGMENTS_IN_GROUP,
        }),
        [selectedSegments.length],
    );

    return (
        <ProModal isOpen={isOpen} onCloseClick={onClickClose} customStyles={proModalStyles}>
            <ModalContent>
                <AutosizeInput
                    isUnderline={true}
                    onChange={onChangeGroupName}
                    value={groupName ?? ""}
                    autoFocus={!segmentGroup}
                    placeholder={i18nFilter()("segments.group.modal.group.name.placeholder")}
                    maxLength={70}
                    error={isNameMissingError}
                    isFocused={focusGroupName}
                />
                <SegmentsCounterContainer>
                    <I18n>segments.group.modal.list.text</I18n>
                    <SegmentCounter isSmallList={isSmallList}>
                        <I18n dataObj={segmentsCounterDataObj}>
                            {isSmallList
                                ? "segments.group.modal.counter.segments.error.message"
                                : "segments.group.modal.counter.segments"}
                        </I18n>
                    </SegmentCounter>
                </SegmentsCounterContainer>
                <SegmentListContainer>
                    <SegmentSelectorContainer>
                        <SegmentSelectorDropdown
                            onSegmentSelection={onSegmentSelection}
                            segments={filteredMySegments}
                            accountSegments={filteredAccountSegments}
                            selectedSegments={selectedSegments}
                            disabled={selectedSegments.length >= MAX_SEGMENTS_IN_GROUP}
                        />
                    </SegmentSelectorContainer>
                    <SegmentItemsContainer>
                        {selectedSegments.map(([segment, segmentType]) => (
                            <SegmentItemRow
                                key={segment.id}
                                segmentType={segmentType}
                                segment={segment}
                                onRemoveSelected={onRemoveSelection}
                            />
                        ))}
                    </SegmentItemsContainer>
                </SegmentListContainer>
            </ModalContent>
            <ModalFooter>
                {selectedSegments.length > WARN_LARGE_GROUP_SEGMENTS &&
                    currentRouteState.name !== segmentGEOState && (
                        <ModalFooterWarning>
                            <BetaLabel />
                            <ModalFooterWarningText>
                                <I18n>segments.group.modal.warning.large</I18n>
                            </ModalFooterWarningText>
                        </ModalFooterWarning>
                    )}
                <ModalFooterButtons>
                    <Button
                        type="flat"
                        onClick={onClickClose}
                        dataAutomation="segments-group-modal-cancel-button"
                    >
                        <ButtonLabel>
                            <I18n>segments.group.modal.cancel.button</I18n>
                        </ButtonLabel>
                    </Button>
                    <Button
                        type="primary"
                        isDisabled={false}
                        onClick={createSegmentsGroup}
                        dataAutomation="segments-group-modal-save-button"
                    >
                        <ButtonLabel>
                            <I18n>segments.group.modal.save.button</I18n>
                        </ButtonLabel>
                    </Button>
                </ModalFooterButtons>
            </ModalFooter>
        </ProModal>
    );
};

function mapStateToProps(store) {
    const {
        segmentsModule: {
            customSegmentsMeta,
            createUpdateGroupSegmentModalIsOpen: isOpen,
            segmentGroup,
            compareToSegment,
        },
    } = store;
    return {
        isOpen,
        ...(isOpen && {
            segments: customSegmentsMeta?.Segments,
            groups: customSegmentsMeta?.SegmentGroups,
            allSegments: customSegmentsMeta?.AccountSegments,
            segmentGroup,
            compareToSegment,
        }),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleCreateUpdateSegmentGroupModal: (isOpen) => {
            dispatch(toggleCreateUpdateSegmentGroupModal(isOpen));
        },
        groupCreatedUpdated: (group) => {
            dispatch(groupCreatedUpdated(group));
        },
    };
}

export default SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(SegmentGroupModal),
    "SegmentGroupModal",
);
