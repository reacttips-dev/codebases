import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { CSSTransition } from "react-transition-group";
import { useTranslation } from "components/WithTranslation/src/I18n";
import FilterPanelExpandButton from "../FilterPanelExpandButton/FilterPanelExpandButton";
import { FILTERS_PANEL_TRANSITION_TIMEOUT } from "../../styles";
import {
    TRANSITION_CLASSNAMES_PREFIX,
    StyledCollapsedBlock,
    StyledButtonContainer,
    StyledTitleWrap,
    StyledTitle,
} from "./styles";

type FiltersPanelCollapsedProps = {
    isVisible: boolean;
    numberOfReadyFilters: number;
    onClick(): void;
};

const FiltersPanelCollapsedBar = (props: FiltersPanelCollapsedProps) => {
    const translate = useTranslation();
    const { isVisible, numberOfReadyFilters, onClick } = props;

    const getTitle = () => {
        if (numberOfReadyFilters > 0) {
            return translate("si.lead_gen_filters.title.with_number.collapsed", {
                numberOfFilters: numberOfReadyFilters,
            });
        }

        return translate("si.lead_gen_filters.title");
    };

    return (
        <CSSTransition
            in={isVisible}
            classNames={TRANSITION_CLASSNAMES_PREFIX}
            timeout={FILTERS_PANEL_TRANSITION_TIMEOUT}
        >
            <StyledCollapsedBlock classNamesPrefix={TRANSITION_CLASSNAMES_PREFIX}>
                <StyledButtonContainer>
                    <FilterPanelExpandButton
                        iconName="chev-right"
                        onClick={onClick}
                        tooltipText={translate("si.lead_gen_filters.button.expand.tooltip")}
                    />
                </StyledButtonContainer>
                <StyledTitleWrap>
                    <SWReactIcons iconName="filters-icon" size="xs" />
                    <StyledTitle>{getTitle()}</StyledTitle>
                </StyledTitleWrap>
            </StyledCollapsedBlock>
        </CSSTransition>
    );
};

export default FiltersPanelCollapsedBar;
