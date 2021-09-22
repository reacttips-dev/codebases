import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { useTranslation } from "components/WithTranslation/src/I18n";
import useHomePageTrackingService from "../../../../hooks/useHomePageTrackingService";
import PrimaryHomepageItem from "@similarweb/ui-components/dist/homepages/primary/src/PrimaryHomepageItem";
import { WithSWNavigatorProps } from "../../../../hoc/withSWNavigator";
import { StyledSectionTitleContainer, StyledSectionTitle } from "./styles";
import { getHomeLinks } from "./links";

const HomeLinksSection: React.FC<WithSWNavigatorProps> = ({ navigator }) => {
    const translate = useTranslation();
    const trackingService = useHomePageTrackingService();
    const links = getHomeLinks(navigator, trackingService);

    const renderLinkIcon = (name: string) => () => <SWReactIcons iconName={name} size="md" />;

    return (
        <div>
            <StyledSectionTitleContainer>
                <StyledSectionTitle>{translate("si.apps.home.section_title")}</StyledSectionTitle>
            </StyledSectionTitleContainer>
            {links.map((link) => (
                <PrimaryHomepageItem
                    key={link.name}
                    onClick={link.onClick}
                    buttonIconName="arrow-right"
                    primaryText={translate(link.primaryText)}
                    renderImage={renderLinkIcon(link.iconName)}
                    secondaryText={translate(link.secondaryText)}
                />
            ))}
        </div>
    );
};

export default HomeLinksSection;
