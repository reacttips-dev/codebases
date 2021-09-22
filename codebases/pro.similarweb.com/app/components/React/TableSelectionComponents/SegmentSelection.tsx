import { SwLog } from "@similarweb/sw-log";
import { Injector } from "common/ioc/Injector";
import { SWReactTableWrapperContextConsumer } from "components/React/Table/SWReactTableWrapperSelectionContext";
import { TableSelection } from "components/TableSelection/src/TableSelection";
import {
    ETableSelectionNewGroupDropdownMode,
    TableSelectionNewGroupDropdown,
} from "components/TableSelection/src/TableSelectionNewGroupDropdown";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import { MODE } from "pages/segments/analysis/SegmentsAnalysisTrafficContainer";
import { loadCustomSegmentsMetadata } from "pages/segments/config/segmentsConfigHelpers";
import React, { FunctionComponent, useRef, useState } from "react";
import { connect } from "react-redux";
import segmentsApiService, { ICustomSegmentsGroup } from "services/segments/segmentsApiService";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import { allTrackers } from "services/track/track";
import { MAX_SEGMENTS_IN_GROUP } from "pages/segments/analysis/SegmentsAnalysisHelper";

const SegmentSelection: FunctionComponent<any> = (props) => {
    const i18n = i18nFilter();
    const {
        selectedRows,
        clearAllSelectedRows,
        showToast,
        appendTo = ".swReactTable-header-wrapper",
        segmentGroups,
    } = props;
    const { segmentsService } = React.useMemo(
        () => ({
            segmentsService: new segmentsApiService(),
        }),
        [],
    );
    const swNavigator = Injector.get<any>("swNavigator");
    const dropdownRef = useRef(null);
    const [newGroupLoading, setNewGroupLoading] = useState(false);
    const [newGroupError, setNewGroupError] = useState(false);
    const [newGroupErrorMessage, setNewGroupErrorMessage] = useState(null);
    const [tableSelectionMode, setTableSelectionMode] = useState(
        ETableSelectionNewGroupDropdownMode.GROUP_LIST,
    );
    const [currentGroup, setCurrentGroup] = useState(null);

    const showSuccessToast = (name, isNewGroup, groupId?: string, segmentIdsLength?: number) => {
        clearAllSelectedRows();
        setTableSelectionMode(ETableSelectionNewGroupDropdownMode.GROUP_LIST);
        setNewGroupErrorMessage(null);
        setNewGroupError(false);
        dropdownRef.current.close();
        const text = isNewGroup
            ? i18n("table.selection.segments.groupcreated", { segmentsAdded: segmentIdsLength })
            : i18n("table.selection.segments.groupupdated", { segmentsAdded: segmentIdsLength });
        showGroupLinkToast(name, text, i18n("table.selection.segments.seegroup"), groupId);
    };
    const showGroupLinkToast = (name, text, label, groupId: string) => {
        const currentModule = swNavigator.getCurrentModule();
        const segmentAnalysisStateName = `${currentModule}-analysis-traffic`;
        const linkToGroup = swNavigator.href(segmentAnalysisStateName, {
            mode: MODE.group,
            country: 840,
            duration: "3m",
            id: groupId,
        });
        dropdownRef.current.close();
        showToast(linkToGroup, text, label);
    };
    const tableSelectionOnCancel = () => {
        setTableSelectionMode(ETableSelectionNewGroupDropdownMode.GROUP_LIST);
        setNewGroupError(false);
        setNewGroupErrorMessage(null);
    };

    const tableSelectionOnSubmit = async (name) => {
        const selectedSegmentsIds = selectedRows.map((row) => row.id);
        allTrackers.trackEvent(
            "add to segment group",
            "submit-ok",
            `create new group/Save/${name};${selectedSegmentsIds.length}`,
        );
        setNewGroupLoading(true);
        try {
            const newGroup = await segmentsService.createCustomSegmentsGroup({
                name: name,
                segments: selectedSegmentsIds,
            });
            showSuccessToast(name, true, newGroup?.id, selectedSegmentsIds.length);
            loadCustomSegmentsMetadata(true);
        } catch (e) {
            SwLog.error(e);
        } finally {
            setNewGroupLoading(false);
        }
    };
    const getGroups = () => {
        return segmentGroups?.map((group: ICustomSegmentsGroup) => {
            const { name, id } = group;
            return { text: name, id };
        });
    };
    const onGroupClick = async (item) => {
        // click on new group
        if (!item.id) {
            onNewGroupClick(item);
            allTrackers.trackEvent("add to segment group", "click", "create new group");
        }
        // click on existing group
        else {
            await onExistingGroupClick(item);
        }
    };
    const onExistingGroupClick = async ({ id, text }) => {
        const currentGroup = SegmentsUtils.getSegmentGroupById(segmentGroups, id);
        const currentSegments = currentGroup.segments;
        const selectedSegmentsIds = selectedRows.map((row) => row.id);
        const withoutDuplications = _.uniq([...currentSegments, ...selectedSegmentsIds]);
        const newSegmentsCount = withoutDuplications.length - currentSegments.length;

        // if no new domains were added
        if (newSegmentsCount === 0) {
            setTableSelectionMode(ETableSelectionNewGroupDropdownMode.ALL_ITEMS_EXISTS);
            setCurrentGroup(text);
        }

        // new Segments added
        else {
            // check number of segments in segments group
            if (withoutDuplications.length > MAX_SEGMENTS_IN_GROUP) {
                setTableSelectionMode(ETableSelectionNewGroupDropdownMode.MAX_ITEMS);
            } else {
                allTrackers.trackEvent(
                    "add to Custom segments group",
                    "click",
                    `edit segment group/Save/${text};${newSegmentsCount}`,
                );
                try {
                    const update = await segmentsService.updateCustomSegmentsGroup({
                        name: text,
                        id: currentGroup.id,
                        segments: withoutDuplications,
                    });
                    await loadCustomSegmentsMetadata(true);
                    if (update) {
                        showSuccessToast(text, false, currentGroup.id);
                    }
                } catch (e) {
                    SwLog.error(e);
                }
            }
        }
    };

    const onNewGroupClick = (item) => {
        if (selectedRows.length > MAX_SEGMENTS_IN_GROUP) {
            setTableSelectionMode(ETableSelectionNewGroupDropdownMode.MAX_ITEMS);
        } else {
            setTableSelectionMode(ETableSelectionNewGroupDropdownMode.NEW_GROUP);
        }
    };

    const getDropdownComponent = () => {
        return (
            <TableSelectionNewGroupDropdown
                appendTo={appendTo}
                ref={dropdownRef}
                groups={getGroups()}
                onSubmit={tableSelectionOnSubmit}
                isLoading={newGroupLoading}
                errorMessage={newGroupErrorMessage}
                error={newGroupError}
                onGroupClick={onGroupClick}
                currentGroup={currentGroup}
                mode={tableSelectionMode}
                onCancel={tableSelectionOnCancel}
                groupIconName="segment-folder"
                newGroupNameLabel={i18n("table.selection.newgroup.segment.title")}
                trackingCategory="add to segment group"
                allItemsExistsMessage="table.selection.websites.exists"
                maxItemsMessage="table.selection.websites.max.websites"
                newGroupItemText="table.selection.newgroup.segment.create"
                groupType="segment"
            />
        );
    };
    return (
        <SWReactTableWrapperContextConsumer>
            {({ selectedRows, clearAllSelectedRows }) => {
                const text = i18n("incomingtraffic.tableselection.selected", {
                    count: selectedRows.length.toString(),
                });
                return (
                    <TableSelection
                        key="1"
                        selectedText={text}
                        onCloseClick={clearAllSelectedRows}
                        addToGroupLabel=""
                        isVisible={selectedRows.length > 0}
                        groupSelectorElement={getDropdownComponent()}
                    />
                );
            }}
        </SWReactTableWrapperContextConsumer>
    );
};

const mapStateToProps = ({ segmentsModule: { customSegmentsMeta } }) => {
    return {
        segmentGroups: customSegmentsMeta?.SegmentGroups,
    };
};
export default connect(mapStateToProps, undefined)(SegmentSelection);
