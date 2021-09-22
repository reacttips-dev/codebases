import React, { useEffect, useState } from "react";
import { Injector } from "common/ioc/Injector";
import { usePrevious } from "components/hooks/usePrevious";
import { IAutoCompleteService } from "services/autocomplete.service";
import { WebsitesModal } from "pages/workspace/common components/Modals/src/WebsitesModal";
import { OpportunityListModalContainerProps } from "./OpportunityListModalContainer";

const WebsitesModalWrapper: React.FC<OpportunityListModalContainerProps> = ({
    modal,
    toggleModalOpen,
    listCreating,
    listUpdating,
    createList,
    updateListOpportunitiesAndReFetch,
}) => {
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
    const prevCreating = usePrevious(listCreating);
    const prevUpdating = usePrevious(listUpdating);

    const changeNameHandler = (listName: string | undefined): void => {
        if (listName.replace(/\s/g, "").length >= 2) {
            setIsSaveDisabled(false);
            return;
        }
        setIsSaveDisabled(true);
    };

    const closeModal = React.useCallback(() => {
        toggleModalOpen(false);
    }, [toggleModalOpen]);
    // Angular injected services
    const services = React.useMemo(() => {
        return {
            sitesResource: Injector.get<any>("sitesResource"),
            autocompleteService: Injector.get<IAutoCompleteService>("autoCompleteService"),
        };
    }, []);
    // This is how WebsitesModal works
    const getListName = (): string => {
        if (typeof modal.list === "undefined") {
            return "";
        }

        return modal.list.friendlyName;
    };
    // This is how WebsitesModal works
    const getListId = (): string => {
        if (typeof modal.list === "undefined") {
            return "overview";
        }

        return modal.list.opportunityListId;
    };

    const handleSubmit = React.useCallback(
        (domains: { Domain: string }[], name: string) => {
            if (typeof modal.list === "undefined") {
                createList(name, domains);
            } else {
                updateListOpportunitiesAndReFetch(modal.list, {
                    opportunities: domains.map((d) => d.Domain),
                });
            }
        },
        [modal.list, createList, updateListOpportunitiesAndReFetch],
    );

    React.useEffect(() => {
        if (typeof prevCreating !== "undefined" && prevCreating !== listCreating && !listCreating) {
            toggleModalOpen(false);
        }
    }, [listCreating]);

    React.useEffect(() => {
        if (typeof prevUpdating !== "undefined" && prevUpdating !== listUpdating && !listUpdating) {
            toggleModalOpen(false);
        }
    }, [listUpdating]);

    React.useEffect(() => {
        setIsSaveDisabled(!!getListName());
    }, []);

    return (
        <WebsitesModal
            isOpen={modal.isOpen}
            onSave={handleSubmit}
            listName={getListName()}
            activeListId={getListId()}
            onCloseClick={closeModal}
            onCancelClick={closeModal}
            sitesResource={services.sitesResource}
            autoCompleteService={services.autocompleteService}
            modalPlaceholder="si.components.list_modal.name_placeholder"
            placeholder="si.components.list_modal.websites_section.placeholder"
            isSaveDisabled={isSaveDisabled}
            onListNameChange={changeNameHandler}
        />
    );
};

export default WebsitesModalWrapper;
