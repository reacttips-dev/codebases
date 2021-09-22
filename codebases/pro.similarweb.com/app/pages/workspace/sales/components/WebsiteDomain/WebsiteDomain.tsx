import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import * as s from "./styles";

type WebsiteDomainProps = {
    domain: string;
    favicon: string;
    faviconSize?: "md" | "sm";
    className?: string;
    closable?: boolean;
    clickable?: boolean;
    badgeColor?: string;
    onClick?(): void;
    onClose?(): void;
};

const WebsiteDomain: React.FC<WebsiteDomainProps> = (props) => {
    const {
        domain,
        favicon,
        onClick,
        onClose,
        badgeColor,
        closable = false,
        clickable = false,
        className = null,
        faviconSize = "md",
    } = props;
    const [closeIconHovered, setCloseIconHovered] = React.useState(false);
    const handleCloseClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        onClose();
    };

    return (
        <s.StyledWebsiteDomainContainer
            onClick={onClick}
            onClose={onClose}
            closable={closable}
            clickable={clickable}
            className={className}
            closeIconHovered={closeIconHovered}
        >
            <s.StyledIconContainer faviconSize={faviconSize}>
                <img src={favicon} alt={domain} />
                {clickable && (
                    <s.StyledEditIcon>
                        <SWReactIcons size="xs" iconName="edit-icon" />
                    </s.StyledEditIcon>
                )}
                {badgeColor && <s.StyledColorBadge color={badgeColor} />}
            </s.StyledIconContainer>
            <s.StyledDomainText>{domain}</s.StyledDomainText>
            {onClose && closable && (
                <s.StyledCloseIconContainer
                    onClick={handleCloseClick}
                    onMouseEnter={() => setCloseIconHovered(true)}
                    onMouseLeave={() => setCloseIconHovered(false)}
                >
                    <SWReactIcons size="xs" iconName="clear-circle" />
                </s.StyledCloseIconContainer>
            )}
        </s.StyledWebsiteDomainContainer>
    );
};

export default React.memo(WebsiteDomain);
