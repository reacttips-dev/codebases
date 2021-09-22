import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { StyledSiteTrends } from "./styles";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { SALES_RIGHT_SIDEBAR_TAB_SITE_TRENDS_KEY } from "pages/workspace/sales/constants/constants";
import { TabType } from "pages/workspace/sales/components/RightBar/Tabs/types";

const SiteTrends: React.FC<TabType> = ({ active, onClick }) => {
    const translate = useTranslation();

    return (
        <StyledSiteTrends active={active} onClick={onClick}>
            <PlainTooltip
                placement="bottom"
                tooltipContent={translate(SALES_RIGHT_SIDEBAR_TAB_SITE_TRENDS_KEY)}
            >
                <div>
                    <SWReactIcons iconName="line-chart" />
                </div>
            </PlainTooltip>
        </StyledSiteTrends>
    );
};

export default SiteTrends;
