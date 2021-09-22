import React, { ReactChild } from "react";
import { IconButton } from "@similarweb/ui-components/dist/button/src/IconButton";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { useTranslation } from "components/WithTranslation/src/I18n";

type ExcelButtonProps = {
    tooltip: string | ReactChild;
    isDisabled: boolean;
    onClick(): void;
};

const ExcelButton = (props: ExcelButtonProps) => {
    const translate = useTranslation();
    const { tooltip, isDisabled, onClick } = props;

    return (
        <PlainTooltip maxWidth={250} placement="top" tooltipContent={tooltip}>
            <div>
                <IconButton isDisabled={isDisabled} type="flat" iconName="excel" onClick={onClick}>
                    {translate("si.multi_selector.initial_state.button.excel.label")}
                </IconButton>
            </div>
        </PlainTooltip>
    );
};

export default ExcelButton;
