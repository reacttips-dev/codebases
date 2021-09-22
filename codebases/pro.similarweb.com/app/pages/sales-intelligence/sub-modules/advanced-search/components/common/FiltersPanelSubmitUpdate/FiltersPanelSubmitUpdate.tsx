import React from "react";
import { connect } from "react-redux";
import { RootState } from "store/types";
import { Button } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { useTranslation } from "components/WithTranslation/src/I18n";
import useFiltersManager from "../../../hooks/useFiltersManager";
import { areCurrentValuesDifferentFromDto } from "../../../helpers/filters";
import { selectCurrentSearchObject, selectFiltersInReadyState } from "../../../store/selectors";

type FiltersPanelSubmitUpdateProps = {
    isUpdating: boolean;
    isSaveButtonDisabled: boolean;
    isUpdateButtonDisabled: boolean;
    onUpdateClick(): void;
    onSaveClick(): void;
};

const FiltersPanelSubmitUpdate = (
    props: FiltersPanelSubmitUpdateProps & ReturnType<typeof mapStateToProps>,
) => {
    const translate = useTranslation();
    const {
        isUpdating,
        isUpdateButtonDisabled,
        isSaveButtonDisabled,
        onUpdateClick,
        onSaveClick,
        searchObject,
        filtersInReadyState,
    } = props;
    const filtersManger = useFiltersManager();

    const different = React.useMemo(() => {
        return searchObject
            ? areCurrentValuesDifferentFromDto(
                  filtersManger.getKeyToInstanceMap(),
                  filtersInReadyState,
                  searchObject,
              )
            : false;
    }, [filtersInReadyState]);

    const renderSubmitButton = () => {
        const button = (
            <Button
                isLoading={isUpdating}
                onClick={onUpdateClick}
                isDisabled={isSaveButtonDisabled || !different || isUpdateButtonDisabled}
            >
                {translate(`si.lead_gen_filters.button.update${isUpdating ? ".progress" : ""}`)}
            </Button>
        );

        if (isSaveButtonDisabled) {
            return button;
        }

        if (!different) {
            return (
                <PlainTooltip
                    tooltipContent={translate("si.lead_gen_filters.button.update.tooltip.disabled")}
                >
                    <div>{button}</div>
                </PlainTooltip>
            );
        }

        return button;
    };

    return (
        <>
            <Button type="flat" onClick={onSaveClick} isDisabled={isSaveButtonDisabled}>
                {translate("si.lead_gen_filters.button.save_as_new")}
            </Button>
            {renderSubmitButton()}
        </>
    );
};

const mapStateToProps = (state: RootState) => ({
    searchObject: selectCurrentSearchObject(state),
    filtersInReadyState: selectFiltersInReadyState(state),
});

export default connect(mapStateToProps)(FiltersPanelSubmitUpdate) as React.ComponentType<
    FiltersPanelSubmitUpdateProps
>;
