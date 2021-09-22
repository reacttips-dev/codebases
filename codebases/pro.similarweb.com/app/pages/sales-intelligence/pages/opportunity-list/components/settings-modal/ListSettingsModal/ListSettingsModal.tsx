import React from "react";
import { ProModal } from "components/Modals/src/ProModal";
import { Button } from "@similarweb/ui-components/dist/button";
import { usePrevious } from "components/hooks/usePrevious";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { areArraysOfStringsEqual } from "../../../../../helpers/helpers";
import { MY_LISTS_PAGE_ROUTE } from "../../../../../constants/routes";
import { WithSWNavigatorProps } from "../../../../../hoc/withSWNavigator";
import { ListSettingsModal } from "../../../../../sub-modules/opportunities/types";
import OpportunityListPageContext from "../../../context/OpportunityListPageContext";
import { StyledModalTitle, StyledSubmitSection } from "../styles";
import {
    removeOpportunityList,
    toggleOpportunityListSettingsModal,
} from "../../../../../sub-modules/opportunities/store/action-creators";
import ListSettingsInfo from "../ListSettingsInfo/ListSettingsInfo";

type ListSettingsModalProps = WithSWNavigatorProps & {
    modal: ListSettingsModal;
    toggleModal(...args: Parameters<typeof toggleOpportunityListSettingsModal>): void;
    onOpportunityListRemove(...args: Parameters<typeof removeOpportunityList>): void;
};

const CUSTOM_MODAL_STYLES = {
    content: { padding: 0, width: 540 },
};
const ListSettingsModal = (props: ListSettingsModalProps) => {
    const translate = useTranslation();
    const { modal, toggleModal, navigator, onOpportunityListRemove } = props;
    const {
        list,
        deleteList,
        updateList,
        listDeleting,
        listUpdating,
        listDeleteError,
        updateListSettings,
    } = React.useContext(OpportunityListPageContext);
    const previousDeleting = usePrevious(listDeleting);
    const previousUpdating = usePrevious(listUpdating);

    const [listName, setListName] = React.useState(list.friendlyName);
    const [metrics, setMetrics] = React.useState(list.settings.alerts.metrics);

    const closeModal = React.useCallback(() => toggleModal(false), [toggleModal]);
    const handleListUpdate = React.useCallback(() => {
        let shouldCloseModal = true;
        const newName = listName.trim();

        if (newName !== list.friendlyName) {
            shouldCloseModal = false;

            updateList(list.opportunityListId, {
                friendlyName: newName,
                country: list.country, // TODO: Talk to BE to make this optional
            });
        }

        if (!areArraysOfStringsEqual(list.settings.alerts.metrics, metrics)) {
            shouldCloseModal = false;

            updateListSettings(list, {
                alerts: {
                    ...list.settings.alerts,
                    metrics,
                },
            });
        }

        if (shouldCloseModal) {
            closeModal();
        }
    }, [list, listName, updateList, metrics]);
    const handleListDelete = React.useCallback(() => {
        deleteList(list.opportunityListId);
    }, [list.opportunityListId, deleteList]);
    const handleMetricToggle = React.useCallback(
        (metric: string) => {
            if (metrics.includes(metric)) {
                return setMetrics(metrics.filter((m) => m !== metric));
            }

            setMetrics([metric, ...metrics]);
        },
        [metrics],
    );

    // Reacting to update complete
    React.useEffect(() => {
        if (
            typeof previousUpdating !== "undefined" &&
            previousUpdating !== listUpdating &&
            !listUpdating
        ) {
            closeModal();
        }
    }, [listUpdating]);

    // Reacting to delete complete
    React.useEffect(() => {
        if (
            typeof previousDeleting !== "undefined" &&
            previousDeleting !== listDeleting &&
            !listDeleting
        ) {
            if (typeof listDeleteError === "undefined") {
                closeModal();
                navigator.go(MY_LISTS_PAGE_ROUTE, {}, { location: "replace" });

                // Schedule list removal from store
                setTimeout(() => {
                    onOpportunityListRemove(list.opportunityListId);
                }, 0);
            }
            // TODO: Discuss how to handle "else"
        }
    }, [listDeleting]);

    return (
        <ProModal
            isOpen={modal.isOpen}
            onCloseClick={closeModal}
            customStyles={CUSTOM_MODAL_STYLES}
        >
            <div>
                <StyledModalTitle>
                    <span>{translate("si.components.list_settings_modal.title")}</span>
                </StyledModalTitle>
                <ListSettingsInfo
                    metrics={metrics}
                    listName={listName}
                    listDeleting={listDeleting}
                    onDeleteClick={handleListDelete}
                    onListNameChange={setListName}
                    onMetricToggle={handleMetricToggle}
                />
                <StyledSubmitSection>
                    <Button
                        type="primary"
                        isLoading={listUpdating}
                        onClick={handleListUpdate}
                        isDisabled={listName.trim().length === 0 || listUpdating || listDeleting}
                    >
                        {translate("si.components.list_settings_modal.button.save")}
                    </Button>
                </StyledSubmitSection>
            </div>
        </ProModal>
    );
};

export default ListSettingsModal;
