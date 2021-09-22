import React from "react";
import classNames from "classnames";
import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import Collapsible from "../../../../../common-components/collapsible/Collapsible/Collapsible";
import {
    StyledGroupHead,
    StyledGroupName,
    StyledContentWrap,
    StyledGroupNameWrap,
    StyledInfoContainer,
    StyledIconContainer,
    StyledGroupHeadInner,
    StyledValueIndication,
    StyledDisabledOverlay,
    StyledFiltersGroupContainer,
} from "./styles";

export type FiltersGroupProps = {
    name: string;
    hasValue: boolean;
    tooltipText: string;
    isExpanded?: boolean;
    disabledReason?: string;
    isCollapsible?: boolean;
    renderContent(): React.ReactNode;
    onExpandToggle?(): void;
};

const FiltersGroup = (props: FiltersGroupProps) => {
    const {
        name,
        hasValue,
        tooltipText,
        renderContent,
        onExpandToggle,
        isExpanded = false,
        isCollapsible = true,
        disabledReason = "",
    } = props;

    const handleToggle = () => {
        if (disabledReason || !isCollapsible || !onExpandToggle) return;

        onExpandToggle();
    };

    const renderCollapsibleContent = () => {
        if (isCollapsible) {
            return (
                <Collapsible isActive={isExpanded}>
                    <StyledContentWrap>{renderContent()}</StyledContentWrap>
                </Collapsible>
            );
        }

        return <StyledContentWrap>{renderContent()}</StyledContentWrap>;
    };

    return (
        <StyledFiltersGroupContainer expanded={isExpanded}>
            <StyledGroupHead expanded={isExpanded} isCollapsible={isCollapsible}>
                <StyledGroupHeadInner onClick={handleToggle} canBeHovered={isCollapsible}>
                    {disabledReason && (
                        <PlainTooltip tooltipContent={disabledReason} maxWidth={200}>
                            <StyledDisabledOverlay />
                        </PlainTooltip>
                    )}
                    {isCollapsible && (
                        <StyledIconContainer>
                            <SWReactIcons iconName={isExpanded ? "minus" : "add"} size="sm" />
                        </StyledIconContainer>
                    )}
                    <StyledGroupNameWrap>
                        <StyledGroupName>{name}</StyledGroupName>
                        <StyledInfoContainer
                            className={classNames({ visible: isExpanded || !isCollapsible })}
                        >
                            <PlainTooltip tooltipContent={tooltipText} maxWidth={200}>
                                <div>
                                    <SWReactIcons iconName="info" size="xs" />
                                </div>
                            </PlainTooltip>
                        </StyledInfoContainer>
                        {hasValue && !isExpanded && <StyledValueIndication />}
                    </StyledGroupNameWrap>
                </StyledGroupHeadInner>
            </StyledGroupHead>
            {renderCollapsibleContent()}
        </StyledFiltersGroupContainer>
    );
};

export default FiltersGroup;
