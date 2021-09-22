import React from "react";
import { CSSTransition } from "react-transition-group";
import { useTranslation } from "components/WithTranslation/src/I18n";
import useActionAfterFlagChange from "pages/sales-intelligence/hooks/useActionAfterFlagChange";
import { FIND_LEADS_SAVED_SEARCH_ROUTE } from "pages/sales-intelligence/constants/routes";
import FiltersPanelSubmitCreate from "../FiltersPanelSubmitCreate/FiltersPanelSubmitCreate";
import FiltersPanelSubmitUpdate from "../FiltersPanelSubmitUpdate/FiltersPanelSubmitUpdate";
import SaveSearchModal from "../SaveSearchModal/SaveSearchModal";
import SaveSearchSuccessModal from "../SaveSearchSuccessModal/SaveSearchSuccessModal";
import { WithSWNavigatorProps } from "pages/sales-intelligence/hoc/withSWNavigator";
import { WithToastActionsProps } from "pages/sales-intelligence/hoc/withToastActions";
import { WithSearchCreateProps } from "../../../hoc/withSearchCreate";
import { WithSearchUpdateProps } from "../../../hoc/withSearchUpdate";
import { FILTERS_PANEL_TRANSITION_TIMEOUT } from "../../../components/styles";
import FiltersPanelContext from "../../../contexts/filtersPanelContext";
import {
    StyledPanelSubmitSection,
    StyledPanelSubmitSectionInner,
    PANEL_SUBMIT_TRANSITION_PREFIX,
} from "./styles";

export type FiltersPanelSubmitProps = WithSWNavigatorProps &
    WithToastActionsProps &
    WithSearchCreateProps &
    WithSearchUpdateProps & {
        mode: "create" | "update";
        recentlyCreatedSearchId?: string;
        isClearButtonDisabled: boolean;
        numberOfFiltersInBothStates: number;
        onFiltersClear(): void;
    };

const FiltersPanelSubmit = (props: FiltersPanelSubmitProps) => {
    const translate = useTranslation();
    const { isExpanded } = React.useContext(FiltersPanelContext);
    const {
        mode,
        navigator,
        recentlyCreatedSearchId,
        isClearButtonDisabled,
        onFiltersClear,
        numberOfFiltersInBothStates,
        showSuccessToast,
        createSearch,
        updateSearch,
        searchCreating,
        searchUpdating,
        searchCreateError,
        searchUpdateError,
    } = props;
    const [saveNewSearchModalOpened, setSaveNewSearchModalOpened] = React.useState(false);
    const [saveNewSearchSuccessModalOpened, setSaveNewSearchSuccessModalOpened] = React.useState(
        false,
    );

    const handleUpdateClick = () => {
        updateSearch();
    };

    const handleSaveCancel = () => {
        setSaveNewSearchModalOpened(false);
    };

    const handleSaveSubmit = (name: string) => {
        createSearch(name);
    };

    const handleSuccessModalClose = () => {
        setSaveNewSearchSuccessModalOpened(false);

        if (recentlyCreatedSearchId) {
            setTimeout(() => {
                navigator.go(FIND_LEADS_SAVED_SEARCH_ROUTE, { id: recentlyCreatedSearchId });
            }, 0);
        }
    };

    const renderSubmitSectionByMode = (mode: "create" | "update") => {
        if (mode === "create") {
            return (
                <FiltersPanelSubmitCreate
                    onClearClick={onFiltersClear}
                    isClearButtonDisabled={isClearButtonDisabled}
                    isSaveButtonDisabled={numberOfFiltersInBothStates === 0}
                    onSaveClick={() => setSaveNewSearchModalOpened(true)}
                />
            );
        }

        return (
            <FiltersPanelSubmitUpdate
                isUpdating={searchUpdating}
                onUpdateClick={handleUpdateClick}
                isUpdateButtonDisabled={searchUpdating}
                isSaveButtonDisabled={numberOfFiltersInBothStates === 0}
                onSaveClick={() => setSaveNewSearchModalOpened(true)}
            />
        );
    };

    useActionAfterFlagChange(
        searchCreating,
        () => {
            setSaveNewSearchModalOpened(false);
            setSaveNewSearchSuccessModalOpened(true);
        },
        typeof searchCreateError === "undefined",
    );

    useActionAfterFlagChange(
        searchUpdating,
        () => {
            showSuccessToast(translate("si.advanced_search.update_success_toast"));
        },
        typeof searchUpdateError === "undefined",
    );

    return (
        <CSSTransition
            in={!isExpanded}
            timeout={FILTERS_PANEL_TRANSITION_TIMEOUT}
            classNames={PANEL_SUBMIT_TRANSITION_PREFIX}
        >
            <StyledPanelSubmitSection classNamesPrefix={PANEL_SUBMIT_TRANSITION_PREFIX}>
                <SaveSearchModal
                    title={translate(
                        `si.components.save_new_search_modal.${
                            mode === "create" ? "title" : "title_secondary"
                        }`,
                    )}
                    isOpened={saveNewSearchModalOpened}
                    isSubmitting={searchCreating}
                    onCancel={handleSaveCancel}
                    onSubmit={handleSaveSubmit}
                />
                <SaveSearchSuccessModal
                    isOpened={saveNewSearchSuccessModalOpened}
                    onSubmitClick={handleSuccessModalClose}
                />
                <StyledPanelSubmitSectionInner>
                    {renderSubmitSectionByMode(mode)}
                </StyledPanelSubmitSectionInner>
            </StyledPanelSubmitSection>
        </CSSTransition>
    );
};

export default FiltersPanelSubmit;
