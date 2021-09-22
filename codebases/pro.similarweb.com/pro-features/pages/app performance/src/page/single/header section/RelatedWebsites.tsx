import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import * as PropTypes from "prop-types";
import * as React from "react";
import WithTrack from "../../../../../../components/WithTrack/src/WithTrack";
import WithTranslation from "../../../../../../components/WithTranslation/src/WithTranslation";
import { Type } from "../../StyledComponents";
import {
    RelatedWebsitesContainer,
    RelatedWebsitesRow,
    RelatedWebsitesTitle,
    WebsiteIcon,
} from "./StyledComponents";

const RelatedWebsites: any = ({ relatedWebsites = {}, websiteTooltipComponent }) => (
    <WithTranslation>
        {(translate) => (
            <WithTrack>
                {(track) => {
                    const show = Object.keys(relatedWebsites).length;
                    const WebsiteTooltip = websiteTooltipComponent;
                    return (
                        <RelatedWebsitesContainer>
                            {show ? (
                                <RelatedWebsitesTitle key="title">
                                    {translate("app.performance.header.related")}
                                </RelatedWebsitesTitle>
                            ) : null}
                            {show ? (
                                <RelatedWebsitesRow key="items">
                                    {(Object as any).entries(relatedWebsites).map((site, idx) => (
                                        <a href={site[1].href} key={idx}>
                                            {WebsiteTooltip ? (
                                                <WebsiteTooltip domain={site[0]} placement="bottom">
                                                    <span
                                                        onClick={() =>
                                                            track(
                                                                "internal link",
                                                                "click",
                                                                `related websites/website performance overview/${site[0]}`,
                                                            )
                                                        }
                                                    >
                                                        <WebsiteIcon
                                                            iconType={Type.Website}
                                                            iconName={site[0]}
                                                            iconSrc={site[1].icon}
                                                        />
                                                    </span>
                                                </WebsiteTooltip>
                                            ) : (
                                                <PlainTooltip
                                                    tooltipContent={site[0]}
                                                    placement="bottom"
                                                >
                                                    <span
                                                        onClick={() =>
                                                            track(
                                                                "internal link",
                                                                "click",
                                                                `related websites/website performance overview/${site[0]}`,
                                                            )
                                                        }
                                                    >
                                                        <WebsiteIcon
                                                            iconType={Type.Website}
                                                            iconName={site[0]}
                                                            iconSrc={site[1].icon}
                                                        />
                                                    </span>
                                                </PlainTooltip>
                                            )}
                                        </a>
                                    ))}
                                </RelatedWebsitesRow>
                            ) : null}
                        </RelatedWebsitesContainer>
                    );
                }}
            </WithTrack>
        )}
    </WithTranslation>
);

RelatedWebsites.propTypes = {
    relatedWebsites: PropTypes.object,
    translate: PropTypes.func,
};

RelatedWebsites.displayName = "RelatedWebsites";
export default RelatedWebsites;
