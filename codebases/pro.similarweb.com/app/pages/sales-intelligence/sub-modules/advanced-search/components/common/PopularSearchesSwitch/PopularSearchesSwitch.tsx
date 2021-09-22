import React from "react";
import { Switcher, TextSwitcherItem } from "@similarweb/ui-components/dist/switcher";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { PopularSearchKey, PopularSearchTab } from "../../../types/common";
import { StyledSwitchContainer } from "./styles";

type PopularSearchesSwitchProps = {
    tabs: PopularSearchTab[];
    selected: PopularSearchKey;
    onSelect(key: PopularSearchKey): void;
};

const PopularSearchesSwitch = (props: PopularSearchesSwitchProps) => {
    const translate = useTranslation();
    const { tabs, selected, onSelect } = props;
    const selectedIndex = tabs.findIndex((tab) => tab.key === selected);

    const handleItemClick = (index: number) => {
        onSelect(tabs[index].key);
    };

    return (
        <StyledSwitchContainer>
            <Switcher selectedIndex={selectedIndex} onItemClick={handleItemClick}>
                {tabs.map((tab) => (
                    <TextSwitcherItem key={`popular-search-switch-item-${tab.key}`}>
                        <span>
                            {translate(`si.advanced_search.new_search_modal.tab.${tab.key}.name`)}
                        </span>
                    </TextSwitcherItem>
                ))}
            </Switcher>
        </StyledSwitchContainer>
    );
};

export default PopularSearchesSwitch;
