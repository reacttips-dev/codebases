import { SWReactIcons } from "@similarweb/icons";
import { Injector } from "common/ioc/Injector";
import { CategoryPicker } from "components/React/CategoriesDropdown/CategoryPicker";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { i18nFilter } from "filters/ngFilters";
import React, { StatelessComponent } from "react";
import styled from "styled-components";
import { ISwSettings } from "../../../../../@types/ISwSettings";
import { IconContainer } from "../../../../../components/React/PopularPagesFilters/PopularPagesFilters";

const BenchMarkContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Title = styled.span`
    margin-right: 15px;
    color: black;
    //font-weight: bold;
    line-height: normal;
`;

const Description = styled.span`
    margin-right: 4px;
    position: relative;
    top: -2px;
`;

const InfoTip = () => (
    <PlainTooltip cssClass="categorypicker-tooltip" text="mmx.bar.benchmark.pickcategory">
        <IconContainer>
            <SWReactIcons iconName="info" size="xs" />
        </IconContainer>
    </PlainTooltip>
);

const CategoryBenchmark: StatelessComponent<any> = ({ widget }) => {
    const disabled = !widget.allowedCategoryForDuration();
    const selectedCategory = Injector.get<any>("swNavigator").getParams().category || "no-category";
    const pickerElement = (
        <CategoryPicker
            onToggle={widget.onCategoryToggle}
            selectedCategoryId={selectedCategory}
            onSelect={widget.onCategorySelected}
            disabled={disabled}
            searchPlaceHolder={i18nFilter()("mmx.channelsoverview.dropdown.search.placeholder")}
        />
    );
    return (
        <BenchMarkContainer>
            <Title>
                <Description>{i18nFilter()("mmx.bar.benchmark.title")}</Description>
                <InfoTip />
            </Title>
            {disabled ? (
                <PlainTooltip
                    text="mmx.bar.benchmark.pickcategory.disabled"
                    cssClass="categorypicker-tooltip"
                >
                    <div>{pickerElement}</div>
                </PlainTooltip>
            ) : (
                pickerElement
            )}
        </BenchMarkContainer>
    );
};
CategoryBenchmark.displayName = "CategoryBenchmark";
export default CategoryBenchmark;
