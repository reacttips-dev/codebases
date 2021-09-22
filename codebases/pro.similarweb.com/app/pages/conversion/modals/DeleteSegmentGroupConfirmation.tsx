import swLog from "@similarweb/sw-log";
import {
    DeleteGroupConfirmationModal,
    IDeleteGroupConfirmationModalProps,
} from "components/Modals/src/DeleteGroupConfirmationModal";
import * as React from "react";
import { StatelessComponent } from "react";
import { connect } from "react-redux";
import { ISegmentsData } from "services/conversion/ConversionSegmentsService";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import {
    fetchSegmentsdata,
    toggleDeleteSegmentModal,
} from "../../../actions/conversionModuleActions";
import ConversionApiService from "../../../services/conversion/conversionApiService";
import { ConversionSegmentsUtils } from "../ConversionSegmentsUtils";
import { SwTrack } from "services/SwTrack";

interface IDeleteSegmentGroupConfirmationProps {
    isOpen: boolean;
    gid?: string;
    toggleDeleteSegmentModal?: (isOpen, gid) => void;
    fetchSegments: () => void;
    segmentsData: ISegmentsData;
}

const DeleteSegmentGroupConfirmation: StatelessComponent<IDeleteSegmentGroupConfirmationProps> = ({
    isOpen,
    gid,
    toggleDeleteSegmentModal,
    segmentsData,
    fetchSegments,
}) => {
    const groupData = ConversionSegmentsUtils.getSegmentGroupById(segmentsData, gid);
    const groupname = groupData ? groupData.name : "";
    const conversionApiService = new ConversionApiService();
    const swNavigator = Injector.get<any>("swNavigator");

    const onCancelClick = () => {
        SwTrack.all.trackEvent("Button", "click", `Delete confirmation/Cancel/${gid}`);
        toggleDeleteSegmentModal(false, undefined);
    };

    const onApproveClick = async () => {
        SwTrack.all.trackEvent("Button", "click", `Delete confirmation/Delete/${gid}`);
        try {
            await conversionApiService.deleteSegmentCustomGroup({ gid });
            fetchSegments();
            const gidFromParams = swNavigator.getParams().gid;
            if (gid === gidFromParams) {
                window.location.href = swNavigator.getStateUrl("conversion-homepage", {});
            }
            toggleDeleteSegmentModal(false, undefined);
        } catch (error) {
            swLog.exception(`Failed to delete user group segment : ${gid}`, error);
        }
    };

    const onCloseClick = () => {
        SwTrack.all.trackEvent("Button", "click", `Delete confirmation/Close/${gid}`);
        toggleDeleteSegmentModal(false, undefined);
    };

    const confirmationModal: IDeleteGroupConfirmationModalProps = {
        onCancelClick,
        onApproveClick,
        onCloseClick,
        isOpen,
        confirmationTitle: "conversion.delete.segment.group.title",
        confirmationSubtitle: "conversion.delete.segment.group.subtitle",
        groupname,
    };
    return <DeleteGroupConfirmationModal {...confirmationModal} />;
};

DeleteSegmentGroupConfirmation.displayName = "DeleteSegmentGroupConfirmation";

function mapDispatchToProps(dispatch) {
    return {
        fetchSegments: () => {
            dispatch(fetchSegmentsdata());
        },
        toggleDeleteSegmentModal: (isOpen, gid) => {
            dispatch(toggleDeleteSegmentModal(isOpen, gid));
        },
    };
}

export default connect(undefined, mapDispatchToProps)(DeleteSegmentGroupConfirmation);
