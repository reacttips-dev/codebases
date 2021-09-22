import * as React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { Pill } from "components/Pill/Pill";
import DownloadPdfOverlay from "components/React/DownloadPdfOverlay/DownloadPdfOverlay";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { FunctionComponent, useState } from "react";
import { connect } from "react-redux";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { FlexContainer } from "pages/conversion/oss/ConversionSegmentOSSStyles";
import {
    EducationIconStyle,
    IconButtonStyled,
    PageTitleStyle,
    TitleStyle,
    TooltipStyle,
} from "./styled";

interface IPageTitleProps {
    bottomLeftComponent?: any;
    currentPage?: any;
    title?: string;
    params?: object;
    pageTitleConfig: any;
    className: string;
    onEducationIconClick?: () => void;
    showEducationIcon?: boolean;
}

const PageTitle: FunctionComponent<IPageTitleProps> = (props) => {
    const {
        pageTitle,
        pageSubtitle,
        isPdfDownloadButton,
        orangeBadgeTitle,
        GreenBadgeTitleComponent,
        pinkBadgeTitle,
        pdfDownloadsMethod,
    } = props.pageTitleConfig;
    const { showEducationIcon, onEducationIconClick } = props;
    const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);

    const onEducationClick = () => {
        TrackWithGuidService.trackWithGuid("page.title.education.icon.click", "click");
        onEducationIconClick();
    };

    const onClickDownloadPdf = async () => {
        setIsPdfLoading(true);
        allTrackers.trackEvent("Download", "submit-ok", "pdf");
        try {
            await pdfDownloadsMethod();
        } finally {
            setIsPdfLoading(false);
        }
    };

    return (
        <PageTitleStyle className={props.className}>
            <span className="u-flex-row u-flex-center">
                <TitleStyle>{pageTitle}</TitleStyle>
                {pageSubtitle && (
                    <TooltipStyle>
                        <PlainTooltip tooltipContent={pageSubtitle}>
                            <div>
                                <SWReactIcons iconName="info" size="xs" />
                            </div>
                        </PlainTooltip>
                    </TooltipStyle>
                )}
                {orangeBadgeTitle && (
                    <Pill text={orangeBadgeTitle} backgroundColor={colorsPalettes.orange[400]} />
                )}
                {pinkBadgeTitle && (
                    <Pill text={pinkBadgeTitle} backgroundColor={colorsPalettes.mint[400]} />
                )}
                {GreenBadgeTitleComponent && <GreenBadgeTitleComponent />}
            </span>
            <FlexContainer>
                {isPdfDownloadButton && (
                    <IconButton
                        isDisabled={isPdfLoading}
                        onClick={onClickDownloadPdf}
                        iconName="download"
                        type="flat"
                    >
                        {i18nFilter()("btn.download.pdf")}
                    </IconButton>
                )}
                {showEducationIcon && (
                    <PlainTooltip
                        tooltipContent={i18nFilter()("page.title.education.icon.tooltip")}
                    >
                        <EducationIconStyle onClick={onEducationClick}>
                            <IconButtonStyled
                                onClick={onEducationClick}
                                type="flat"
                                iconName="help_outline"
                                iconSize="sm"
                            />
                        </EducationIconStyle>
                    </PlainTooltip>
                )}
            </FlexContainer>
            <DownloadPdfOverlay isDownloading={isPdfLoading} />
        </PageTitleStyle>
    );
};

function mapStateToProps({ routing: { params, pageTitleConfig } }) {
    return {
        params,
        pageTitleConfig,
    };
}

const connected = connect(mapStateToProps)(PageTitle);
SWReactRootComponent(connected, "PageTitle");
export default connected;
