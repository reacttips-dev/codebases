import { suggestionSecondaryActionSelected } from 'owa-search-actions';
import type { SearchScenarioId } from 'owa-search-store';
import getHighlightedTextForSuggestion from '../../../utils/getHighlightedTextForSuggestion';
import getIsFileImmersiveViewSupported from '../../../utils/getIsFileImmersiveViewSupported';
import highlightDisplayText from '../../../utils/highlightDisplayText';
import OpenInNewTabSuggestion from '../OpenInNewTabSuggestion';
import SearchSuggestion from '../searchSuggestion/SearchSuggestion';
import { Icon } from '@fluentui/react/lib/Icon';
import { observer } from 'mobx-react-lite';
import { IButtonStyles, IconButton } from '@fluentui/react/lib/Button';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { DirectionalHint } from '@fluentui/react/lib/Callout';
import { isAttachmentOfFileType } from 'owa-attachment-type/lib/isAttachmentOfFileType';
import { AccessIssue, getCombinedAccessIssue } from 'owa-attachment-policy-access-issue-checker';
import { ControlIcons } from 'owa-control-icons';
import { differenceInSeconds, formatPastRelativeDateTime, owaDate, OwaDate } from 'owa-datetime';
import abbreviatedFormatDuration from 'owa-duration-formatter/lib/abbreviated';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getIconForFile } from 'owa-file-icon';
import loc, { format } from 'owa-localize';
import { formatRelativeDate, observableNow } from 'owa-observable-datetime';
import type { FileSuggestion } from 'owa-search-service';
import * as React from 'react';
import {
    CLICK_ACTION_SOURCE,
    LARGE_SUGGESTION_HEIGHT,
    SMALL_SUGGESTION_HEIGHT,
} from 'owa-search-constants';
import {
    sharebyEmail_quickAction,
    download_quickAction,
    copyLink_quickAction,
    classicAttachment_secondaryText_2,
    modernAndCloudyAttachment_secondaryText_2,
    openedAgo_1,
} from './FileSearchSuggestion.locstring.json';
import isModernFilesEnabled from '../../../utils/isModernFilesEnabled';
import styles from './FileSearchSuggestion.scss';
import universalSuggestionStyles from '../searchSuggestion/SearchSuggestion.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(universalSuggestionStyles);

export interface FileSearchSuggestionProps {
    index: number;
    scenarioId: SearchScenarioId;
    suggestion: FileSuggestion;
    suggestionSetTraceId: string;
    focusSearchInput?: () => void;
}

export default observer(function FileSearchSuggestion(props: FileSearchSuggestionProps) {
    const { index, scenarioId, suggestion, suggestionSetTraceId, focusSearchInput } = props;

    const wasSentViaEmail = suggestion.FileType === 'Attachment' || suggestion.FileType === 'Link';

    const getQuickActions = () => {
        const copyFileLink = ev => {
            ev.stopPropagation();
            const { suggestion, scenarioId, index, suggestionSetTraceId } = props;
            suggestionSecondaryActionSelected(
                suggestion,
                index,
                CLICK_ACTION_SOURCE,
                scenarioId,
                suggestionSetTraceId,
                'CopyLink' /*EntityActionTakenType*/
            );
        };

        const shareFromSearch = ev => {
            ev.stopPropagation();
            const { suggestion, scenarioId, index, suggestionSetTraceId } = props;
            suggestionSecondaryActionSelected(
                suggestion,
                index,
                CLICK_ACTION_SOURCE,
                scenarioId,
                suggestionSetTraceId,
                'Share' /*EntityActionTakenType*/
            );
        };

        const downloadFromSearch = ev => {
            ev.stopPropagation();
            const { suggestion, scenarioId, index, suggestionSetTraceId } = props;
            suggestionSecondaryActionSelected(
                suggestion,
                index,
                CLICK_ACTION_SOURCE,
                scenarioId,
                suggestionSetTraceId,
                'Download' /*EntityActionTakenType*/
            );
        };

        const quickActionButtonStyles: IButtonStyles = {
            root: {
                height: LARGE_SUGGESTION_HEIGHT,
            },
        };

        const shareByEmailQuickAction = (
            <TooltipHost
                content={loc(sharebyEmail_quickAction)}
                directionalHint={DirectionalHint.topCenter}
                id={`shareFileButton-${index}`}>
                <IconButton
                    iconProps={{
                        iconName: ControlIcons.Share,
                    }}
                    className={universalSuggestionStyles.suggestionIconButton}
                    onClick={shareFromSearch}
                    aria-describedby={`shareFileButton-${index}`}
                    styles={quickActionButtonStyles}
                    aria-label={loc(sharebyEmail_quickAction)}
                />
            </TooltipHost>
        );

        const downloadAttachmentQuickAction = (
            <TooltipHost
                content={loc(download_quickAction)}
                directionalHint={DirectionalHint.topCenter}
                id={`downloadFileButton-${index}`}>
                <IconButton
                    iconProps={{
                        iconName: ControlIcons.Download,
                    }}
                    className={universalSuggestionStyles.suggestionIconButton}
                    onClick={downloadFromSearch}
                    aria-describedby={`downloadFileButton-${index}`}
                    aria-label={loc(download_quickAction)}
                    styles={quickActionButtonStyles}
                />
            </TooltipHost>
        );

        const copyLinkQuickAction = (
            <TooltipHost
                content={loc(copyLink_quickAction)}
                directionalHint={DirectionalHint.topCenter}
                id={`copyLinkButton-${index}`}>
                <IconButton
                    iconProps={{
                        iconName: ControlIcons.Link,
                    }}
                    className={universalSuggestionStyles.suggestionIconButton}
                    onClick={copyFileLink}
                    aria-describedby={`copyLinkButton-${index}`}
                    styles={quickActionButtonStyles}
                    aria-label={loc(copyLink_quickAction)}
                />
            </TooltipHost>
        );

        const quickActions = [];

        if (wasSentViaEmail) {
            const attachmentAccess = getCombinedAccessIssue();
            if (attachmentAccess === AccessIssue.None) {
                quickActions.push(downloadAttachmentQuickAction);
            }
        } else {
            quickActions.push(copyLinkQuickAction);
        }

        quickActions.push(shareByEmailQuickAction);

        return quickActions;
    };

    const fileIcon = getIconForFile(suggestion.FileName);
    const filenameTextToHighlight = highlightDisplayText(suggestion.HighlightedDisplayText);
    const secondaryText = getSecondaryText(suggestion, wasSentViaEmail);

    const isClassicAttachment = isAttachmentOfFileType(suggestion.AttachmentType);
    const showQuickActions =
        isFeatureEnabled('sea-fileSuggestionQuickActions') &&
        (isClassicAttachment || suggestion.FileType === 'File');
    const quickActions = showQuickActions ? getQuickActions() : [];
    const secondaryTextToHighlight = highlightDisplayText(secondaryText);
    const lastAccessedTimeElement = getLastAccessedTime(suggestion);
    const isImmersiveViewSupported = getIsFileImmersiveViewSupported(suggestion);

    const fileDateTimeStyle: React.CSSProperties = {
        lineHeight: `${SMALL_SUGGESTION_HEIGHT}px`,
    };

    const content = (
        <div className={styles.container}>
            <div className={styles.fileIconContainer}>
                <i className={fileIcon.small} />
            </div>
            <div className={styles.fileContentContainer}>
                <div className={styles.fileName}>
                    {getHighlightedTextForSuggestion(filenameTextToHighlight)}
                </div>
                <div className={styles.fileAuthorOrSender}>
                    {getHighlightedTextForSuggestion(secondaryTextToHighlight)}
                </div>
            </div>
            {!isImmersiveViewSupported && (
                <Icon
                    className={classNames(
                        universalSuggestionStyles.icon,
                        universalSuggestionStyles.newTabIcon
                    )}
                    iconName={ControlIcons.OpenInNewTab}
                />
            )}
            {suggestion.FileType === 'File' && quickActions.length === 0 && lastAccessedTimeElement}
            {suggestion.LayoutHint === 'Attachment' && !showQuickActions && (
                <div className={styles.fileDateTime} style={fileDateTimeStyle}>
                    {formatRelativeDate(suggestion.DateTimeCreated)}
                </div>
            )}
        </div>
    );

    if (isImmersiveViewSupported) {
        return (
            <SearchSuggestion
                ariaLabel={suggestion.FileName}
                content={content}
                quickActions={quickActions}
                suggestion={suggestion}
                scenarioId={scenarioId}
                suggestionSetTraceId={suggestionSetTraceId}
                index={index}
            />
        );
    } else {
        return (
            <OpenInNewTabSuggestion
                index={index}
                scenarioId={scenarioId}
                suggestion={suggestion}
                suggestionSetTraceId={suggestionSetTraceId}
                urlToNavigateTo={suggestion.FileUrl}
                ariaLabel={suggestion.FileName}
                suggestionContent={content}
                focusSearchInput={focusSearchInput}
            />
        );
    }
});

const getLastAccessedTime = (suggestion: FileSuggestion) => {
    if (suggestion.LayoutHint === 'MruFile') {
        const timeLastAccessedAsOwaDate = owaDate(
            'UTC',
            suggestion.DateTimeLastAccessed || suggestion.DateTimeCreated
        );
        const secondsFromLastAccessed = differenceInSeconds(owaDate(), timeLastAccessedAsOwaDate);
        const formattedSecondsFromLastAccessed = abbreviatedFormatDuration(
            secondsFromLastAccessed,
            {
                maxUnits: 1,
            }
        );

        return (
            <div className={styles.fileDateTime}>
                {format(loc(openedAgo_1), formattedSecondsFromLastAccessed)}
            </div>
        );
    } else {
        return null;
    }
};

const getSecondaryText = (suggestion: FileSuggestion, wasSentViaEmail: boolean): string => {
    if (suggestion.LayoutHint === 'MruFile') {
        return suggestion.FileAuthor;
    } else {
        if (isModernFilesEnabled()) {
            const date: OwaDate = owaDate('UTC', suggestion.DateTimeCreated);
            const dateCreatedText = formatPastRelativeDateTime(date, observableNow());
            return wasSentViaEmail
                ? format(loc(classicAttachment_secondaryText_2), dateCreatedText, suggestion.Sender)
                : format(
                      loc(modernAndCloudyAttachment_secondaryText_2),
                      dateCreatedText,
                      suggestion.FileAuthor
                  );
        } else {
            return suggestion.Sender;
        }
    }
};
