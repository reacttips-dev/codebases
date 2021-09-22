import React from "react";
import FiltersTitleWithToggleContainer from "./FiltersTitleWithToggleContainer";
import { StyledTitle, StyledSubTitle } from "pages/lead-generator/components/Title/styles";
import { FiltersBoxCollapseToggle } from "pages/lead-generator/components/CollapseToggleArrow/styles";

type FiltersBoxHeaderProps = {
    title: string;
    subtitle: string;
    collapsed: boolean;
    disabled?: boolean;
    className?: string;
    isDesktopOnly?: boolean;
    onCollapseClick(): void;
};

const FiltersBoxHeader: React.FC<FiltersBoxHeaderProps> = ({
    title,
    subtitle,
    disabled,
    collapsed,
    onCollapseClick,
    isDesktopOnly,
    className = null,
}) => {
    return (
        <div className={className} onClick={onCollapseClick}>
            <FiltersTitleWithToggleContainer>
                <StyledTitle text={title} iconName={isDesktopOnly ? "desktop" : undefined} />
                <FiltersBoxCollapseToggle
                    disabled={disabled}
                    collapsed={collapsed}
                    onClick={onCollapseClick}
                    dataAutomation="lead-generator-box-toggle"
                />
            </FiltersTitleWithToggleContainer>
            <StyledSubTitle text={subtitle} />
        </div>
    );
};

export default FiltersBoxHeader;
