import React, { ReactChild } from "react";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledAccountButton } from "./styles";

type AccountButtonProps = {
    tooltip: string | ReactChild;
    isDisabled: boolean;
    onClick(): void;
};

const AccountButton = (props: AccountButtonProps) => {
    const translate = useTranslation();
    const { tooltip, isDisabled, onClick } = props;

    return (
        <PlainTooltip maxWidth={260} placement="top" tooltipContent={tooltip}>
            <div>
                <StyledAccountButton
                    isDisabled={isDisabled}
                    type="flat"
                    iconName="star-full"
                    onClick={onClick}
                >
                    {translate("si.multi_selector.initial_state.button.account.label")}
                </StyledAccountButton>
            </div>
        </PlainTooltip>
    );
};

export default AccountButton;
