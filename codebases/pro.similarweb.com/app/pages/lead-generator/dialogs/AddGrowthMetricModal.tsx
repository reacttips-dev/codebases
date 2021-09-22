import { Flex } from "pages/Leading Folders/src/LeadingFoldersInfoPanel";
import React, { Component } from "react";
import { i18nFilter } from "filters/ngFilters";
import { Button } from "@similarweb/ui-components/dist/button";
import { Dropdown, DropdownItem, NoBorderButton } from "@similarweb/ui-components/dist/dropdown";
import { allTrackers } from "services/track/track";
import styled, { css } from "styled-components";
import InputBox, { Container as InboxBoxContainer } from "../../sneakpeek/components/InputBox";
import {
    periodTranslations,
    trendTranslations,
} from "../lead-generator-new/components/filters/VisitsFilter";
import * as _ from "lodash";
import { LeadGeneratorModalFooter } from "./elements";
import I18n from "components/React/Filters/I18n";

export interface IGrowthMetric {
    name: string;
    value: number;
    trend: boolean;
    period: string;
}

export interface IAddGrowthMetricProps {
    availableGrowthFilters: any[];

    onAdd(IGrowthMetric): void;

    onCancel(): void;

    selectedFilter: any;
}

const ControllerContainer: any = styled.div`
    ${InboxBoxContainer} {
        margin-right: 0;
    }
    margin-right: 8px;
`;

const Input: any = styled.input.attrs(() => ({
    maxLength: 6,
}))`
    background-color: #fff;
    margin-left: 8px;
    padding: 8px;
    width: 48px;
    height: 34px;
    box-sizing: border-box;
    border: ${({ error }: any) => (error ? "1px solid #ff5552" : "1px solid #eceef0")};
    outline: 0px;
    border-radius: 3px;
    &:hover {
        box-shadow: none;
    }
    ::placeholder {
        text-align: center;
    }
`;

const MetricDropdownContainer = styled(ControllerContainer)`
    margin-left: 8px;
`;
const Row = styled.div`
    display: flex;
    align-items: center;
    margin: 12px 0;
`;

const Wrapper = styled.div`
    font-size: 16px;
    position: relative;
    height: 100%;
`;

const Title = styled(Wrapper)`
    font-size: 16px;
    letter-spacing: 0.25px;
    margin-bottom: 20px;
    font-weight: 500;
`;
const Footer = styled.div`
    position: absolute;
    bottom: 8px;
    right: 8px;
`;

const periodPlaceHolder = {
    id: "placeholder",
    key: "placeholder",
    text: _.capitalize(i18nFilter()("grow.lead_generator.new.growth_filters.priod.placeholder")),
    buttonTitle: _.capitalize(
        i18nFilter()("grow.lead_generator.new.growth_filters.priod.placeholder.button"),
    ),
};
const trendPlaceHolder = {
    id: "placeholder",
    key: "placeholder",
    text: i18nFilter()("grow.lead_generator.new.growth_filters.trend.placeholder"),
    buttonTitle: _.capitalize(
        i18nFilter()("grow.lead_generator.new.growth_filters.trend.placeholder.button"),
    ),
};
const metricPlaceHolder = {
    id: "placeholder",
    key: "placeholder",
    text: _.capitalize(i18nFilter()("grow.lead_generator.new.growth_filters.placeholder")),
    buttonTitle: _.capitalize(
        i18nFilter()("grow.lead_generator.new.growth_filters.placeholder.button"),
    ),
};

const availablePeriods = () =>
    Object.entries(periodTranslations).map(([id, val]) => {
        return {
            ...val,
            text: _.capitalize(i18nFilter()(val.title)),
            id,
            key: id,
        };
    });
const availableTrends = () =>
    Object.entries(trendTranslations).map(([id, val]: [string, string]) => ({
        id,
        key: id,
        text: _.capitalize(i18nFilter()(val)),
        buttonTitle: _.capitalize(i18nFilter()(val)),
    }));

const List = ({ items, selectedItem, onSelect, isValid, isFormSubmitted }) => {
    return (
        <Dropdown
            width={254}
            hasSearch={false}
            selectedIds={{ [selectedItem.id]: true }}
            itemsComponent={DropdownItem}
            onClick={onSelect}
            dropdownPopupPlacement="ontop-left"
        >
            {[
                <NoBorderButton
                    key={selectedItem.id}
                    isPlaceholder={selectedItem.id === "placeholder"}
                    error={isFormSubmitted ? !isValid : false}
                >
                    {_.capitalize(i18nFilter()(selectedItem.buttonTitle))}
                </NoBorderButton>,
                ...items.map((item) => ({
                    ...item,
                    title: "", // force remove title from DropdownItem
                })),
            ]}
        </Dropdown>
    );
};

export class AddGrowthMetricModal extends Component<IAddGrowthMetricProps, any> {
    constructor(props) {
        super(props);
        const { name, value, period, trend } = props.selectedFilter;
        this.state = {
            value,
            metric: this.getAvailableMetrics().find(({ id }) => id === name) || metricPlaceHolder,
            trend: availableTrends().find(({ id }) => id === trend) || trendPlaceHolder,
            period: availablePeriods().find(({ id }) => id === period) || periodPlaceHolder,
            isFormSubmitted: false,
            isValidMetric: false,
            isValidTrend: false,
            isValidPeriod: false,
            isValidValue: false,
        };
    }

    onChange = (field) => (value) => {
        this.setState({
            [field]: value,
        });
    };

    isFormValid() {
        const {
            isValidMetric,
            isValidTrend,
            isValidPeriod,
            isValidValue,
            isFormSubmitted,
        } = this.state;
        return isFormSubmitted && isValidMetric && isValidTrend && isValidPeriod && isValidValue;
    }

    isValidDropDownValue = (item) => {
        return item.id !== "placeholder";
    };

    isValidTextBoxValue(value) {
        if (!isNaN(value)) {
            const num = +value;
            switch (this.state.trend.id) {
                case "increase":
                    return num >= 0 && num <= 500;
                case "decrease":
                    return num >= 0 && num <= 100;
            }
        }
        return false;
    }

    isTouched = (field) => () => {
        return this.state.touched[field];
    };

    onSave = () => {
        const { metric, trend, period, value } = this.state;
        this.setState(
            () => ({
                isFormSubmitted: true,
                isValidMetric: this.isValidDropDownValue(metric),
                isValidTrend: this.isValidDropDownValue(trend),
                isValidPeriod: this.isValidDropDownValue(period),
                isValidValue: this.isValidTextBoxValue(value),
            }),
            () => {
                if (this.isFormValid()) {
                    const newVal = {
                        name: metric.id,
                        trend: trend.id,
                        period: period.id,
                        value: parseFloat(value),
                    };
                    this.props.onAdd(newVal);
                }
            },
        );
    };

    getAvailableMetrics() {
        return this.props.availableGrowthFilters.map((metric) => ({
            ...metric,
            id: metric.name,
            text: i18nFilter()(metric.title),
            buttonTitle: i18nFilter()(metric.title),
            key: metric.id,
        }));
    }

    render() {
        const metrics = this.getAvailableMetrics();
        const onChangeValue = this.onChange("value");
        const { isFormSubmitted } = this.state;
        return (
            <Wrapper>
                <Row>
                    <Title>
                        <I18n>grow.lead_generator.modal.growthfilters.title</I18n>
                    </Title>
                </Row>
                <Row>
                    <I18n>grow.lead_generator.modal.growthfilters.metrics</I18n>
                    <MetricDropdownContainer>
                        <List
                            items={metrics}
                            selectedItem={this.state.metric}
                            isValid={this.state.isValidMetric}
                            isFormSubmitted={isFormSubmitted}
                            onSelect={this.onChange("metric")}
                        />
                    </MetricDropdownContainer>
                </Row>
                <Row>
                    <I18n>grow.lead_generator.modal.growthfilters.trend</I18n>
                    <MetricDropdownContainer>
                        <List
                            items={availableTrends()}
                            selectedItem={this.state.trend}
                            isValid={this.state.isValidTrend}
                            isFormSubmitted={isFormSubmitted}
                            onSelect={this.onChange("trend")}
                        />
                    </MetricDropdownContainer>
                    <ControllerContainer>
                        <Input
                            value={this.state.value}
                            placeholder="-"
                            onChange={(e) => onChangeValue(e.target.value)}
                            error={isFormSubmitted ? !this.state.isValidValue : false}
                        />
                    </ControllerContainer>
                    <span>%</span>
                </Row>
                <Row>
                    {/*<I18n>grow.lead_generator.modal.growthfilters.period</I18n>*/}
                    <List
                        items={availablePeriods()}
                        selectedItem={this.state.period}
                        isValid={this.state.isValidPeriod}
                        isFormSubmitted={isFormSubmitted}
                        onSelect={this.onChange("period")}
                    />
                </Row>
                <Footer>
                    <LeadGeneratorModalFooter>
                        <Button type="flat" onClick={this.props.onCancel}>
                            {_.capitalize(i18nFilter()("grow.lead_generator.modal.run.cancel"))}
                        </Button>
                        <Button onClick={this.onSave}>
                            {_.capitalize(
                                i18nFilter()(
                                    _.isEmpty(this.props.selectedFilter)
                                        ? "grow.lead_generator.modal.run.createfilter"
                                        : "grow.lead_generator.modal.run.savefilter",
                                ),
                            )}
                        </Button>
                    </LeadGeneratorModalFooter>
                </Footer>
            </Wrapper>
        );
    }
}
