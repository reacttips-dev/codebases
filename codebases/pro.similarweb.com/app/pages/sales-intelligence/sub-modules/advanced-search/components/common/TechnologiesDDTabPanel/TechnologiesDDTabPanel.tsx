import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { TechnologiesDDItemType } from "../../../filters/technology/types";
import TechnologiesDDVirtualListContainer from "../TechnologiesDDVirtualList/TechnologiesDDVirtualListContainer";
import { TAB_INNER_HEIGHT, StyledText, StyledEmptyTabContainer } from "./styles";

type TechnologiesDDTabPanelProps = {
    tab: {
        id: string;
        name: string;
        items: TechnologiesDDItemType[];
    };
    onItemClick(item: TechnologiesDDItemType): void;
};

const TechnologiesDDTabPanel = (props: TechnologiesDDTabPanelProps) => {
    const translate = useTranslation();
    const { tab, onItemClick } = props;

    if (tab.items.length === 0) {
        return (
            <StyledEmptyTabContainer>
                <SWReactIcons iconName="no-search-results" size="md" />
                <StyledText>
                    {translate("si.lead_gen_filters.technologies.dd_tab.empty_tab_text", {
                        name: tab.name.slice(0, tab.name.indexOf("(") - 1),
                    })}
                </StyledText>
            </StyledEmptyTabContainer>
        );
    }

    return (
        <TechnologiesDDVirtualListContainer
            itemHeight={48}
            items={tab.items}
            onItemClick={onItemClick}
            containerHeight={TAB_INNER_HEIGHT}
        />
    );
};

export default TechnologiesDDTabPanel;
