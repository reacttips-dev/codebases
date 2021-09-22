import * as React from "react";
import * as PropTypes from "prop-types";
import { StatelessComponent } from "react";
import {
    DashboardLinkContainer,
    DashboardLinkCreated,
    DashboardLinkIcon,
    DashboardLinkStyled,
    DashboardLinkTitle,
} from "../../../../styled components/Workspace/src/StyledDashboardLink";

export interface IDashboardLinkProps {
    title: string;
    created: string;
    lastUpdated?: string;
    link: string;
    className?: string;
    onClick?: () => void;
}

export const DashboardLink: StatelessComponent<IDashboardLinkProps> = ({
    title,
    created,
    link,
    className,
    onClick,
    lastUpdated,
}) => {
    return (
        <DashboardLinkStyled
            className={className}
            data-automation-dashboard-link="exists"
            href={link}
            onClick={onClick}
        >
            <DashboardLinkContainer active={false}>
                <DashboardLinkTitle>{title}</DashboardLinkTitle>
                {lastUpdated && <DashboardLinkCreated>{lastUpdated}</DashboardLinkCreated>}
                {/*<DashboardLinkCreated>{created}</DashboardLinkCreated>*/}
                <DashboardLinkIcon iconName="arrow-right" size="sm" />
            </DashboardLinkContainer>
        </DashboardLinkStyled>
    );
};
DashboardLink.displayName = "DashboardLink";
DashboardLink.propTypes = {
    title: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    lastUpdated: PropTypes.string,
};

DashboardLink.defaultProps = {
    className: "",
};
