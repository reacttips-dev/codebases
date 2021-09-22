import { SWReactCountryIcons, SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { StyledBox } from "Arena/StyledComponents";
import { commonWebSources } from "components/filters-bar/utils";
import { IconContainer } from "components/React/PopularPagesFilters/PopularPagesFilters";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { i18nFilter } from "filters/ngFilters";
import { sfConvertPageContext } from "pages/website-analysis/sfconvert/SfConvertPage";
import React, { useContext } from "react";
import DurationService from "services/DurationService";
import { StyledSecondaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";

export const SfCardWrapperStyle = styled(StyledBox)`
    min-height: initial;
    box-sizing: border-box;
    margin: 12px 0 0 0;
    border: 1px solid #e5e7ea;
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: none;
`;
export const Content = styled.div`
    padding-left: 24px;
    padding-right: 24px;
`;
const CardHeader = styled.div`
    height: 40px;
    padding: 24px 18px 24px;
`;
const Subtitle = styled.div`
    color: ${rgba(colorsPalettes.carbon[500], 0.6)};
    font-size: 12px;
    margin-top: 8px;
    line-height: normal;
    display: flex;
    ${SWReactIcons}, ${SWReactCountryIcons} {
        margin-right: 4px;
    }
    ${FlexRow}${":nth-last-child(n+2)"} {
        margin-right: 16px;
    }
`;

export const Footer = styled.div`
    height: 46px;
    box-sizing: border-box;
    border-top: 1px solid #e5e7ea;
    text-transform: uppercase;
    margin-top: auto;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    padding-right: 8px;
    user-select: none;
    a {
        color: inherit;
    }
`;

const Time = ({ from, to }) => (
    <FlexRow>
        <SWReactIcons size={"xs"} iconName={"daily-ranking"} />
        <span>{from.format("MMM YYYY") + " - " + to.format("MMM YYYY")}</span>
    </FlexRow>
);

const Country = ({ id, text }) => (
    <FlexRow>
        <SWReactCountryIcons countryCode={id} size="xs" />
        <span>{text}</span>
    </FlexRow>
);

const Websource = ({ text, icon }) => (
    <FlexRow>
        <SWReactIcons size={"xs"} iconName={icon} />
        <span>{text}</span>
    </FlexRow>
);

const Title = styled(StyledSecondaryTitle)`
    display: flex;
    align-items: center;
    height: 16px;
    div[data-name="mail"] {
        position: absolute;
        right: 8px;
        button svg path,
        button:hover svg path {
            fill: ${colorsPalettes.blue[400]};
        }
    }
`;

const TitleText = styled.div`
    margin-right: 8px;
`;

export function SfCardWrapper({
    title,
    tooltip,
    duration,
    country,
    webSource,
    footerText,
    footerLink,
    dataAutomation,
    children,
}) {
    const { countryService, webAnalysisComponent } = useContext(sfConvertPageContext);

    function getDuration() {
        const { raw } = DurationService.getDurationData(
            duration,
            null,
            webAnalysisComponent.componentId,
        );
        return raw;
    }
    function getWebsource() {
        return commonWebSources[webSource.toLowerCase()]();
    }
    function getCountry() {
        return countryService.getCountryById(country);
    }
    return (
        <SfCardWrapperStyle data-automation={dataAutomation}>
            <CardHeader>
                <Title>
                    <TitleText>{title}</TitleText>
                    <PlainTooltip text={tooltip}>
                        <IconContainer>
                            <SWReactIcons iconName="info" size="xs" />
                        </IconContainer>
                    </PlainTooltip>
                    <PlainTooltip
                        variation={"white"}
                        text={
                            <>
                                <div>Coming soon!</div>
                                <span>{i18nFilter()("salesforce.cta.send_mail")}</span>
                            </>
                        }
                    >
                        <div data-name="mail">
                            <IconButton placement={"right"} type={"flat"} iconName={"mail"} />
                        </div>
                    </PlainTooltip>
                </Title>
                <Subtitle>
                    {!!duration && <Time {...getDuration()} />}
                    {!!country && <Country {...getCountry()} />}
                    {!!webSource && <Websource {...getWebsource()} />}
                </Subtitle>
            </CardHeader>
            <Content className="sfcard-content">
                <FlexRow>{children}</FlexRow>
            </Content>
            <Footer>
                <IconButton placement={"right"} type={"flat"} iconName={"arrow-right"}>
                    <a href={footerLink} target={"_blank"}>
                        {footerText}
                    </a>
                </IconButton>
            </Footer>
        </SfCardWrapperStyle>
    );
}
