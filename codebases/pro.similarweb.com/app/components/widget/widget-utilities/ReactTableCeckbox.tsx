import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import React, { FunctionComponent } from "react";
import { TableWidget } from "components/widget/widget-types/TableWidget";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";

const StyledCheckbox = styled(Checkbox)`
    margin-left: 8px;
`;

export const ReactTableCheckbox: FunctionComponent<{ widget: TableWidget; utility: any }> = (
    props,
) => {
    const {
        widget,
        utility: {
            properties: { label, param, onChange, tooltip, tracking, trackingAction, name = "" },
        },
    } = props;
    const selected = widget.apiParams[param];
    const onClick = () => {
        const tableWidget = widget as TableWidget;
        tableWidget.setFilterParam({
            param,
            name,
            value: !selected,
        });
        if (tracking) {
            const selected = widget.apiParams[param];
            TrackWithGuidService.trackWithGuid(tracking, trackingAction || "click", {
                filter: name,
                isChecked: selected ? "checked" : "unchecked",
            });
        }
        if (typeof onChange === "function") {
            onChange(!selected);
        }
    };
    const CheckboxComponent = (
        <StyledCheckbox onClick={onClick} label={label} selected={selected} />
    );
    if (tooltip) {
        return (
            <PlainTooltip tooltipContent={tooltip} placement="top">
                <span>{CheckboxComponent}</span>
            </PlainTooltip>
        );
    }
    return CheckboxComponent;
};
