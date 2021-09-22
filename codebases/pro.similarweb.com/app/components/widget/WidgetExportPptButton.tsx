import SWReactRootComponent from "decorators/SWReactRootComponent";
import React, { FC } from "react";
import styled from "styled-components";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { i18nFilter } from "filters/ngFilters";

const translate = i18nFilter();

interface IWidgetExportPptButtonProps {
    onClick: () => void;
    isDisabled: boolean;
}

const ExportButtonContainer = styled.div<{ isDisabled: boolean }>`
    display: inline-block;
    position: absolute;
    box-sizing: border-box;
    right: 45px;
    cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};

    .SWReactIcons {
        svg {
            opacity: ${({ isDisabled }) => (isDisabled ? "30%" : "100%")};
        }
    }
`;

export const WidgetExportPptButton: React.FunctionComponent<IWidgetExportPptButtonProps> = (
    props,
) => {
    const { onClick, isDisabled } = props;

    const tooltipText = isDisabled
        ? translate("dashboard.export.ppt.button.disabled")
        : translate("dashboard.export.ppt.button");

    return (
        <PlainTooltip tooltipContent={tooltipText}>
            <ExportButtonContainer isDisabled={isDisabled}>
                <IconButton
                    iconName="ppt"
                    type="flat"
                    onClick={onClick}
                    isDisabled={isDisabled}
                ></IconButton>
            </ExportButtonContainer>
        </PlainTooltip>
    );
};

SWReactRootComponent(WidgetExportPptButton, "WidgetExportPptButton");
