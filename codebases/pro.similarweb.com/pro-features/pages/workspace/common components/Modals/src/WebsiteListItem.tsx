import { IconButton } from "@similarweb/ui-components/dist/button";
import { SimpleLegend } from "@similarweb/ui-components/dist/simple-legend";
import * as React from "react";
import { StatelessComponent } from "react";
import { ItemContainer } from "./StyledComponents";

interface IWebsiteListItemProps {
    icon?: string;
    domain?: string;
    onClick?: (name) => void;
}

export const WebsiteListItem: StatelessComponent<IWebsiteListItemProps> = ({
    icon,
    domain,
    onClick,
}) => {
    return (
        <ItemContainer>
            <SimpleLegend items={[{ icon, name: domain }]} />
            {onClick && (
                <IconButton
                    iconSize={"xs"}
                    iconName="clear"
                    type="flat"
                    onClick={() => onClick(domain)}
                />
            )}
        </ItemContainer>
    );
};

WebsiteListItem.displayName = "WebsiteListItem";
