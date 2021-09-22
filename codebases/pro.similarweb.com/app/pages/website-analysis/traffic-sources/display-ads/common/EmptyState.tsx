import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { i18nFilter } from "filters/ngFilters";
import {
    FlexContainerCentered,
    PrimaryText,
    SecondaryText,
} from "pages/conversion/oss/ConversionSegmentOSSStyles";
import styled from "styled-components";
import { NoDataLandscape } from "components/NoData/src/NoData";
import { CenteredFlexColumn } from "styled components/StyledFlex/src/StyledFlex";

const ErrorComponentContainer = styled(CenteredFlexColumn)`
    height: 393px;
    margin: 0 auto;
    text-align: center;
    width: 350px;
    ${SecondaryText} {
        opacity: 0.6;
        color: ${colorsPalettes.carbon["500"]};
        font-weight: 400;
        margin-top: 8px;
    }
    ${PrimaryText} {
        opacity: 0.6;
        color: ${colorsPalettes.carbon["500"]};
        font-weight: 500;
    }
`;

const NoDataLandscapeWrapper = styled.div`
    margin-top: 70px;
`;

export const NoDataState = () => {
    return (
        <NoDataLandscapeWrapper>
            <NoDataLandscape
                title={"traffic.sources.creatives.gallery.no.data.title"}
                subtitle={"traffic.sources.creatives.gallery.no.data.sub.title"}
            />
        </NoDataLandscapeWrapper>
    );
};

export const EmptyState = () => {
    const primaryText = i18nFilter()("traffic.sources.creatives.error.load.primary");
    const secondaryText = i18nFilter()("traffic.sources.creatives.error.load.secondary");
    const icon = "empty-state-telescope";
    return (
        <ErrorComponentContainer>
            <FlexContainerCentered>
                <SWReactIcons iconName={icon} />
            </FlexContainerCentered>
            <PrimaryText>{i18nFilter()(primaryText)}</PrimaryText>
            {secondaryText && <SecondaryText>{i18nFilter()(secondaryText)}</SecondaryText>}
        </ErrorComponentContainer>
    );
};
