import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { StyledBenchmarks } from "./styles";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { SALES_RIGHT_SIDEBAR_TAB_BENCHMARKS_KEY } from "pages/workspace/sales/constants/constants";
import { TabType } from "pages/workspace/sales/components/RightBar/Tabs/types";

const Benchmarks: React.FC<TabType> = ({ active, onClick }) => {
    const translate = useTranslation();

    return (
        <StyledBenchmarks active={active} onClick={onClick}>
            <PlainTooltip
                placement="bottom"
                tooltipContent={translate(SALES_RIGHT_SIDEBAR_TAB_BENCHMARKS_KEY)}
            >
                <div>
                    <SWReactIcons iconName="light-bulb" />
                </div>
            </PlainTooltip>
        </StyledBenchmarks>
    );
};

export default Benchmarks;
