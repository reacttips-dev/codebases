import { emailButtonLabel } from 'owa-locstrings/lib/strings/emailbuttonlabel.locstring.json';
import {
    personaHeaderViewProfilebutton,
    personaHeaderViewChatButtonLabel,
} from './getMailListHeader.locstring.json';
import {
    searchResults,
    searchResultsFromArchive,
} from 'owa-locstrings/lib/strings/searchresults.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import {
    PRIMARY_DUMPSTER_DISTINGUISHED_ID,
    ARCHIVE_DUMPSTER_DISTINGUISHED_ID,
    PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID,
    ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID,
} from 'owa-folders-constants';
import { lazyInitializeThirdRow } from 'owa-mail-list-view';
import MailListFolderHeaderSecondRowContent from 'owa-mail-list-view/lib/components/listHeaders/MailListFolderHeaderSecondRowContent';
import MailListHeader from 'owa-mail-list-view/lib/components/MailListHeader';
import MailListHeaderSecondRowTextContent from 'owa-mail-list-view/lib/components/listHeaders/MailListHeaderSecondRowTextContent';
import MailListHeaderSelectionRowContent from 'owa-mail-list-view/lib/components/listHeaders/MailListHeaderSelectionRowContent';
import type { SearchTableQuery } from 'owa-mail-list-search';
import { BulkActionProgressBar } from 'owa-mail-bulk-action-view';
import { getSelectedNode } from 'owa-mail-folder-forest-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import { MailListCategoryHeaderSecondRowContent } from 'owa-mail-category-view';
import {
    PersonaHeader,
    MultiPersonaHeader,
    HeaderButtonData,
} from 'owa-people-persona-header-view';

import {
    getViewFilterForTable,
    listViewStore,
    TableQueryType,
    TableView,
} from 'owa-mail-list-store';
import {
    SearchHeaderFirstRowContent,
    SearchFiltersContainer,
    isInteractiveFiltersEnabled,
} from 'owa-mail-search';
import shouldShowModifiedQueryInformationalView from 'owa-mail-search/lib/utils/shouldShowModifiedQueryInformationalView';
import { SearchHeaderType } from 'owa-mail-search/lib/store/schema/SearchHeaderType';
import { getHeaderPersonaData } from '../selectors/getHeaderPersonaData';
import { getMultiPersonaHeaderData } from '../selectors/getMultiPersonaHeaderData';
import shouldShowCategoryHeader from '../selectors/shouldShowCategoryHeader';
import { isFolderUnderArchiveRoot, ActionSource } from 'owa-mail-store';
import { shouldShowSinglePersonaHeader } from '../selectors/shouldShowSinglePersonaHeader';
import { shouldShowMultiPersonaHeader } from '../selectors/shouldShowMultiPersonaHeader';
import { FolderForestNodeType } from 'owa-favorites-types';
import folderStore, { getEffectiveFolderDisplayName } from 'owa-folders';
import { SearchScopeKind } from 'owa-search-service/lib/data/schema/SearchScope';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import { ControlIcons } from 'owa-control-icons';
import { logUsage } from 'owa-analytics';
import { lazyNewMessage } from 'owa-mail-message-actions';
import { GroupHeaderV2 } from 'owa-group-header-view';
import { getCurrentGroupInformationStore } from 'owa-groups-shared-store/lib/CurrentGroupInformationStore';
import { isEmailAddressBrand } from 'owa-persona/lib/utils/isEmailAddressBrand';
import { ErrorBoundary, ErrorComponentType } from 'owa-error-boundary';
import { isBulkActionValid } from 'owa-bulk-action-store';
import { isReadingPanePositionOff } from 'owa-mail-layout';
import { getUserConfiguration } from 'owa-session-store';

/**
 * Gets the appropriate mail list header based on the tableView properties
 * @param tableViewId tableView id
 * @param styleSelectorAsPerUserSettings css styles for the component when density flight is enabled
 * @return returns a header component
 */
export default function getMailListHeader(
    tableViewId: string,
    styleSelectorAsPerUserSettings: string
): JSX.Element {
    const tableView = listViewStore.tableViews.get(tableViewId);
    const selectedNode = getSelectedNode();
    const isSearchTable = tableView.tableQuery.type == TableQueryType.Search;
    const shouldShowSearchHeader =
        isSearchTable || selectedNode.type == FolderForestNodeType.Search;
    const currentSelectedFilter = getViewFilterForTable(tableView);

    if (tableView.tableQuery.type == TableQueryType.Group) {
        const groupId = getCurrentGroupInformationStore().smtpAddress;
        if (isFeatureEnabled('grp-groupHeaderV2')) {
            return <GroupHeaderV2 groupId={groupId} />;
        }

        // TODO 89653: Add Group Header with Filters
        return null;
    }

    // When reading pane is hidden the selection related information needs to be shown
    // in selection header on top of list view
    const shouldShowSelectionHeader =
        isReadingPanePositionOff() &&
        ((tableView.isInCheckedMode && tableView.selectedRowKeys.size > 0) ||
            tableView.isInVirtualSelectAllMode);

    if (shouldShowMultiPersonaHeader(isSearchTable, tableViewId, selectedNode)) {
        const multiHeaderData = getMultiPersonaHeaderData(isSearchTable, tableViewId, selectedNode);

        return multiHeaderData ? (
            <ErrorBoundary
                type={
                    isFeatureEnabled('fwk-devTools')
                        ? ErrorComponentType.Full
                        : ErrorComponentType.None
                }>
                <MultiPersonaHeader
                    displayName={multiHeaderData.displayName}
                    personas={multiHeaderData.personas}
                    favoriteActionSource={multiHeaderData.origin}
                    pdlId={multiHeaderData.pdlId}
                    owsPersonaId={multiHeaderData.owsPersonaId}
                    hideFilter={currentSelectedFilter == null}
                    isInSearch={shouldShowSearchHeader}
                />
            </ErrorBoundary>
        ) : null;
    }

    if (shouldShowSinglePersonaHeader(isSearchTable, tableViewId, selectedNode)) {
        const headerPersona = getHeaderPersonaData(isSearchTable, tableViewId, selectedNode);

        // VSO 23726 - Refactor Persona header to use MailListHeader and only have custom content defined as components
        return (
            <ErrorBoundary
                type={
                    isFeatureEnabled('fwk-devTools')
                        ? ErrorComponentType.Full
                        : ErrorComponentType.None
                }>
                <PersonaHeader
                    isInSearch={shouldShowSearchHeader}
                    hideFilter={currentSelectedFilter == null}
                    personaId={headerPersona.personaId}
                    personEmail={headerPersona.email}
                    personName={headerPersona.displayName}
                    favoriteActionSource={headerPersona.origin}
                    mailboxType={headerPersona.mailboxType}
                    headerButtonData={getActionButtonData(
                        headerPersona.email,
                        headerPersona.displayName,
                        headerPersona.imAddress
                    )}
                    headerActionsStylesAsPerUserSettings={styleSelectorAsPerUserSettings}
                />
            </ErrorBoundary>
        );
    }

    let renderFirstRow: (mailListFirstRowCssClass: string) => any = null;
    let renderSecondRowContent: (containerCssClass: string) => any = null;
    let renderThirdRow: (mailListThirdRowCssClass: string) => any = null;
    let renderBulkActionProgressBar: () => any = null;
    let shouldShowFilterMenu: boolean = true;
    let shouldShowSecondRowLeftEntity: boolean = true;
    const filterMenuSource: ActionSource = 'MailFilterMenu';

    // We pass categoryHeaderData so that we do not run the same logic twice
    // first to determine if the header should be shown and next to determine the name of the category
    const categoryHeaderData = { categoryName: null };
    if (shouldShowCategoryHeader(tableView, categoryHeaderData)) {
        shouldShowFilterMenu = false;

        if (shouldShowSearchHeader) {
            renderFirstRow = (mailListFirstRowCssClass: string) => {
                return React.createElement(SearchHeaderFirstRowContent, {
                    className: mailListFirstRowCssClass,
                    showModifiedQueryInformation: shouldShowModifiedQueryInformationalView(
                        SearchHeaderType.Category
                    ),
                });
            };
        }

        const categoryName = categoryHeaderData.categoryName;
        if (shouldShowSelectionHeader) {
            renderSecondRowContent = getSelectionHeader(tableView);
        } else {
            renderSecondRowContent = (containerCssClass: string) => {
                return (
                    <>
                        <MailListCategoryHeaderSecondRowContent
                            key={categoryName}
                            categoryName={categoryName}
                            containerCssClass={containerCssClass}
                        />
                        {isInteractiveFiltersEnabled() && shouldShowSearchHeader && (
                            <SearchFiltersContainer />
                        )}
                    </>
                );
            };
        }
    } else if (shouldShowSearchHeader) {
        shouldShowFilterMenu = currentSelectedFilter != null && !isInteractiveFiltersEnabled();

        renderFirstRow = (mailListFirstRowCssClass: string) => {
            return React.createElement(SearchHeaderFirstRowContent, {
                className: mailListFirstRowCssClass,
            });
        };

        if (shouldShowSelectionHeader) {
            renderSecondRowContent = getSelectionHeader(tableView);
        } else {
            renderSecondRowContent = (containerCssClass: string) => {
                const searchScope = (tableView.tableQuery as SearchTableQuery).searchScope;
                const searchResultHeaderText =
                    searchScope && searchScope.kind == SearchScopeKind.ArchiveMailbox
                        ? loc(searchResultsFromArchive)
                        : loc(searchResults);
                return (
                    <>
                        <MailListHeaderSecondRowTextContent
                            text={searchResultHeaderText}
                            containerCssClass={containerCssClass}
                        />
                        {isInteractiveFiltersEnabled() && <SearchFiltersContainer />}
                    </>
                );
            };
        }
    } else {
        const folderId = tableView.tableQuery.folderId;
        let dumpsterFolderDistinguishedId;
        let dumpsterFolderId;
        let deletedItemsFolderDistinguishedId;
        let treeType;
        if (isFolderUnderArchiveRoot(folderId)) {
            dumpsterFolderDistinguishedId = ARCHIVE_DUMPSTER_DISTINGUISHED_ID;
            dumpsterFolderId = folderNameToId(ARCHIVE_DUMPSTER_DISTINGUISHED_ID);
            treeType = 'archiveFolderTree';
            deletedItemsFolderDistinguishedId = ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID;
        } else {
            dumpsterFolderDistinguishedId = PRIMARY_DUMPSTER_DISTINGUISHED_ID;
            dumpsterFolderId = folderNameToId(PRIMARY_DUMPSTER_DISTINGUISHED_ID);
            treeType = 'primaryFolderTree';
            deletedItemsFolderDistinguishedId = PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID;
        }
        const isDumpsterTable = dumpsterFolderId === folderId;
        const isNotesFolder = folderIdToName(folderId) === 'notes';
        shouldShowFilterMenu = !isDumpsterTable && !isNotesFolder;

        renderThirdRow = (containerCssClass: string) => {
            const initializeThirdRow = lazyInitializeThirdRow.tryImportForRender();
            return initializeThirdRow?.(
                dumpsterFolderDistinguishedId,
                dumpsterFolderId,
                deletedItemsFolderDistinguishedId,
                folderId,
                treeType,
                styleSelectorAsPerUserSettings,
                containerCssClass,
                tableView
            );
        };

        if (isDumpsterTable) {
            renderSecondRowContent = (containerCssClass: string) => {
                return React.createElement(
                    MailListHeaderSecondRowTextContent,
                    {
                        text: getEffectiveFolderDisplayName(
                            folderStore.folderTable.get(dumpsterFolderId)
                        ),
                        containerCssClass: containerCssClass,
                        showFavoriteToggle: false,
                    },
                    null /* children */
                );
            };
        }
        // This checks whether the second row has been set. This is possible if:
        // The dumpster flag is off OR
        // We are in a non-dumpster folder
        if (!renderSecondRowContent) {
            if (shouldShowSelectionHeader) {
                renderSecondRowContent = getSelectionHeader(tableView);
            } else {
                // don't show checkbox in second row for Sticky Notes experience in Notes folder
                if (isNotesFolder && isFeatureEnabled('notes-folder-view')) {
                    shouldShowSecondRowLeftEntity = false;
                }
                renderSecondRowContent = (containerCssClass: string) => {
                    return React.createElement(
                        MailListFolderHeaderSecondRowContent,
                        {
                            tableViewId: tableViewId,
                            containerCssClass: containerCssClass,
                            mailListHeaderStylesAsPerUserSettings: styleSelectorAsPerUserSettings,
                        },
                        null /* children */
                    );
                };
            }
        }

        // Show bulk action progress bar there is a valid bulk operation running on that folder
        if (isBulkActionValid(folderId)) {
            renderBulkActionProgressBar = () => {
                return React.createElement(BulkActionProgressBar);
            };
        }
    }

    return React.createElement(
        MailListHeader,
        {
            tableViewId: tableViewId,
            shouldShowFilterMenu: shouldShowFilterMenu,
            shouldShowSecondRowLeftEntity: shouldShowSecondRowLeftEntity,
            filterMenuSource: filterMenuSource,
            renderFirstRow: renderFirstRow,
            renderSecondRowCustomContent: renderSecondRowContent,
            renderThirdRow: renderThirdRow,
            renderBulkActionProgressBar: renderBulkActionProgressBar,
            mailListHeaderStylesAsPerUserSettings: styleSelectorAsPerUserSettings,
        },
        null /* children */
    );
}

function getActionButtonData(
    personaEmail: string,
    personaName: string,
    personaImAddress?: string
): HeaderButtonData[] {
    const actionButtonData: HeaderButtonData[] = [
        {
            icon: ControlIcons.Mail,
            text: loc(emailButtonLabel),
            clickCallback: () => handleEmailClick(personaEmail, personaName),
        },
    ];

    // Determine whether the IM address belongs to the current user, in which case a chat option should not be shown
    const userPrincipalName = getUserConfiguration()?.SessionSettings?.UserPrincipalName || '';
    const isCurrentUser =
        userPrincipalName &&
        personaImAddress &&
        personaImAddress.toLowerCase().indexOf(userPrincipalName.toLowerCase()) !== -1;

    // VSO 117548 - Allow a personaImAddress derived from the email address of a person in the same enterprise tenant
    // logUsage from button clicks should note whether the source was a people-centric search or a person favorite
    if (isFeatureEnabled('sea-peopleQueryTeamsChat') && !isCurrentUser && personaImAddress) {
        actionButtonData.push({
            icon: ControlIcons.Chat,
            text: loc(personaHeaderViewChatButtonLabel),
            clickCallback: () => handleTeamsClick(personaImAddress),
        });
    } else {
        actionButtonData.push({
            icon: ControlIcons.ContactCard,
            text: loc(personaHeaderViewProfilebutton),
            isLPCWrapped: true,
            lpcClientScenario: 'PersonaHeaderProfileButton',
            personaEmail,
            personaName,
            lpcLocationToOpen: isEmailAddressBrand(personaEmail) ? undefined : 'ExpandedView',
            clickCallback: () => {
                logUsage('ViewProfileFromHeader');
            },
        });
    }

    return actionButtonData;
}

function handleEmailClick(personaEmail: string, personaName: string) {
    logUsage('MailComposeFromHeader');

    lazyNewMessage.importAndExecute('PersonaHeader', null /*groupId*/, [
        { EmailAddress: personaEmail, Name: personaName },
    ]);
}

function handleTeamsClick(personaImAddress: string) {
    logUsage('StartChatFromHeader');
    window.open(personaImAddress);
}

function getSelectionHeader(tableView: TableView) {
    return (containerCssClass: string) => {
        return React.createElement(
            MailListHeaderSelectionRowContent,
            {
                numChecked: tableView.selectedRowKeys.size,
                containerCssClass: containerCssClass,
                tableViewId: tableView.id,
                folderId: tableView.tableQuery.folderId,
            },
            null /* children */
        );
    };
}
