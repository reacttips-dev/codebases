import { observer } from 'mobx-react-lite';
import { toPeopleRefinerTitle } from 'owa-locstrings/lib/strings/topeoplerefinertitle.locstring.json';
import { ccPeopleRefinerTitle } from 'owa-locstrings/lib/strings/ccpeoplerefinertitle.locstring.json';
import { fromPeopleRefinerTitle } from 'owa-locstrings/lib/strings/frompeoplerefinertitle.locstring.json';
import loc from 'owa-localize';
import PeoplePicker from './PeoplePicker';
import { PeopleSearchPrefix } from '../../store/schema/PeopleSearchPrefix';
import { getStore } from '../../store/store';
import type { ReadWriteRecipientViewState } from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';

import * as React from 'react';
import {
    addPersonsAdvancedSearch,
    removePersonAdvancedSearch,
} from '../../actions/internalActions';

export interface PeoplePickersProps {
    useLeftLabel: boolean;
}

export default observer(function PeoplePickers(props: PeoplePickersProps) {
    const { useLeftLabel } = props;
    const {
        fromPeopleSuggestions,
        toPeopleSuggestions,
        ccPeopleSuggestions,
    } = getStore().advancedSearchViewState;
    return (
        <>
            <PeoplePicker
                onItemsAdded={onItemsAdded(PeopleSearchPrefix.From)}
                onItemsRemoved={onItemsRemoved(PeopleSearchPrefix.From)}
                label={loc(fromPeopleRefinerTitle)}
                useLeftLabel={useLeftLabel}
                selectedItems={fromPeopleSuggestions.slice()}
            />
            <PeoplePicker
                onItemsAdded={onItemsAdded(PeopleSearchPrefix.To)}
                onItemsRemoved={onItemsRemoved(PeopleSearchPrefix.To)}
                label={loc(toPeopleRefinerTitle)}
                useLeftLabel={useLeftLabel}
                selectedItems={toPeopleSuggestions.slice()}
            />
            <PeoplePicker
                onItemsAdded={onItemsAdded(PeopleSearchPrefix.CC)}
                onItemsRemoved={onItemsRemoved(PeopleSearchPrefix.CC)}
                label={loc(ccPeopleRefinerTitle)}
                useLeftLabel={useLeftLabel}
                selectedItems={ccPeopleSuggestions.slice()}
            />
        </>
    );
});

function onItemsAdded(pickerType: PeopleSearchPrefix) {
    return (persons: ReadWriteRecipientViewState[]) => {
        addPersonsAdvancedSearch(persons, pickerType);
    };
}

function onItemsRemoved(pickerType: PeopleSearchPrefix) {
    return (persons: ReadWriteRecipientViewState[]) => {
        removePersonAdvancedSearch(persons[0], pickerType);
    };
}
