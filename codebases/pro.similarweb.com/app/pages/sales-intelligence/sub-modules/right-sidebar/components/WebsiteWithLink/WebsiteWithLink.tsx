import React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { ItemIcon } from "@similarweb/ui-components/dist/item-icon";
import { Type } from "pages/app performance/src/page/StyledComponents";
import { StyledWebSite, StyledWebSiteLink, StyledDomainContainer } from "./styles";
import { BaseWebsiteType } from "pages/workspace/sales/sub-modules/benchmarks/types/common";

type WebsiteProps = {
    website: BaseWebsiteType;
};

const WebsiteWithLink = (props: WebsiteProps) => {
    const { domain, favicon } = props.website;

    return (
        <StyledWebSite>
            <ItemIcon iconType={Type.Website} iconSrc={favicon} />
            <StyledDomainContainer>
                <span>{domain}</span>
            </StyledDomainContainer>
            <StyledWebSiteLink
                target="_blank"
                rel="noreferrer"
                href={`https://${domain}`}
                data-automation="website-header-link-out"
            >
                <IconButton type="flat" iconName="link-out" iconSize="xs" />
            </StyledWebSiteLink>
        </StyledWebSite>
    );
};

export default WebsiteWithLink;
