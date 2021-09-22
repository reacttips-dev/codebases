import React from "react";
import { IFiltersBoxProps } from "./FiltersBox";
import { TldBoxWrapper } from "../elements";
import SwitcherCtrl from "../filters-ctrl/SwitcherCtrl";
import { IconChipItem } from "@similarweb/ui-components/dist/chip";
import { breakValueToArr } from "../filters/InputComboFilter";
import StyledFiltersBox from "pages/lead-generator/lead-generator-new/components/FiltersBox/StyledFiltersBox";
import { useTrack } from "components/WithTrack/src/useTrack";
import {
    isDomainContainsFilter,
    isDomainEndsWithFilter,
} from "pages/lead-generator/lead-generator-new/helpers";

const TldBox: React.FC<IFiltersBoxProps> = (props) => {
    const [track] = useTrack();
    const { filters, setActive, technologies } = props;
    const filtersOptions = [
        "grow.lead_generator.new.top_level_domains.switcher.contains",
        "grow.lead_generator.new.top_level_domains.switcher.ends_with",
    ];
    const filtersDisclaimers = [
        "grow.lead_generator.new.top_level_domains.disclaimer.contains",
        "grow.lead_generator.new.top_level_domains.disclaimer.ends_with",
    ];

    const onSearchTypeChanged = (index: number): void => {
        const searchType = index === 0 ? "contains" : "ends_with";

        track("lead generation reports", "click", `top-level-domains/type/${searchType}`);
    };

    const onAddOrRemove = (val) => {
        const { type, item } = val;

        track("lead generation reports", "click", ` top-level-domains/${type}/${item}`);
    };

    const ensureProperDomainFormat = (val: string): string => {
        if (val[0] !== ".") {
            val = `.${val}`;
        }

        if (val[val.length - 1] === ".") {
            val = val.substring(0, val.length - 1);
        }

        return val;
    };

    const isError = (newVal: string): boolean => {
        const arr = breakValueToArr(newVal);
        const regex = /^(\.[\w]+)+$/;

        return (
            arr.length > 100 ||
            !!arr.find((val) => val.length > 20 || !regex.test(ensureProperDomainFormat(val)))
        );
    };

    function createFilterBoxes() {
        return filters
            .filter((filter) => !filter.hideInBox)
            .map((filter, index) => {
                const Component = filter.component;

                return (
                    <Component
                        filter={filter}
                        isActive={true}
                        key={`${index}FILTER`}
                        setBoxActive={setActive}
                        technologies={technologies}
                        transformInput={(arr) => arr.map(ensureProperDomainFormat)}
                        isError={isError}
                        additionalChipParams={{ iconName: "globe" }}
                        onChange={onAddOrRemove}
                        itemsComponent={IconChipItem}
                    />
                );
            });
    }

    const containsFilter = filters.find(isDomainContainsFilter);
    const endsWithFilter = filters.find(isDomainEndsWithFilter);

    return (
        <TldBoxWrapper>
            <StyledFiltersBox {...props}>
                <SwitcherCtrl
                    firstFilter={containsFilter}
                    secondFilter={endsWithFilter}
                    filtersOptions={filtersOptions}
                    onChange={onSearchTypeChanged}
                    filtersDisclaimers={filtersDisclaimers}
                />
                {createFilterBoxes()}
            </StyledFiltersBox>
        </TldBoxWrapper>
    );
};

export default TldBox;
