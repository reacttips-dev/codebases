import { Button } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import BoxSubtitle from "../../../../../../components/BoxSubtitle/src/BoxSubtitle";
import BoxTitle from "../../../../../../components/BoxTitle/src/BoxTitle";
import WithTranslation from "../../../../../../components/WithTranslation/src/WithTranslation";
import StyledBoxSubtitle from "../../../../../../styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { StyledHeader, StyledHeaderTitle } from "../../StyledComponents";
import { CompareLink, HeaderWithLinkContainer } from "./StyledComponents";

const HeaderWithLink: any = ({ title, tooltip, subtitleFilters, href, onTrack }) => (
    <WithTranslation>
        {(translate) => {
            return (
                <HeaderWithLinkContainer data-automation-link-container={title}>
                    <StyledHeader>
                        <StyledHeaderTitle>
                            <BoxTitle tooltip={tooltip}>{title}</BoxTitle>
                        </StyledHeaderTitle>
                        <StyledBoxSubtitle>
                            <BoxSubtitle filters={subtitleFilters} />
                        </StyledBoxSubtitle>
                    </StyledHeader>
                    <CompareLink href={href}>
                        <Button type="flat" onClick={onTrack}>
                            {translate("app.performance.compare.link")}
                        </Button>
                    </CompareLink>
                </HeaderWithLinkContainer>
            );
        }}
    </WithTranslation>
);
HeaderWithLink.displayName = "HeaderWithLink";
export default HeaderWithLink;
