import React, { FC, useCallback, useMemo } from "react";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import {
    WidgetListItemContainer,
    WidgetListItemTextContainer,
    WidgetListItemTitle,
    WidgetListItemSubtitle,
    ItemErrorIconContainer,
} from "./DashboardPptExportListStyles";
import { IDashboardPptExportListItemProps } from "./DashboardPptExportListTypes";
import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { i18nFilter } from "filters/ngFilters";

export const DashboardPptExportListItem: FC<IDashboardPptExportListItemProps> = (props) => {
    const { item, onToggle } = props;

    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
        };
    }, []);

    const handleCheckboxClick = useCallback(() => {
        onToggle(item);
    }, [item, onToggle]);

    const renderCheckbox = () => {
        if (item.isDisabled) {
            return (
                <PlainTooltip
                    tooltipContent={services.translate("dashboard.export.modal.item.disabled")}
                    placement="left"
                    appendTo=".ppt-export-modal"
                >
                    <ItemErrorIconContainer>
                        <SWReactIcons iconName="alert-circle" size="sm" />
                    </ItemErrorIconContainer>
                </PlainTooltip>
            );
        }

        return (
            <Checkbox
                label={""}
                onClick={handleCheckboxClick}
                selected={item.isSelected}
                isDisabled={false}
            />
        );
    };

    return (
        <WidgetListItemContainer>
            {renderCheckbox()}
            <WidgetListItemTextContainer>
                <WidgetListItemTitle isDisabled={item.isDisabled}>
                    {item.viewData.title}
                </WidgetListItemTitle>
                <WidgetListItemSubtitle isDisabled={item.isDisabled}>
                    {item.viewData.subtitle}
                </WidgetListItemSubtitle>
            </WidgetListItemTextContainer>
        </WidgetListItemContainer>
    );
};
