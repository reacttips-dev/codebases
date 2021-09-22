import * as React from "react";
import * as PropTypes from "prop-types";
import { StatelessComponent } from "react";
import {
    DashboardCreateLinkContainer,
    DashboardCreateLinkContent,
    DashboardCreateLinkDescription,
    DashboardCreateLinkIconContainer,
    DashboardCreateLinkTitle,
    DashboardLinkContainer,
    DashboardLinkCreated,
    DashboardLinkDescription,
    DashboardLinkIcon,
    DashboardLinkStyled,
    DashboardLinkTitle,
} from "../../../../styled components/Workspace/src/StyledDashboardLink";
import { SWReactIcons } from "@similarweb/icons";

export interface IDashboardCreateLinkProps {
    id?: string | number;
    title: string;
    description: string;
    onClick: () => void;
    className?: string;
}

export const DashboardCreateLink: StatelessComponent<IDashboardCreateLinkProps> = ({
    title,
    description,
    onClick,
    className,
}) => {
    return (
        <DashboardCreateLinkContainer
            className={className}
            data-automation-dashboard-link="new"
            active={true}
            onClick={onClick}
        >
            <DashboardCreateLinkIconContainer>
                <SWReactIcons iconName="dashboard" size="sm" />
            </DashboardCreateLinkIconContainer>
            <DashboardCreateLinkContent>
                <DashboardCreateLinkTitle>{title}</DashboardCreateLinkTitle>
                <DashboardCreateLinkDescription>{description}</DashboardCreateLinkDescription>
            </DashboardCreateLinkContent>

            <DashboardLinkIcon iconName="arrow-right" size="sm" />
        </DashboardCreateLinkContainer>
    );
};
DashboardCreateLink.displayName = "DashboardCreateLink";
DashboardCreateLink.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string.isRequired,
};
DashboardCreateLink.defaultProps = {
    className: "",
};
