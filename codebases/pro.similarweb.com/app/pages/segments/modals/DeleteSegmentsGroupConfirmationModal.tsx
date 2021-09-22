import swLog from "@similarweb/sw-log";
import {
    deleteSegmentGroupSuccess,
    toggleDeleteSegmentGroupModal,
} from "actions/segmentsModuleActions";
import { Injector } from "common/ioc/Injector";
import {
    DeleteGroupConfirmationModal,
    IDeleteGroupConfirmationModalProps,
} from "components/Modals/src/DeleteGroupConfirmationModal";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as React from "react";
import { FC, useEffect, useState } from "react";
import { connect } from "react-redux";
import SegmentsApiService, { ICustomSegmentsGroup } from "services/segments/segmentsApiService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import { segmentsConfig } from "pages/segments/config/segmentsConfig";

interface ISegmentsDeleteGroupConformationModalProps {
    isOpen: boolean;
    group?: ICustomSegmentsGroup;
    toggleDeleteSegmentGroupModal: (isOpen, group) => void;
    deleteSegmentGroupSuccess: (group) => void;
    params: any;
    currentPage: string;
}

const DeleteSegmentsGroupConfirmationModal: FC<ISegmentsDeleteGroupConformationModalProps> = ({
    isOpen,
    group,
    toggleDeleteSegmentGroupModal,
    deleteSegmentGroupSuccess,
    params,
    currentPage,
}) => {
    const [isModalOpen, setModalIsOpen] = useState(isOpen);
    const swNavigator = Injector.get("swNavigator") as any;
    useEffect(() => {
        setModalIsOpen(isOpen);
    }, [isOpen]);
    const segmentsApiService = new SegmentsApiService();
    const onCancelClick = () => {
        TrackWithGuidService.trackWithGuid(
            "segments.module.delete.group.modal.oncancel.button",
            "click",
            { group: group.name },
        );
        toggleDeleteSegmentGroupModal(false, undefined);
    };

    const onApproveClick = async () => {
        TrackWithGuidService.trackWithGuid(
            "segments.module.delete.group.modal.onapprove.button",
            "click",
            { group: group.name },
        );
        await segmentsApiService.deleteCustomSegmentsGroup({ id: group.id });
        toggleDeleteSegmentGroupModal(false, undefined);
        setModalIsOpen(false);
        if (params.id === group.id) {
            const currentModule = swNavigator.getCurrentModule();
            const targetStateName = `${currentModule}-homepage`;
            await swNavigator.go(
                targetStateName,
                { ...SegmentsUtils.getPageFilterParams() },
                { reload: true },
            );
        }
        deleteSegmentGroupSuccess(group);
    };

    const onCloseClick = () => {
        TrackWithGuidService.trackWithGuid(
            "Button",
            "click",
            `Delete confirmation/Close/${group.name}`,
        );
        toggleDeleteSegmentGroupModal(false, undefined);
        setModalIsOpen(false);
    };

    const confirmationModal: IDeleteGroupConfirmationModalProps = {
        onCancelClick,
        onApproveClick,
        onCloseClick,
        isOpen: isModalOpen,
        confirmationTitle: "conversion.delete.segment.group.title",
        confirmationSubtitle: "conversion.delete.segment.group.subtitle",
        groupname: group?.name,
    };
    return <DeleteGroupConfirmationModal {...confirmationModal} />;
};

function mapStateToProps(store) {
    const {
        routing: { params, currentPage },
        segmentsModule: { deleteSegmentGroupIsOpen, segmentGroup },
    } = store;
    return {
        params,
        currentPage,
        isOpen: deleteSegmentGroupIsOpen,
        group: segmentGroup,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleDeleteSegmentGroupModal: (isOpen, segmentGroup) => {
            dispatch(toggleDeleteSegmentGroupModal(isOpen, segmentGroup));
        },
        deleteSegmentGroupSuccess: (segmentGroup) => {
            dispatch(deleteSegmentGroupSuccess(segmentGroup));
        },
    };
}

export default SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(DeleteSegmentsGroupConfirmationModal),
    "DeleteSegmentsGroupConfirmationModal",
);
