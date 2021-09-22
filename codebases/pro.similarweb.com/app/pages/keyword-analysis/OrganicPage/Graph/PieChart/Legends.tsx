import { LegendWithOneLineCheckboxFlex } from "@similarweb/ui-components/dist/legend";
import { Legends } from "components/React/Legends/Legends";
import { StyledLegendWrapper } from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/StyledComponents";
import React from "react";
import { LegendsContainer } from "./styled";

export const PieLegends = ({ legendItems, toggleSeries }) => {
    const [clientWidth, setClientWidth] = React.useState(window.innerWidth);
    const refreshClientWidth = () => setClientWidth(window.innerWidth);
    React.useState(() => {
        window.addEventListener("resize", refreshClientWidth);
        return () => window.removeEventListener("resize", refreshClientWidth);
    });
    return (
        <LegendsContainer>
            <Legends
                legendComponent={LegendWithOneLineCheckboxFlex}
                legendComponentWrapper={StyledLegendWrapper}
                legendItems={legendItems}
                toggleSeries={toggleSeries}
                gridDirection="column"
                textMaxWidth={
                    clientWidth < 1680 ? (clientWidth > 1400 ? "150px" : "100px") : "190px"
                }
            />
        </LegendsContainer>
    );
};
