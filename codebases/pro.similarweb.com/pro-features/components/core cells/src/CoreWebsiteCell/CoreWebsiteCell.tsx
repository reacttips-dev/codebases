import { SWReactIcons } from "@similarweb/icons";
import { Type } from "@similarweb/ui-components/dist/item-icon";
import GAVerifiedContainer from "components/React/GAVerifiedIcon/GAVerifiedContainer";
import { UpgradeLink } from "components/React/Table/cells";
import { WebsiteTooltip } from "components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import * as _ from "lodash";
import * as React from "react";
import BoxSubtitle from "../../../BoxSubtitle/src/BoxSubtitle";
import { StyledItemIcon } from "../CoreRecentCell/StyledComponents";
import {
    Container,
    ContentContainer,
    ExternalLink,
    GAIconContainer,
    InnerLinkContainer,
    Link,
    Subtitle,
    TextContainer,
    SegmentTypeBadgeHorizontal,
} from "./StyledComponents";

export const CoreWebsiteCell: any = ({
    domain,
    icon,
    subtitleFilters,
    internalLink,
    externalLink,
    trackInternalLink,
    trackExternalLink,
    hideTrackButton,
    target,
    className,
    showGaIcon,
    isGaPrivate,
    tableOptions,
    textAndIconMargin,
    showToolTip,
    domainBadge,
}) => {
    const showWebsiteToolTip = showToolTip === false ? showToolTip : true;
    const isDisabled = domain === "grid.upgrade";
    let content;

    // Show an upgrade link in place of the cell

    if (isDisabled) {
        content = (
            <InnerLinkContainer alignItems="center">
                <UpgradeLink />
            </InnerLinkContainer>
        );
    } else {
        content = (
            <InnerLinkContainer alignItems="center">
                {showWebsiteToolTip ? (
                    <WebsiteTooltip domain={domain} hideTrackButton={hideTrackButton}>
                        <Link target={target} href={internalLink} onClick={trackInternalLink}>
                            <TextContainer marginLeft={textAndIconMargin}>{domain}</TextContainer>
                        </Link>
                    </WebsiteTooltip>
                ) : (
                    <TextContainer marginLeft={textAndIconMargin}>{domain}</TextContainer>
                )}
                {domainBadge && (
                    <SegmentTypeBadgeHorizontal>{domainBadge}</SegmentTypeBadgeHorizontal>
                )}
                {showGaIcon && (
                    <GAIconContainer>
                        <GAVerifiedContainer
                            isActive={true}
                            isPrivate={isGaPrivate}
                            metric="visits"
                            tooltipIsActive={false}
                            tooltipAvailable={true}
                            size="SMALL"
                        />
                    </GAIconContainer>
                )}
                {externalLink && (
                    <ExternalLink
                        className={"link-out"}
                        href={externalLink}
                        target="_blank"
                        onClick={trackExternalLink}
                    >
                        <SWReactIcons iconName="link-out" />
                    </ExternalLink>
                )}
            </InnerLinkContainer>
        );
    }

    return (
        <Container className={className}>
            {!isDisabled && <StyledItemIcon iconType={Type.Website} iconName="" iconSrc={icon} />}

            <ContentContainer>
                {content}
                {subtitleFilters ? (
                    <Subtitle>
                        <BoxSubtitle filters={subtitleFilters} />
                    </Subtitle>
                ) : null}
            </ContentContainer>
        </Container>
    );
};

CoreWebsiteCell.defaultProps = {
    subtitleFilters: undefined,
    trackInternalLink: _.noop,
    trackExternalLink: _.noop,
    target: "_self",
    textAndIconMargin: "15px",
};
