import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import swLog from "@similarweb/sw-log";
import { AutosizeInput } from "@similarweb/ui-components/dist/autosize-input";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import { FunctionComponent, useEffect, useState } from "react";
import { connect } from "react-redux";
import { ISegmentsData } from "services/conversion/ConversionSegmentsService";
import styled from "styled-components";
import { ButtonGroup } from "../../../../.pro-features/components/ButtonsGroup/src/ButtonsGroup";
import { ProModal } from "../../../../.pro-features/components/Modals/src/ProModal";
import {
    fetchSegmentsdata,
    toggleRenameSegmentModal,
} from "../../../actions/conversionModuleActions";
import I18n from "../../../components/React/Filters/I18n";
import { i18nFilter } from "../../../filters/ngFilters";
import ConversionApiService from "../../../services/conversion/conversionApiService";
import { ConversionSegmentsUtils } from "../ConversionSegmentsUtils";
import { SwTrack } from "services/SwTrack";

interface IRenameSegmentGroupModalProps {
    isOpen: boolean;
    gid?: string;
    toggleRenameSegmentModal?: (isOpen, gid) => void;
    fetchSegments: () => void;
    segmentsData: ISegmentsData;
}

const RenameConfirmationContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
`;
RenameConfirmationContainer.displayName = "RenameConfirmationContainer";

const RenameConfirmationTitle = styled.div`
    margin-top: 23px;
    margin-bottom: 20px;
    ${setFont({ $size: 18, $color: colorsPalettes.carbon[400] })};
`;
RenameConfirmationTitle.displayName = "RenameConfirmationTitle";

const RenameSegmentGroupModal: FunctionComponent<IRenameSegmentGroupModalProps> = ({
    isOpen,
    gid,
    toggleRenameSegmentModal,
    segmentsData,
    fetchSegments,
}) => {
    const groupData = ConversionSegmentsUtils.getSegmentGroupById(segmentsData, gid);
    const groupName = groupData ? groupData.name : "";
    const conversionApiService = new ConversionApiService();
    const [groupEditText, setGroupEditText] = useState(groupName);
    useEffect(() => {
        setGroupEditText(groupName);
    }, [gid]);
    const onChangeName = (event) => {
        SwTrack.all.trackEvent(
            "Input",
            "change",
            `RenameSegmentGroupModal/Change/${gid}/${event.target.value}`,
        );
        setGroupEditText(event.target.value);
    };
    const onCancelClick = () => {
        SwTrack.all.trackEvent("Button", "click", `RenameSegmentGroupModal/Cancel/${gid}`);
        toggleRenameSegmentModal(false, undefined);
    };

    const onApproveClick = async () => {
        SwTrack.all.trackEvent("Button", "click", `RenameSegmentGroupModal/Approve/${gid}`);
        try {
            await conversionApiService.renameSegmentCustomGroup({ gid, name: groupEditText });
            fetchSegments();
            toggleRenameSegmentModal(false, undefined);
        } catch (error) {
            swLog.exception(`Failed to rename user group segment : ${gid}`, error);
        }
    };

    const onCloseClick = () => {
        SwTrack.all.trackEvent("Button", "click", `RenameSegmentGroupModal/Close/${gid}`);
        toggleRenameSegmentModal(false, undefined);
    };
    const moreProps: any = {
        customStyles: {
            content: {
                boxSizing: "content-box",
                width: "518px",
            },
        },
    };

    return (
        <ProModal isOpen={isOpen} onCloseClick={onCloseClick} {...moreProps}>
            <div>
                <RenameConfirmationContainer>
                    <RenameConfirmationTitle>
                        <I18n>conversion.rename.segment.group.title</I18n>
                    </RenameConfirmationTitle>
                    <AutosizeInput
                        onChange={onChangeName}
                        value={groupEditText}
                        maxLength={40}
                        placeholder={i18nFilter()("conversion.rename.segment.group.placeholder")}
                    />
                </RenameConfirmationContainer>
                <ButtonGroup>
                    <Button type="primary" onClick={onApproveClick}>
                        <ButtonLabel>
                            {i18nFilter()("conversion.rename.segment.group.submit")}
                        </ButtonLabel>
                    </Button>
                </ButtonGroup>
            </div>
        </ProModal>
    );
};

RenameSegmentGroupModal.displayName = "RenameSegmentGroupModal";

function mapDispatchToProps(dispatch) {
    return {
        fetchSegments: () => {
            dispatch(fetchSegmentsdata());
        },
        toggleRenameSegmentModal: (isOpen, gid) => {
            dispatch(toggleRenameSegmentModal(isOpen, gid));
        },
    };
}

export default connect(undefined, mapDispatchToProps)(RenameSegmentGroupModal);
