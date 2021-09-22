import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { useTranslation } from "components/WithTranslation/src/I18n";
import useFindLeadsTrackingService from "../../../../hooks/useFindLeadsTrackingService";
import PrimaryHomepageItem from "@similarweb/ui-components/dist/homepages/primary/src/PrimaryHomepageItem";
import { WithSWNavigatorProps } from "../../../../hoc/withSWNavigator";
import { getFindLeadsPageLinks } from "../../links";

const FindLeadsPageContent: React.FC<WithSWNavigatorProps> = (props) => {
    const translate = useTranslation();
    const trackingService = useFindLeadsTrackingService();
    const links = getFindLeadsPageLinks(props.navigator, trackingService);

    const renderLinkIcon = (name: string) => () => {
        return <SWReactIcons iconName={name} size="md" />;
    };

    return (
        <div>
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

export default FindLeadsPageContent;
