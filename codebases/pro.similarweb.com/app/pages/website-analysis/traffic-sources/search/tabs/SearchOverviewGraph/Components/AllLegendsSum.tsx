import {
    AllItemContainer,
    AllItemName,
    AllItemValue,
    IconsContainer,
    LegendDividerWithMargin,
} from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Components/StyledComponents";
import { SWReactIcons } from "@similarweb/icons";
import { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { FlexRow } from "pages/website-analysis/website-content/leading-folders/components/Tab";
import { FC } from "react";
interface IAllLegendsSumProps {
    name: string;
    isWinner?: boolean;
    showTooltip?: boolean;
    data?: number;
    tooltip?: string;
}
export const AllLegendsSum: FC<IAllLegendsSumProps> = ({
    name,
    isWinner,
    showTooltip,
    data,
    tooltip,
}) => {
    return (
        <>
            <LegendDividerWithMargin />
            <AllItemContainer>
                <FlexRow>
                    <AllItemName>{name}</AllItemName>
                    {isWinner && (
                        <IconsContainer className="winnerIcon">
                            <SWReactIcons iconName="winner" size="xs" />
                        </IconsContainer>
                    )}
                    {showTooltip && (
                        <PlainTooltip placement="top" tooltipContent={tooltip}>
                            <span>
                                <InfoIcon iconName="info" />
                            </span>
                        </PlainTooltip>
                    )}
                </FlexRow>
                <AllItemValue>{data}</AllItemValue>
            </AllItemContainer>
        </>
    );
};
