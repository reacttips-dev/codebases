import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import {
    ShareBar,
    ShareBarChart,
    ShareBarChartValue,
    ShareBarContainer,
} from "@similarweb/ui-components/dist/share-bar";
import React, { StatelessComponent } from "react";
import styled from "styled-components";
import { ITableCellProps } from "../interfaces/ITableCellProps";

const barBackgroundGray = colorsPalettes.carbon[50];

interface IShareCompetitionCell extends Partial<ITableCellProps> {
    competitionData: Array<{
        value: number;
        color: string;
        formattedValue: string;
        leader?: boolean;
        secondaryColor: string;
        average?: number;
    }>;
}

export const CompetitionCell = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;

    width: 100%;
    height: 100%;

    ${ShareBarContainer} {
        width: 100%;
    }
`;
CompetitionCell.displayName = "CompetitionCell";

export const CompetitionCellCompetitor = styled.div`
    display: flex;
    align-items: center;

    width: 100%;

    &:not(:last-child) {
        margin-bottom: 8px;
    }

    ${ShareBarContainer} {
        margin: 0 12px;
    }

    ${ShareBarChart} {
        height: 16px;
    }

    ${ShareBarChartValue} {
        border-radius: 3px;
    }
`;
CompetitionCellCompetitor.displayName = "CompetitionCellCompetitor";

export const WinnerIcon = styled(SWReactIcons).attrs({
    size: "xs",
    iconName: "winner",
})`
    path {
        fill: ${({ color }) => color};
    }
`;
WinnerIcon.displayName = "WinnerIcon";

export const DummyIcon = styled.div`
    width: 16px;
    height: 16px;
    flex-shrink: 0;
`;
DummyIcon.displayName = "DummyIcon";

export const FormattedText = styled.div`
    flex-basis: 38px;
    flex-shrink: 0;
    text-align: right;
`;
FormattedText.displayName = "FormattedText";

const top = [-16, -40];

export const ShareCompetitionCell: StatelessComponent<IShareCompetitionCell> = ({
    competitionData,
}) => {
    return (
        <CompetitionCell>
            {competitionData.map((item, idx, array) => {
                return !item.value && item.value !== 0 ? (
                    <CompetitionCellCompetitor key={`${item.value}_${idx}`}>
                        N/A
                    </CompetitionCellCompetitor>
                ) : (
                    <CompetitionCellCompetitor key={`${item.value}_${idx}`}>
                        {item.leader ? (
                            <FormattedText>
                                <strong>{item.formattedValue}</strong>{" "}
                            </FormattedText>
                        ) : (
                            <FormattedText>{item.formattedValue}</FormattedText>
                        )}
                        <ShareBar
                            value={item.value}
                            primaryColor={item.color}
                            secondaryColor={barBackgroundGray}
                            hideChangeValue={true}
                            hideValue={true}
                            verticalLineProps={{
                                bgColor: item.color,
                                left: item.average * 100,
                                top: array.length === 1 ? -28 : top[idx],
                                height: 72,
                            }}
                        />
                        {item.leader ? (
                            <WinnerIcon color={colorsPalettes.yellow[400]} />
                        ) : (
                            <DummyIcon />
                        )}
                    </CompetitionCellCompetitor>
                );
            })}
        </CompetitionCell>
    );
};
