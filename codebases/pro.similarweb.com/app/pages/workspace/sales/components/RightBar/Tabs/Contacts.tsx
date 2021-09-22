import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { StyledContacts } from "./styles";
import { Pill } from "components/Pill/Pill";
import { colorsPalettes } from "@similarweb/styles";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { TabType } from "pages/workspace/sales/components/RightBar/Tabs/types";

const Contacts: React.FC<TabType> = ({ active, onClick }) => {
    const translate = useTranslation();
    return (
        <StyledContacts active={active} onClick={onClick}>
            <PlainTooltip placement="bottom" tooltipContent={translate("Contacts")}>
                <div>
                    <SWReactIcons iconName="user" />
                </div>
            </PlainTooltip>
            <Pill text="NEW" backgroundColor={colorsPalettes.orange[400]} />
        </StyledContacts>
    );
};

export default Contacts;
