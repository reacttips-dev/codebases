import React from "react";
import * as s from "./styles";
import { SWReactIcons } from "@similarweb/icons";

type BenchmarksEmptyStateProps = {
    title: string;
    iconName?: string;
    subtitle?: string;
    children?: React.ReactNode;
    className?: string;
};

const BenchmarksEmptyState: React.FC<BenchmarksEmptyStateProps> = (props) => {
    const {
        title,
        subtitle,
        iconName = "empty-state-workspace",
        children,
        className = null,
    } = props;

    return (
        <s.StyledEmptyStateContainer className={className}>
            <SWReactIcons iconName={iconName} />
            <s.StyledEmptyStateTitle>
                <span>{title}</span>
            </s.StyledEmptyStateTitle>
            {subtitle && (
                <s.StyledEmptyStateSubtitle>
                    <span>{subtitle}</span>
                </s.StyledEmptyStateSubtitle>
            )}
            {children}
        </s.StyledEmptyStateContainer>
    );
};

export default React.memo(BenchmarksEmptyState);
