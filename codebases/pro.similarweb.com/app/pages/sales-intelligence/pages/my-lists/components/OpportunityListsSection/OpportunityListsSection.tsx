import React, { useEffect, useState } from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { goToListPage } from "../../../../helpers/helpers";
import withSWNavigator, { WithSWNavigatorProps } from "../../../../hoc/withSWNavigator";
import { OpportunityListType } from "../../../../sub-modules/opportunities/types";
import OpportunityListItem from "../../../../sub-modules/opportunities/components/OpportunityListItem/OpportunityListItem";
import ListsSection from "../ListsSection/ListsSection";
import ListsSectionLoader from "../ListsSection/ListsSectionLoader";
import AddListButton from "../AddListButton/AddListButton";
import OpportunityListsSectionEmpty from "./OpportunityListsSectionEmpty";

type OpportunityListsSectionProps = WithSWNavigatorProps & {
    loading: boolean;
    opportunityLists: OpportunityListType[];
    onAddListClick(): void;
};

const OpportunityListsSection: React.FC<OpportunityListsSectionProps> = (props) => {
    const { loading, opportunityLists, navigator, onAddListClick } = props;
    const [list, setList] = useState([]);

    useEffect(() => {
        opportunityLists &&
            setList(
                opportunityLists.sort((a, b) => a?.friendlyName.localeCompare(b?.friendlyName)),
            );
    }, [opportunityLists]);

    const translate = useTranslation();

    const sectionName = React.useMemo(
        () => translate("si.pages.my_lists.section.opportunity_lists.title"),
        [translate],
    );

    const handleItemClick = React.useCallback(goToListPage(navigator), [navigator]);
    const getListId = React.useCallback((list: OpportunityListType) => {
        return list.opportunityListId;
    }, []);

    const renderAddListButton = React.useCallback(() => {
        return <AddListButton onClick={onAddListClick} />;
    }, [onAddListClick]);

    if (loading) {
        return <ListsSectionLoader />;
    }

    if (opportunityLists.length === 0) {
        return (
            <OpportunityListsSectionEmpty
                name={sectionName}
                renderAddListButton={renderAddListButton}
            />
        );
    }

    return (
        <ListsSection
            items={list}
            includesQuota
            name={sectionName}
            extractId={getListId}
            onItemClick={handleItemClick}
            ListItemComponent={OpportunityListItem}
            dataAutomation="si-static-lists-section"
            renderActionComponent={renderAddListButton}
        />
    );
};

export default withSWNavigator(OpportunityListsSection);
