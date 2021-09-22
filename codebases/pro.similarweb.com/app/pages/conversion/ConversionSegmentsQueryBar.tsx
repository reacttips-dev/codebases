import { colorsPalettes } from "@similarweb/styles";
import { Title } from "@similarweb/ui-components/dist/title";
import * as _ from "lodash";
import * as React from "react";
import { FunctionComponent } from "react";
import { connect } from "react-redux";
import { ISegmentsData } from "services/conversion/ConversionSegmentsService";
import styled from "styled-components";
import { Injector } from "../../../scripts/common/ioc/Injector";
import {
    toggleDeleteSegmentModal,
    toggleRenameSegmentModal,
} from "../../actions/conversionModuleActions";
import { IConversionModuleState } from "../../reducers/_reducers/ConversionModuleReducer";
import {
    ConversionNavAdditionalOptions,
    IConversionNavAdditionalOptionsProps,
} from "./ConversionNavAdditionalOptionsEllipsis";
import DeleteSegmentGroupConfirmation from "./modals/DeleteSegmentGroupConfirmation";
import RenameSegmentGroupConfirmation from "./modals/RenameSegmentGroupModal";
import { ConversionSegmentTitle } from "./StyledComponents";
import { SwTrack } from "services/SwTrack";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";

const StyledPageTitle: any = styled(Title)`
    font-size: 16px;
    font-weight: 500;
`;
StyledPageTitle.displayName = "StyledPageTitle";

const HomeLinkContainer: any = styled(Title)`
    width: 256px;
    height: 100%;
    border-right: 1px solid ${colorsPalettes.carbon["100"]};
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
    align-items: center;
`;
HomeLinkContainer.displayName = "HomeLinkContainer";

const SegmentContainer: any = styled.div`
    display: flex;
    align-items: center;
    text-transform: capitalize;
    flex-shrink: 0;
`;
SegmentContainer.displayName = "SegmentContainer";

const SegmentsQueryBarContainer: any = styled.div`
    height: 64px;
    display: flex;
    flex-direction: row;
`;
SegmentsQueryBarContainer.displayName = "SegmentsQueryBarContainer";

export interface IConversionSegmentsQueryBarProps {
    deleteGroupSegmentModalIsOpen?: boolean;
    renameGroupSegmentModalIsOpen?: boolean;
    gid?: string;
    toggleDeleteSegmentModal: (isOpen, gid) => {};
    toggleRenameSegmentModal: (isOpen, gid) => {};
    segmentsLoading: boolean;
    segments: ISegmentsData;
}

const ConversionSegmentsQueryBar: FunctionComponent<IConversionSegmentsQueryBarProps> = (props) => {
    const services = {
        $rootScope: Injector.get<any>("$rootScope"),
        swNavigator: Injector.get<any>("swNavigator"),
    };
    const { segmentGroups, segments } = props.segments;
    const settingsProps: IConversionNavAdditionalOptionsProps = {
        useSettingsBtn: true,
        onClickDelete: (gid) => {
            const state = services.swNavigator.current();
            SwTrack.all.trackEvent("Button", "click", `QueryBar/Delete group/${gid}`);
            props.toggleDeleteSegmentModal(true, gid);
        },
        onClickRename: (gid) => {
            const state = services.swNavigator.current();
            SwTrack.all.trackEvent("Button", "click", `QueryBar/Rename group/${gid}`);
            props.toggleRenameSegmentModal(true, gid);
        },
        onClickEdit: (action: string, gid, country) => {
            const state = services.swNavigator.current();
            SwTrack.all.trackEvent("Button", "click", `QueryBar/${action} sites/${gid}`);
            services.swNavigator.go("conversion-wizard", { gid, country });
        },
        onToggleEllipsis: () => {
            const state = services.swNavigator.current();
            SwTrack.all.trackEvent("Button", "click", `Side bar/Additional Options/Toggle`);
        },
        dropDownStyle: {
            marginLeft: 8,
        },
    };

    const render = () => {
        const { sid, gid } = services.swNavigator.getParams();
        const segmentName = sid ? _.get(segments, [sid, "segmentName"], "") : "";
        const homepageLink = services.swNavigator.href("conversion-homepage", {});
        return (
            <SegmentsQueryBarContainer>
                <SegmentContainer>
                    <PlainTooltip text={segmentName}>
                        <StyledPageTitle>
                            {sid ? (
                                <ConversionSegmentTitle>
                                    {_.get(segments, [sid, "domain"], "")}{" "}
                                    {segmentName ? ` - ${segmentName}` : ""}
                                </ConversionSegmentTitle>
                            ) : (
                                // seems like kind of problem with typing of _.get
                                // it combines ISegmentGroupData with string type
                                (_.get(segmentGroups, [gid, "name"], "") as string).replace(
                                    /_/g,
                                    " ",
                                )
                            )}
                        </StyledPageTitle>
                    </PlainTooltip>
                    {!sid && <ConversionNavAdditionalOptions {...settingsProps} />}
                </SegmentContainer>
                <DeleteSegmentGroupConfirmation
                    isOpen={props.deleteGroupSegmentModalIsOpen}
                    gid={props.gid}
                    segmentsData={props.segments}
                />
                <RenameSegmentGroupConfirmation
                    isOpen={props.renameGroupSegmentModalIsOpen}
                    gid={props.gid}
                    segmentsData={props.segments}
                />
            </SegmentsQueryBarContainer>
        );
    };

    if (props.segmentsLoading) {
        return null;
    }

    return render();
};

function mapStateToProps(store) {
    const conversionModule: IConversionModuleState = store.conversionModule;
    const routing: IConversionModuleState = store.routing;
    return {
        ...routing,
        ...conversionModule,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleDeleteSegmentModal: (isOpen, gid) => {
            dispatch(toggleDeleteSegmentModal(isOpen, gid));
        },
        toggleRenameSegmentModal: (isOpen, gid) => {
            dispatch(toggleRenameSegmentModal(isOpen, gid));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversionSegmentsQueryBar);
