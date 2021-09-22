import React from "react";
import styled, { css } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import I18n from "components/React/Filters/I18n";
import { IChangedStyleProps, IFilterRowProps, Row } from "../boxes/GrowthBox";

// TODO: Refactor, extract

const ActionButton = styled(IconButton).attrs(() => ({
    type: "flat",
    iconName: "",
}))`
    .SWReactIcons svg {
        width: 16px;
        height: 16px;
    }

    svg path {
        fill-opacity: 0.8;
    }

    ${(props: IFilterRowProps) =>
        !props.isActive &&
        css`
            svg path {
                fill-opacity: 0.4;
            }
        `}
`;

const ActionsWrapper = styled.div`
    width: 88px;
`;

const EditFilter: any = styled(ActionButton).attrs<{ iconName: string }>(() => ({
    iconName: "edit",
}))`
    .SWReactIcons {
        align-items: center;
        justify-content: center;

        & svg path:first-child {
            fill: none;
        }
    }
`;

const RemoveFilter: any = styled(ActionButton).attrs<{ iconName: string }>(() => ({
    iconName: "delete",
}))`
    .SWReactIcons {
        align-items: center;
        justify-content: center;
    }
`;

const Content = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    ${(props: IFilterRowProps) =>
        !props.isActive &&
        css`
            opacity: 0.4;
            pointer-events: none;
        `}
`;

export const trendTranslations = {
    increase: "grow.lead_generator.new.growth_filters.trend.increase",
    decrease: "grow.lead_generator.new.growth_filters.trend.decrease",
};
export const periodTranslations = {
    mom: {
        title: "grow.lead_generator.new.growth_filters.priod.mom",
        buttonTitle: "grow.lead_generator.new.growth_filters.priod.mom.button",
    },
    yoy: {
        title: "grow.lead_generator.new.growth_filters.priod.yoy",
        buttonTitle: "grow.lead_generator.new.growth_filters.priod.yoy.button",
    },
};

export const ChangeStyle = styled.span`
    font-weight: 500;
    color: ${(props: IChangedStyleProps) =>
            props.trend === "increase" ? colorsPalettes.green["s100"] : colorsPalettes.red["s100"]}
        ${(props: IChangedStyleProps) =>
            !props.isActive &&
            css`
                color: inherit;
            `};
`;

const Space = () => <span> </span>;
export const FilterDescription = ({ title, trend, value, period, isActive }) => (
    <span>
        <I18n>{title}</I18n>
        <ChangeStyle trend={trend} value={value} isActive={isActive}>
            <Space />
            <I18n>{trendTranslations[trend]}</I18n>
            <Space />
            <span>{value}%</span>
            <Space />
        </ChangeStyle>
        <I18n>{periodTranslations[period].title}</I18n>
    </span>
);

const VisitsFilter = ({ isActive, title, trend, value, period, onEdit, onRemove }) => {
    return (
        <Row>
            <Content isActive={isActive}>
                <FilterDescription
                    title={title}
                    trend={trend}
                    value={value}
                    period={period}
                    isActive={isActive}
                />
                <ActionsWrapper>
                    <EditFilter onClick={onEdit} />
                    <RemoveFilter onClick={onRemove} />
                </ActionsWrapper>
            </Content>
        </Row>
    );
};

export default VisitsFilter;
