import React, { ReactChild } from "react";
import { IconButton } from "@similarweb/ui-components/dist/button/src/IconButton";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { useTranslation } from "components/WithTranslation/src/I18n";

type RemoveButtonProps = {
    tooltip: string | ReactChild;
    onClick(): void;
};

const RemoveButton = (props: RemoveButtonProps) => {
    const translate = useTranslation();
    const { tooltip, onClick } = props;

    return (
        <PlainTooltip placement="top" tooltipContent={tooltip}>
            <div>
                <IconButton type="flat" iconName="delete" onClick={onClick}>
                    {translate("si.multi_selector.initial_state.button.remove.label")}
                </IconButton>
            </div>
        </PlainTooltip>
    );
};

export default RemoveButton;
