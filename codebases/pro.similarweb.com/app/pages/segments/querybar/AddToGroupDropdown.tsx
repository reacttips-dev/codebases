import React from "react";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import segmentsApiService, { ICustomSegmentsGroup } from "services/segments/segmentsApiService";
import {
    DropdownContainer,
    QueryBarIconButton,
    QueryBarDropdownContainerStyles,
} from "pages/segments/querybar/styledComponents";
import { getToastItemComponent } from "components/React/Toast/ToastItem";
import { connect } from "react-redux";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { Dropdown, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { MAX_SEGMENTS_IN_GROUP } from "pages/segments/analysis/SegmentsAnalysisHelper";
import { groupCreatedUpdated } from "actions/segmentsModuleActions";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import { showSuccessToast } from "actions/toast_actions";
import swLog from "@similarweb/sw-log/index";
import { allTrackers } from "services/track/track";
import { SwNavigator } from "common/services/swNavigator";
import { Injector } from "common/ioc/Injector";
import { MODE } from "pages/segments/analysis/SegmentsAnalysisTrafficContainer";
import { i18nFilter } from "filters/ngFilters";
import { TableSelectionKeywordsWarning } from "../../../../.pro-features/components/TableSelection/src/TableSelectionKeywordsWarning";

interface IAddToGroupDropdownProps {
    groups: ICustomSegmentsGroup[];
    currentSegmentId: string;
    groupCreatedUpdated?: (group: ICustomSegmentsGroup) => void;
    showToast?: (content: any) => void;
}

const AddToGroupDropdownComponent = (props: IAddToGroupDropdownProps) => {
    const [errorMode, setErrorMode] = React.useState(false);
    const [isFullGroup, setIsFullGroup] = React.useState(false);
    const services = React.useMemo(
        () => ({
            segmentsService: new segmentsApiService(),
            i18n: i18nFilter(),
        }),
        [],
    );
    const dropdownRef = React.useRef(null);
    const { groups, currentSegmentId, groupCreatedUpdated, showToast } = props;

    const onCancelSelectionWarning = React.useCallback(() => {
        setErrorMode(false);
        setIsFullGroup(false);
    }, [setErrorMode, setIsFullGroup]);

    const onClickItem = React.useCallback(
        (item) => {
            const segmentGroup = SegmentsUtils.getSegmentGroupById(groups, item.id);

            // check pre-conditions to add current segment to group
            if (segmentGroup.segments.some((segmentId) => segmentId === currentSegmentId)) {
                setErrorMode(true);
                dropdownRef.current.scrollAreaElement.scrollTop();
                return;
            } else if (segmentGroup.members.length >= MAX_SEGMENTS_IN_GROUP) {
                setErrorMode(true);
                setIsFullGroup(true);
                dropdownRef.current.scrollAreaElement.scrollTop();
                return;
            }

            allTrackers.trackEvent(
                "Drop Down",
                "click item",
                `Segments/Single/Add to group/${segmentGroup.id}/${item.id}`,
            );

            // add current segment to group
            services.segmentsService
                .updateCustomSegmentsGroup({
                    name: segmentGroup.name,
                    id: segmentGroup.id,
                    segments: segmentGroup.segments.concat([currentSegmentId]),
                    websites: segmentGroup.websites.map((website) => website.domain),
                })
                .then((newGroup) => {
                    groupCreatedUpdated(newGroup);
                    const swNavigator: SwNavigator = Injector.get("swNavigator");
                    const currentModule = swNavigator.getCurrentModule();
                    const segmentAnalysisState = `${currentModule}-analysis-traffic`;
                    const href = swNavigator.href(segmentAnalysisState, {
                        id: newGroup.id,
                        mode: MODE.group,
                    });
                    showToast(
                        getToastItemComponent({
                            text: services.i18n("segment.analysis.add.to.group.toast.text"),
                            linkText: services.i18n("segment.analysis.add.to.group.toast.button"),
                            href,
                            onClick: allTrackers.trackEvent.bind(
                                allTrackers,
                                "segment add to group toast link",
                                "click",
                                "internal link/segments.analysis",
                            ),
                        }),
                    );
                })
                .catch((err) => {
                    swLog.error("Failed to add segment to group", err);
                });

            // close the popup
            dropdownRef.current.closePopup();
        },
        [groups, currentSegmentId],
    );

    const onDropdownToggle = React.useCallback(
        (isOpen) => {
            if (!isOpen) {
                onCancelSelectionWarning();
            }
        },
        [onCancelSelectionWarning],
    );

    return (
        <FlexRow>
            <QueryBarDropdownContainerStyles />
            <DropdownContainer>
                <Dropdown
                    ref={dropdownRef}
                    closeOnItemClick={false}
                    onClick={onClickItem}
                    onToggle={onDropdownToggle}
                    hasSearch={true}
                    searchPlaceHolder={services.i18n(
                        "segments.querybar.segment.add.to.group.dropdown.placeholder",
                    )}
                    dropdownPopupPlacement={"ontop-left"}
                    dropdownPopupHeight={264}
                    cssClassContainer="DropdownContent-container QueryBarDropdownContent"
                >
                    {[
                        <PlainTooltip
                            key="btn"
                            placement="bottom"
                            tooltipContent={services.i18n(
                                "segments.querybar.segment.add.to.group.tooltip",
                            )}
                        >
                            <span>
                                <QueryBarIconButton
                                    iconName="add-to-group"
                                    type="flat"
                                    iconSize="sm"
                                />
                            </span>
                        </PlainTooltip>,
                        ...(errorMode
                            ? [
                                  <TableSelectionKeywordsWarning
                                      key="all-items-exist"
                                      onCancel={onCancelSelectionWarning}
                                      message={services.i18n(
                                          isFullGroup
                                              ? "segment.analysis.add.to.group.error.message.is.full.group"
                                              : "segment.analysis.add.to.group.error.message",
                                      )}
                                  />,
                              ]
                            : groups.map((group, idx) => (
                                  <EllipsisDropdownItem key={idx} id={group.id}>
                                      {group.name}
                                  </EllipsisDropdownItem>
                              ))),
                    ]}
                </Dropdown>
            </DropdownContainer>
        </FlexRow>
    );
};

function mapDispatchToProps(dispatch) {
    return {
        groupCreatedUpdated: (group) => {
            dispatch(groupCreatedUpdated(group));
        },
        showToast: (content) => {
            dispatch(showSuccessToast(content));
        },
    };
}

export default React.memo(connect(null, mapDispatchToProps)(AddToGroupDropdownComponent));
