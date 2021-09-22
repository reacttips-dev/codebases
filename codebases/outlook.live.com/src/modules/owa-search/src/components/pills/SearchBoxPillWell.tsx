import { observer } from 'mobx-react-lite';
import {
    removePersonAriaLabel,
    fromPersonPillLabel,
    toPersonPillLabel,
    ccPersonPillLabel,
} from './SearchBoxPillWell.locstring.json';
import loc, { format } from 'owa-localize';
import * as React from 'react';
import CategoryPill from './CategoryPill';
import KeyboardCharCodes from 'owa-hotkeys/lib/utils/keyboardCharCodes';
import PersonaPill from './PersonaPill';
import PrivateDistributionListPill from './PrivateDistributionListPill';
import {
    CategorySearchSuggestion,
    PeopleSuggestion,
    PrivateDistributionListSuggestion,
    SuggestionKind,
} from 'owa-search-service/lib/data/schema/SuggestionSet';
import { ControlIcons } from 'owa-control-icons';
import { createDefaultSearchStore, getScenarioStore, SearchScenarioId } from 'owa-search-store';
import { getCategoryColorsForCategory, getMasterCategoryList } from 'owa-categories';
import { Icon } from '@fluentui/react/lib/Icon';
import { IconButton } from '@fluentui/react/lib/Button';
import {
    onLeftArrowPressedSearchInput,
    onRightArrowPressedSearchInput,
    removeSuggestionPillFromSearchBox,
    setSelectedPillIndex,
} from 'owa-search-actions';
import { logUsage } from 'owa-analytics';
import { lazyIsFromPersona, lazyIsToPersona } from '../../index';

import styles from './SearchBoxPillWell.scss';
import classNames from 'classnames';

export interface SearchBoxPillWellProps {
    focusSearchInput: () => void;
    onRemovePill: (pillId: string) => void;
    scenarioId: SearchScenarioId;
}

export default observer(function SearchBoxPillWell(props: SearchBoxPillWellProps) {
    const searchBoxPillWell = React.useRef<HTMLDivElement>();
    const onKeyDown = (evt: React.KeyboardEvent<unknown>) => {
        evt.preventDefault();
        evt.stopPropagation();
        const evtKeyCode = evt.keyCode;
        const scenarioId = props.scenarioId;
        const { suggestionPills, selectedPillIndex, suggestionPillIds } = getScenarioStore(
            scenarioId
        );
        switch (evtKeyCode) {
            case KeyboardCharCodes.Backspace:
            case KeyboardCharCodes.Delete: {
                if (suggestionPills.size > 0) {
                    removeSuggestionPillFromSearchBox(
                        suggestionPillIds[selectedPillIndex],
                        scenarioId,
                        'KeyboardFocusedPill'
                    );
                }
                // If there are no more pills, re-focus search input.
                if (suggestionPills.size === 0) {
                    props.focusSearchInput();
                }
                break;
            }
            case KeyboardCharCodes.Right_arrow: {
                const pillsLength = suggestionPills.size;
                /**
                 * If user already has right-most pill selected, then kick
                 * focus back to SearchInput.
                 */
                if (selectedPillIndex === pillsLength - 1) {
                    props.focusSearchInput();
                    return;
                }
                onRightArrowPressedSearchInput(scenarioId);
                break;
            }
            case KeyboardCharCodes.Left_arrow: {
                onLeftArrowPressedSearchInput(0 /* cursorPosition */, scenarioId);
                break;
            }
            default:
                break;
        }
    };
    const getPersonaPillProperties = (pillId: string, pillIndex: number) => {
        const isPillSelected = getScenarioStore(props.scenarioId).selectedPillIndex === pillIndex;
        const personaPillContainerClassNames = classNames(
            styles.personaPillContainer,
            isPillSelected && styles.selected
        );
        return { personaPillContainerClassNames, isPillSelected };
    };
    const renderPersonaPillIconButton = (pillId: string, personaDisplayName: string) => {
        return (
            <IconButton
                className={styles.removePersonaIcon}
                tabIndex={-1}
                iconProps={{
                    iconName: ControlIcons.Cancel,
                    styles: {
                        root: styles.cancelIcon,
                    },
                }}
                ariaLabel={format(loc(removePersonAriaLabel), personaDisplayName)}
                onClick={onRemovePill(pillId)}
            />
        );
    };
    const onRemovePill = (pillId: string) => {
        return () => props.onRemovePill(pillId);
    };
    const renderPersonaPill = (
        pillId: string,
        persona: PeopleSuggestion,
        pillIndex: number
    ): JSX.Element => {
        const { personaPillContainerClassNames, isPillSelected } = getPersonaPillProperties(
            pillId,
            pillIndex
        );
        return (
            <div key={pillId} className={personaPillContainerClassNames}>
                <PersonaPill
                    name={persona.DisplayName}
                    emailAddress={persona.EmailAddresses[0]}
                    mailBoxType={persona.MailboxType}
                    isSelected={isPillSelected}
                    tabIndex={-1}
                    displayText={getPersonaPillDisplayText(persona, props.scenarioId)}
                />
                {renderPersonaPillIconButton(pillId, persona.DisplayName)}
            </div>
        );
    };
    const renderPrivateDistributionListPill = (
        pillId: string,
        privateDistributionList: PrivateDistributionListSuggestion,
        pillIndex: number
    ): JSX.Element => {
        const { personaPillContainerClassNames, isPillSelected } = getPersonaPillProperties(
            pillId,
            pillIndex
        );
        return (
            <div key={pillId} className={personaPillContainerClassNames}>
                <PrivateDistributionListPill
                    name={privateDistributionList.DisplayName}
                    personas={privateDistributionList.Members}
                    isSelected={isPillSelected}
                />
                {renderPersonaPillIconButton(pillId, privateDistributionList.DisplayName)}
            </div>
        );
    };
    const renderCategoryPill = (
        pillId: string,
        categorySuggestion: CategorySearchSuggestion,
        pillIndex: number
    ): JSX.Element => {
        const categoryName = categorySuggestion.Name;
        const categoryColor = getCategoryColorsForCategory(categoryName, getMasterCategoryList());
        const categoryPillStyle = {
            backgroundColor: categoryColor.primaryColor,
            borderColor: categoryColor.secondaryColor,
            color: categoryColor.textColor,
        };
        const iconStyles = { color: categoryColor.iconColor };
        const iconStylesOnHover = { backgroundColor: categoryColor.secondaryColor };
        const isPillSelected = getScenarioStore(props.scenarioId).selectedPillIndex === pillIndex;
        return (
            <div key={pillId} className={styles.pillContainerCommon} style={categoryPillStyle}>
                <CategoryPill
                    categoryName={categoryName}
                    isSelected={isPillSelected}
                    categoryList={getMasterCategoryList()}
                />
                <Icon
                    styles={{
                        root: [
                            iconStyles,
                            styles.removeIconCommon,
                            styles.cancelIcon,
                            {
                                selectors: {
                                    '&:hover': iconStylesOnHover,
                                },
                            },
                        ],
                    }}
                    iconName={ControlIcons.Cancel}
                    onClick={onRemovePill(pillId)}
                />
            </div>
        );
    };

    const renderPills = (): JSX.Element[] => {
        const store = getScenarioStore(props.scenarioId);
        const pills: JSX.Element[] = [];
        const length = store.suggestionPillIds.length;
        for (let i = 0; i < length; i++) {
            const pillId = store.suggestionPillIds[i];
            const suggestion = store.suggestionPills.get(pillId);
            if (suggestion.kind == SuggestionKind.People) {
                pills.push(renderPersonaPill(pillId, suggestion, i /* pillIndex */));
            } else if (suggestion.kind == SuggestionKind.PrivateDistributionList) {
                pills.push(
                    renderPrivateDistributionListPill(pillId, suggestion, i /* pillIndex */)
                );
            } else if (suggestion.kind == SuggestionKind.Category) {
                pills.push(renderCategoryPill(pillId, suggestion, i /* pillIndex */));
            }
        }
        return pills;
    };
    const onBlur = (evt: React.FocusEvent<EventTarget>) => {
        let relatedTargetElement = evt.relatedTarget as HTMLElement;
        // Fallback for IE, which doesn't always set relatedTarget.
        if (!relatedTargetElement) {
            relatedTargetElement = document.activeElement as HTMLElement;
        }
        /**
         * A way of determining if element that caused JavaScript event is from
         * within the SearchBoxPillWell component.
         */
        const isTargetElementWithinSearchBoxPillWell = searchBoxPillWell.current.contains(
            relatedTargetElement as Node
        );
        // Respond to blur only if blurring outside of component.
        if (!isTargetElementWithinSearchBoxPillWell) {
            setSelectedPillIndex(createDefaultSearchStore().selectedPillIndex, props.scenarioId);
        }
    };
    return (
        <div
            className={styles.searchBoxPillWell}
            tabIndex={-1}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            ref={ref => (searchBoxPillWell.current ? null : (searchBoxPillWell.current = ref))}>
            {renderPills()}
        </div>
    );
});

function getPersonaPillDisplayText(
    persona: PeopleSuggestion,
    scenarioId: SearchScenarioId
): string {
    if (scenarioId == SearchScenarioId.Mail) {
        const isFromPersona = lazyIsFromPersona.tryImportForRender();
        const isFrom = isFromPersona?.(persona);
        const isToPersona = lazyIsToPersona.tryImportForRender();
        const isTo = isToPersona?.(persona);
        const isCc = !!persona.CustomQueryText?.CCKql;
        // If a persona has more than one of from/to/CC properties, only display the name
        if ([isFrom, isTo, isCc].filter(Boolean).length > 1) {
            logUsage('Search_PeoplePill_MultipleTypes', {
                IsFromPersona: isFrom,
                IsToPersona: isTo,
                IsCcPersona: isCc,
                SearchSessionGuid: getScenarioStore(scenarioId).searchSessionGuid,
            });
            return persona.DisplayName;
        }
        if (isFrom) {
            return format(loc(fromPersonPillLabel), persona.DisplayName);
        }
        if (isTo) {
            return format(loc(toPersonPillLabel), persona.DisplayName);
        }
        if (isCc) {
            return format(loc(ccPersonPillLabel), persona.DisplayName);
        }
        // People favorites have none of the above defining fields, but are always "from" pills
        if (persona.PeopleFavorite) {
            return format(loc(fromPersonPillLabel), persona.DisplayName);
        }
        // All personas should have at least one pill type, but it is technically possible to have none
        // If this is being hit, we must investigate why
        logUsage('Search_PeoplePill_NoType', {
            SearchSessionGuid: getScenarioStore(scenarioId).searchSessionGuid,
            hasQueryText: persona.QueryText == null,
            hasCustomQueryText: persona.CustomQueryText == null,
            suggestionSource: persona.Source,
        });
    }
    return persona.DisplayName;
}
