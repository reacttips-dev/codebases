import * as React from 'react';
import { observer } from 'mobx-react-lite';
import isSharedFolderSearch from '../../utils/isSharedFolderSearch';
import { setShouldShowAdvancedSearch } from '../../actions/publicActions';
import AdvancedSearch from './AdvancedSearch';
import getAdvancedSearchButtonStrings from '../../selectors/getAdvancedSearchButtonStrings';
import { getStore } from '../../store/store';
import { AriaProperties, AriaRoles, generateDomPropertiesForAria } from 'owa-accessibility';
import { logUsage } from 'owa-analytics';
import { FILTERS_BUTTON_ID } from '../../searchConstants';
import { SearchScenarioId } from 'owa-search-store';
import { IconButton } from '@fluentui/react/lib/Button';
import { ControlIcons } from 'owa-control-icons';

import styles from './AdvancedSearchWrapper.scss';

export default observer(function AdvancedSearchWrapper(props: {}) {
    const onClick = (evt: React.MouseEvent<unknown>) => {
        evt.stopPropagation();
        // Determine Advanced Search visiblity.
        const shouldShowAdvancedSearch = getStore().shouldShowAdvancedSearch;
        const newVisibility = !shouldShowAdvancedSearch;
        // Log click on filters button, and if the click is to show or hide UI.
        logUsage('Search_AdvancedSearchButtonClicked', [newVisibility, SearchScenarioId.Mail]);
        // Set visiblity of advanced search UI.
        setShouldShowAdvancedSearch(newVisibility);
    };

    const advancedSearchButtonStrings = getAdvancedSearchButtonStrings();
    const shouldShowAdvancedSearch = getStore().shouldShowAdvancedSearch;
    const ariaProperties: AriaProperties = {
        role: AriaRoles.button,
        hasPopup: true,
        label: advancedSearchButtonStrings.ariaLabel,
        expanded: shouldShowAdvancedSearch,
    };

    // In case of shared folders, attachment refiner is not supported.
    const showAttachmentRefiner = !isSharedFolderSearch();

    return (
        <>
            <IconButton
                id={FILTERS_BUTTON_ID}
                title={advancedSearchButtonStrings.buttonTitle}
                className={styles.refinersButton}
                onClick={onClick}
                {...generateDomPropertiesForAria(ariaProperties)}
                iconProps={{
                    iconName: ControlIcons.ChevronDown,
                }}
            />

            {shouldShowAdvancedSearch && (
                <AdvancedSearch showAttachmentRefiner={showAttachmentRefiner} />
            )}
        </>
    );
});
