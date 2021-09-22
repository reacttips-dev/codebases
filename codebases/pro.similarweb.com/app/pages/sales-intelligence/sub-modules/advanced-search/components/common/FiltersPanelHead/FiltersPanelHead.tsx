import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { CSSTransition } from "react-transition-group";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { WithExpandingProps } from "../../../types/common";
import { FILTERS_PANEL_TRANSITION_TIMEOUT } from "../../styles";
import FilterPanelExpandButton from "../FilterPanelExpandButton/FilterPanelExpandButton";
import {
    StyledHeadTitle,
    StyledPanelHead,
    StyledHeadTitleContainer,
    PANEL_HEAD_TRANSITION_PREFIX,
} from "./styles";

type FiltersPanelHeadProps = WithExpandingProps & {
    numberOfReadyStateFilters: number;
};

const FiltersPanelHead = (props: FiltersPanelHeadProps) => {
    const { isExpanded, numberOfReadyStateFilters, onExpandToggle } = props;
    const translate = useTranslation();

    const getTitle = () => {
        if (numberOfReadyStateFilters > 0) {
            return translate("si.lead_gen_filters.title.with_number", {
                numberOfActiveFilters: numberOfReadyStateFilters,
            });
        }

        return translate("si.lead_gen_filters.title");
    };

    return (
        <CSSTransition
            in={!isExpanded}
            timeout={FILTERS_PANEL_TRANSITION_TIMEOUT}
            classNames={PANEL_HEAD_TRANSITION_PREFIX}
        >
            <StyledPanelHead classNamesPrefix={PANEL_HEAD_TRANSITION_PREFIX}>
                <StyledHeadTitleContainer>
                    <SWReactIcons iconName="filters-icon" size="xs" />
                    <StyledHeadTitle>{getTitle()}</StyledHeadTitle>
                </StyledHeadTitleContainer>
                <FilterPanelExpandButton
                    iconName="chev-left"
                    onClick={onExpandToggle}
                    tooltipText={translate("si.lead_gen_filters.button.collapse.tooltip")}
                />
            </StyledPanelHead>
        </CSSTransition>
    );
};

export default FiltersPanelHead;
