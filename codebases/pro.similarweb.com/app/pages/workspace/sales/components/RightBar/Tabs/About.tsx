import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { StyledAbout } from "pages/workspace/sales/components/RightBar/Tabs/styles";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { SALES_RIGHT_SIDEBAR_TAB_ABOUT_KEY } from "pages/workspace/sales/constants/constants";
import { TabType } from "pages/workspace/sales/components/RightBar/Tabs/types";

const About: React.FC<TabType> = ({ active, onClick }) => {
    const translate = useTranslation();

    return (
        <StyledAbout active={active} onClick={onClick}>
            <PlainTooltip
                placement="bottom"
                tooltipContent={translate(SALES_RIGHT_SIDEBAR_TAB_ABOUT_KEY)}
            >
                <div>
                    <SWReactIcons iconName="info" />
                </div>
            </PlainTooltip>
        </StyledAbout>
    );
};

export default About;
