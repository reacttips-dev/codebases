import React from "react";
import { compose } from "redux";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { InclusionEnum } from "../../../../../common-components/dropdown/InclusionDropdown/InclusionDropdown";
import TechnologiesFilterContext from "../../../contexts/technologiesFilterContext";
import { FilterContainerProps } from "../../../types/common";
import useFilterState from "../../../hooks/useFilterState";
import { useTranslation } from "components/WithTranslation/src/I18n";
import withFilterAutoRegister from "../../../hoc/withFilterAutoRegister";
import withFilterUpdate from "../../../hoc/withFilterUpdate";
import withFilterInstance from "../../../hoc/withFilterInstance";
import TechnologiesModal from "../../common/TechnologiesModal/TechnologiesModal";
import TechnologiesConditions from "../../common/TechnologiesConditions/TechnologiesConditions";
import { StyledBaseFilterContainer } from "../../styles";
import { CommonTechnologyFilter, TechnologiesCondition } from "../../../filters/technology/types";
import { ADD_BUTTON_TOOLTIP_MAX_WIDTH, StyledEmptyText, StyledAddButtonContainer } from "./styles";

const TechnologiesFilterContainer = (props: FilterContainerProps<CommonTechnologyFilter>) => {
    const translate = useTranslation();
    const { filter, onUpdate } = props;
    const [isModalOpened, setIsModalOpened] = React.useState(false);
    const [modalValue, setModalValue] = React.useState<TechnologiesCondition>(null);
    const { value, updateFilterAndLocalState } = useFilterState(filter, onUpdate);

    const isExcludeAvailable = () => {
        if (modalValue !== null && modalValue.inclusion === InclusionEnum.excludeOnly) {
            return true;
        }

        return !value.some((c) => c.inclusion === InclusionEnum.excludeOnly);
    };

    const handleConditionEdit = (condition: TechnologiesCondition) => {
        setModalValue(condition);
        setIsModalOpened(true);
    };

    const handleConditionDelete = (id: string) => {
        const newValue = value.filter((c) => c.id !== id);

        if (newValue.length === 0) {
            return updateFilterAndLocalState(filter.getInitialValue());
        }

        updateFilterAndLocalState(newValue);
    };

    const handleModalApply = (condition: TechnologiesCondition) => {
        setIsModalOpened(false);

        const newValue =
            modalValue === null
                ? value.concat(condition)
                : value.map((c) => {
                      if (c.id === condition.id) {
                          return condition;
                      }

                      return c;
                  });

        setModalValue(null);
        setTimeout(() => updateFilterAndLocalState(newValue), 0);
    };

    const handleModalCancel = () => {
        setIsModalOpened(false);
        setModalValue(null);
    };

    const renderAddButton = () => {
        const button = (
            <IconButton
                type="flat"
                iconName="add"
                onClick={() => setIsModalOpened(true)}
                dataAutomation="technologies-filter-button-add"
            >
                {translate(`si.lead_gen_filters.${filter.key}.button.add`)}
            </IconButton>
        );

        if (value.length > 0) {
            return (
                <PlainTooltip
                    tooltipContent={translate(
                        `si.lead_gen_filters.${filter.key}.button.add.tooltip`,
                    )}
                    maxWidth={ADD_BUTTON_TOOLTIP_MAX_WIDTH}
                >
                    <div>{button}</div>
                </PlainTooltip>
            );
        }

        return button;
    };

    return (
        <TechnologiesFilterContext.Provider
            value={{
                categories: filter.categories,
                subCategories: filter.subCategories,
                technologies: filter.technologies,
            }}
        >
            <StyledBaseFilterContainer>
                <TechnologiesModal
                    selected={modalValue}
                    isOpened={isModalOpened}
                    onApply={handleModalApply}
                    onCancel={handleModalCancel}
                    isExcludeAvailable={isExcludeAvailable()}
                />
                <StyledEmptyText isHidden={value.length > 0}>
                    {translate(`si.lead_gen_filters.${filter.key}.empty_text`)}
                </StyledEmptyText>
                <TechnologiesConditions
                    conditions={value}
                    onEditClick={handleConditionEdit}
                    onDeleteClick={handleConditionDelete}
                />
                <StyledAddButtonContainer>{renderAddButton()}</StyledAddButtonContainer>
            </StyledBaseFilterContainer>
        </TechnologiesFilterContext.Provider>
    );
};

export default compose(
    withFilterInstance,
    withFilterUpdate,
    withFilterAutoRegister,
)(TechnologiesFilterContainer);
