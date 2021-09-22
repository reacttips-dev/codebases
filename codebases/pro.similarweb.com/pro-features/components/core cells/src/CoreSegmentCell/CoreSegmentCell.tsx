import { SWReactIcons } from "@similarweb/icons";
import { Type } from "@similarweb/ui-components/dist/item-icon";
import GAVerifiedContainer from "components/React/GAVerifiedIcon/GAVerifiedContainer";
import { UpgradeLink } from "components/React/Table/cells";
import { SegmentTooltip } from "components/React/Tooltip/SegmentTooltip/SegmentTooltip";
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
} from "./StyledComponents";

export const CoreSegmentCell: any = ({
    segmentName,
    isOrgSegment,
    segmentId,
    lastModified,
    domain,
    onClick,
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
}) => {
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
                <SegmentTooltip
                    domain={domain}
                    segmentName={segmentName}
                    segmentId={segmentId}
                    isOrgSegment={isOrgSegment}
                    dateModified={lastModified}
                    onClick={onClick}
                >
                    <Link target={target} href={internalLink} onClick={trackInternalLink}>
                        <TextContainer marginLeft={textAndIconMargin}>{domain}</TextContainer>
                    </Link>
                </SegmentTooltip>
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

CoreSegmentCell.defaultProps = {
    subtitleFilters: undefined,
    trackInternalLink: _.noop,
    trackExternalLink: _.noop,
    target: "_self",
    textAndIconMargin: "15px",
};
