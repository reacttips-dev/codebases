import swLog from "@similarweb/sw-log";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { ShareBar } from "@similarweb/ui-components/dist/share-bar";
import { toggleCreateUpdateSegmentGroupModal } from "actions/segmentsModuleActions";
import { Injector } from "common/ioc/Injector";
import { loadCustomSegmentsMetadata } from "pages/segments/config/segmentsConfigHelpers";
import * as React from "react";
import { FunctionComponent, useEffect, useState } from "react";
import { connect } from "react-redux";
import { InfoIcon } from "../../../../.pro-features/components/BoxTitle/src/BoxTitle";
import ComponentsProvider from "../../../../.pro-features/components/WithComponent/src/ComponentsProvider";
import I18n from "../../../components/React/Filters/I18n";
import { WebsiteTooltip } from "../../../components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { i18nFilter } from "../../../filters/ngFilters";
import SegmentsApiService from "../../../services/segments/segmentsApiService";
import { allTrackers } from "../../../services/track/track";
import { TrackWithGuidService } from "../../../services/track/TrackWithGuidService";
import { ExpandedHeaderContainer } from "../../website-analysis/website-content/leading-folders/components/Header";
import {
    CloseIconButton,
    DomainContainer,
    RowIndex,
    ShareBarContainer,
    ShareBarLabel,
    StyledIconButton,
    StyledRowInfo,
} from "../wizard/SegmentFirstStep/StyledComponent";
import { CustomSegmentAddtionalOptions } from "./CustomSegmentAdditionalOptions";
import { CompareButtonContainer, StyledCoreWebsiteCell } from "./StyledComponents";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import { SwTrack } from "services/SwTrack";

const CustomSegmentsAnalysisHeader: FunctionComponent = (props: any) => {
    const shareValue = props.response.Meta.TrafficShare;
    const segmentApiService = new SegmentsApiService();
    const { segmentName, domain, favicon, id, index, lastUpdated, userId } = props;
    const [windowWidth, setWindowWidth] = useState(0);
    const clickOutsideXButton = (e) => {
        document.body.click();
    };
    const swNavigator = Injector.get<any>("swNavigator");
    const editSegmentClick = () => {
        SwTrack.all.trackEvent("Internal Link", "click", `segmentAnalysis/editSegment/${id}`);
        const currentModule = swNavigator.getCurrentModule();
        const segmentWizardStateName = `${currentModule}-wizard`;
        swNavigator.go(segmentWizardStateName, { sid: id });
    };

    useEffect(() => {
        window.addEventListener("resize", updateWindowWidth, { capture: true });
        return function cleanup() {
            window.removeEventListener("resize", updateWindowWidth, { capture: true });
        };
    });

    const updateWindowWidth = () => {
        setWindowWidth(window.innerWidth);
    };

    const deleteSegmentClick = async (id) => {
        try {
            await segmentApiService.deleteCustomSegment(id);
            const currentPage = swNavigator.current();
            TrackWithGuidService.trackWithGuid("custom.segment.analysis.delete", "click", { id });
            swNavigator.go(
                currentPage.name,
                {
                    ...SegmentsUtils.getPageFilterParams(),
                },
                { reload: true },
            );
            loadCustomSegmentsMetadata(true); // reload segments metadata
        } catch (e) {
            swLog.error(`Failed to delete custom segmentID: ${id}`, e);
        }
    };
    const createSegmentGroup = () => {
        props.toggleCreateUpdateSegmentGroupModal(true, id);
    };
    const onDownloadClick = () => {
        TrackWithGuidService.trackWithGuid("custom.segment.analysis.download.excel", "click");
    };
    const subtitleFilters = [];
    subtitleFilters.push({
        filter: "text",
        value: segmentName,
    });

    const additionalProps = {
        domain,
        userId,
        id,
        lastUpdated,
        segmentName,
        onExcelDownload: onDownloadClick,
        onClickDelete: deleteSegmentClick,
    };
    return (
        <ExpandedHeaderContainer>
            <StyledRowInfo>
                <DomainContainer>
                    <RowIndex>{index + 1}</RowIndex>
                    <ComponentsProvider components={{ WebsiteTooltip }}>
                        <StyledCoreWebsiteCell
                            icon={favicon}
                            domain={domain}
                            externalLink={`http://${domain}`}
                            subtitleFilters={subtitleFilters.length > 0 ? subtitleFilters : null}
                            trackExternalLink={() =>
                                allTrackers.trackEvent(
                                    "external link",
                                    "click",
                                    `Segments Group Analysis`,
                                )
                            }
                        />
                    </ComponentsProvider>
                    <CompareButtonContainer>
                        <Button
                            type={"flat"}
                            onClick={createSegmentGroup}
                            dataAutomation="segments-group-modal-compare-button"
                        >
                            <ButtonLabel>
                                <I18n>segments.group.modal.launch.compare.button</I18n>
                            </ButtonLabel>
                        </Button>
                    </CompareButtonContainer>
                </DomainContainer>
                <ShareBarContainer>
                    <ShareBarLabel>
                        <I18n>segments.expanded.header.trafficshare.label</I18n>
                        <PlainTooltip
                            tooltipContent={i18nFilter()(
                                "segments.expanded.header.trafficshare.tooltip",
                            )}
                            placement="top"
                        >
                            <span>
                                <InfoIcon iconName="info" />
                            </span>
                        </PlainTooltip>
                    </ShareBarLabel>
                    <ShareBar value={shareValue} hideChangeValue={true} />
                    <StyledIconButton
                        iconSize={windowWidth <= 1440 ? "xs" : "sm"}
                        type="flat"
                        onClick={editSegmentClick}
                        iconName="edit-icon"
                        placement="left"
                    />
                    <CustomSegmentAddtionalOptions {...additionalProps} />
                    <CloseIconButton
                        iconSize={windowWidth <= 1440 ? "xs" : "sm"}
                        type="flat"
                        onClick={clickOutsideXButton}
                        iconName="clear"
                        placement="left"
                    />
                </ShareBarContainer>
            </StyledRowInfo>
        </ExpandedHeaderContainer>
    );
};

function mapDispatchToProps(dispatch) {
    return {
        toggleCreateUpdateSegmentGroupModal: (isOpen, segmentToCompare) => {
            dispatch(toggleCreateUpdateSegmentGroupModal(isOpen, undefined, segmentToCompare));
        },
    };
}

export default connect(undefined, mapDispatchToProps)(CustomSegmentsAnalysisHeader);
