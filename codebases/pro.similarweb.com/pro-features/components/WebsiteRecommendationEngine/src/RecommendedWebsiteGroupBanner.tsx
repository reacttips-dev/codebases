import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import * as PropTypes from "prop-types";
import { FunctionComponent } from "react";
import * as React from "react";
import styled from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { WebsiteTooltipContent } from "components/React/Tooltip/WebsiteTooltip/WebsiteTooltipContent";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";

const Container = styled.div<{ padding: string }>(
    ({ padding }) => `
    display: flex;
    align-items: center;
    padding: ${padding};
    height: 48px;
    ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
    justify-content: space-between;
    background-color: ${colorsPalettes.blue[100]};
    flex-shrink: 0;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`,
);

const Title = styled.div`
    ${mixins.setFont({ $weight: 500 })};
    margin-right: 4px;
`;

const Text = styled.div`
    margin-left: 8px;
    ${mixins.setFont({ $color: rgba(colorsPalettes.carbon[500], 0.8) })};
`;

const Link = styled.a`
    text-decoration: none;
    color: ${colorsPalettes.blue[400]};
    margin-left: 4px;
`;

const Left = styled.div`
    display: flex;
    align-items: center;
`;

interface IRecommendedWebsiteGroupBanner {
    onCloseClick: VoidFunction;
    learnMoreLink?: string;
    title: string;
    text: string;
    infoText?: string;
    displayShowMore?: boolean;
    containerPadding?: string;
}

export const RecommendedWebsiteGroupBanner: FunctionComponent<IRecommendedWebsiteGroupBanner> = (
    { text, infoText, learnMoreLink, onCloseClick, title, displayShowMore, containerPadding },
    { translate },
) => {
    return (
        <Container padding={containerPadding}>
            <Left>
                <Title>{title}</Title>
                {displayShowMore && (
                    <PopupHoverContainer
                        content={() => (
                            <span>
                                {infoText}
                                <Link href={learnMoreLink} target="_blank">
                                    {translate(
                                        "workspaces.marketing.websitegroup.recommendation.banner.learn.more",
                                    )}
                                </Link>
                            </span>
                        )}
                        config={{ placement: "top", width: 250, allowHover: true }}
                    >
                        <div>
                            <SWReactIcons iconName="info" size="xs" />
                        </div>
                    </PopupHoverContainer>
                )}
                <Text>{text}</Text>
            </Left>
            <div>
                <IconButton iconName="clear" iconSize="xs" type="flat" onClick={onCloseClick} />
            </div>
        </Container>
    );
};
RecommendedWebsiteGroupBanner.defaultProps = {
    displayShowMore: true,
    containerPadding: "0px 36px 0px 24px",
};

RecommendedWebsiteGroupBanner.contextTypes = {
    translate: PropTypes.func,
};
