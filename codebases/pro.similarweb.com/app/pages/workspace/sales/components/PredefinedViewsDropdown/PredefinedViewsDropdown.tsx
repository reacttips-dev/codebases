import React, { ComponentType, useMemo } from "react";
import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import * as classNames from "classnames";

import { Dropdown } from "@similarweb/ui-components/dist/dropdown";
import { TextWrapper } from "@similarweb/ui-components/dist/dropdown/src/buttons/NoBorderButton";

import { useTranslation } from "components/WithTranslation/src/I18n";
import predefinedViews from "pages/workspace/sales/SalesTableContainer/predefinedViews";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { ReactIconButton } from "components/React/ReactIconButton/ReactIconButton";
import {
    StyledPredefinedViewsButton,
    CustomMetricsButtonContent,
    StyledPredefinedViewsItem,
} from "../SalesTableHeader/Styled";

interface Props {
    options?: string[];
    onChange: (any) => void;
    selectedViewId: string;
    height?: number | string;
    width?: number | string;
    disabled?: boolean;
    onToggle?: (isOpen: boolean) => void;
    appendTo?: string;
    dropdownPopupPlacement?: string;
    dropdownPopupWidth?: number | string;
    cssClassContainer?: string;
    itemWrapper?: ComponentType<any>;
    openColumnPicker: () => void;
    hasCustomView: boolean;
    metricsCount: Record<string, number>;
}

const optionsKey = "workspaces.sales.predefinedViews.options";

const Title = styled.div`
    flex: 1;
`;

const StyledFlexRow = styled(FlexRow)`
    align-items: center;
`;

const PredefinedViewsDropdown = ({
    disabled = false,
    width = 215,
    height = 70,
    options,
    cssClassContainer = "",
    selectedViewId,
    onToggle = () => null,
    onChange,
    openColumnPicker,
    hasCustomView,
    metricsCount,
    dropdownPopupPlacement = "ontop-right",
}: Props) => {
    const t = useTranslation();
    const customViewId = predefinedViews.PREDEFINED_VIEW_IDS.CUSTOM;
    const translatedValue = React.useMemo(() => {
        return t(`${optionsKey}.${selectedViewId}`, {
            metrics: metricsCount[selectedViewId],
        });
    }, [t, metricsCount, selectedViewId]);

    const content = useMemo(
        () => [
            <StyledPredefinedViewsButton disabled={disabled} key="selected">
                <TextWrapper disabled={disabled}>{getButtonContent()}</TextWrapper>
                <SWReactIcons iconName="arrow" />
            </StyledPredefinedViewsButton>,
            ...options.map((option) => (
                <StyledPredefinedViewsItem id={option} key={option}>
                    {t(`${optionsKey}.${option}`)}
                </StyledPredefinedViewsItem>
            )),
            <StyledPredefinedViewsItem id={customViewId} key={customViewId}>
                <StyledFlexRow>
                    <Title>
                        {t(`${optionsKey}.${customViewId}`, {
                            metrics: metricsCount[customViewId],
                        })}
                    </Title>
                </StyledFlexRow>
            </StyledPredefinedViewsItem>,
        ],
        [disabled, options, selectedViewId, hasCustomView, metricsCount[customViewId]],
    );

    function getButtonContent(): React.ReactNode {
        if (!(hasCustomView && selectedViewId === customViewId)) {
            return translatedValue;
        }

        return (
            <CustomMetricsButtonContent alignItems="center">
                <span>{translatedValue}</span>
                <ReactIconButton
                    iconName="settings"
                    size="xs"
                    width={30}
                    height={30}
                    onClick={(e) => {
                        e.stopPropagation();
                        openColumnPicker();
                    }}
                />
            </CustomMetricsButtonContent>
        );
    }

    return (
        <Dropdown
            cssClassContainer={classNames(
                "DropdownContent-container",
                "FiltersBarDropdown",
                cssClassContainer,
            )}
            disabled={disabled}
            width={width}
            height={height}
            onClick={onChange}
            onToggle={onToggle}
            selectedIds={{ [selectedViewId]: true }}
            dropdownPopupPlacement={dropdownPopupPlacement}
        >
            {content}
        </Dropdown>
    );
};

export default PredefinedViewsDropdown;
