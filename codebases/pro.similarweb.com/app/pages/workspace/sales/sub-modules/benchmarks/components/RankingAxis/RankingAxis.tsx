import React from "react";
import {
    StyledAxis,
    StyledRankingAxisContainer,
    StyledLeftTick,
    StyledRightTick,
    StyledAxisWebsite,
    StyledLeftTickValue,
    StyledRightTickValue,
    StyledAxisMainWebsite,
    StyledAxisWebsiteIcon,
    StyledWebsitesContainer,
} from "./styles";
import { AxisWebsiteType, WebsitesAxisConfigType } from "../../types/chart";
import RankingAxisTooltip from "../RankingAxisTooltip/RankingAxisTooltip";

type RankingAxisProps = {
    isActive: boolean;
    config: WebsitesAxisConfigType;
};

const RankingAxis = (props: RankingAxisProps) => {
    const {
        isActive,
        config: { websites, maxTick, minTick },
    } = props;

    const renderWebsite = (website: AxisWebsiteType, index: number) => {
        const { domain, favicon, position } = website;

        if (website.isMain) {
            return (
                <RankingAxisTooltip website={website} key={website.domain}>
                    <StyledAxisMainWebsite
                        left={position}
                        isActive={isActive}
                        isFirst={index === 0}
                        isLast={index === websites.length - 1}
                    >
                        <StyledAxisWebsiteIcon src={favicon} alt={domain} />
                    </StyledAxisMainWebsite>
                </RankingAxisTooltip>
            );
        }

        return (
            <RankingAxisTooltip website={website} key={website.domain}>
                <StyledAxisWebsite left={position} isActive={isActive}>
                    <StyledAxisWebsiteIcon src={favicon} alt={domain} />
                </StyledAxisWebsite>
            </RankingAxisTooltip>
        );
    };

    return (
        <StyledRankingAxisContainer>
            <StyledAxis>
                <StyledLeftTick />
                <StyledRightTick />
                <StyledLeftTickValue>
                    <span>{minTick}</span>
                </StyledLeftTickValue>
                <StyledRightTickValue>
                    <span>{maxTick}</span>
                </StyledRightTickValue>
                <StyledWebsitesContainer isActive={isActive}>
                    {websites.map(renderWebsite)}
                </StyledWebsitesContainer>
            </StyledAxis>
        </StyledRankingAxisContainer>
    );
};

export default RankingAxis;
