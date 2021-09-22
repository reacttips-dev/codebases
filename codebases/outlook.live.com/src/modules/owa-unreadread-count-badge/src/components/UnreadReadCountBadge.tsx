import * as React from 'react';
import { isFeatureEnabled } from 'owa-feature-flags';
import {
    nodeCountSingularScreenReaderOnlyText,
    nodeCountPluralScreenReaderOnlyText,
} from './UnreadReadCountBadge.locstring.json';
import { unreadCountScreenReaderOnlyText } from 'owa-locstrings/lib/strings/unreadcountscreenreaderonlytext.locstring.json';
import loc from 'owa-localize';
import { getDensityModeString } from 'owa-fabric-theme';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

export interface UnreadReadCountBadgeProps extends React.HTMLProps<HTMLDivElement> {
    count: number | string;
    shouldDisplayTotalCount?: boolean;
    screenReaderText?: string;
    customStyle?: string;
    isSelected: boolean;
    isListViewBadge?: boolean;
}
import styles from './UnreadReadCountBadge.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export function UnreadReadCountBadge(props: UnreadReadCountBadgeProps) {
    const {
        count,
        shouldDisplayTotalCount,
        screenReaderText,
        isSelected,
        customStyle,
        isListViewBadge,
    } = props;
    const hasBadge = isFeatureEnabled('mon-tri-unreadCountBadgeWithBackground');
    const hasDensityNext = isFeatureEnabled('mon-densities');
    const hasUnreadCountNext =
        (isFeatureEnabled('nh-boot-acctmonaccounts') &&
            isHostAppFeatureEnabled('acctmonaccounts')) ||
        hasDensityNext; // when there is no badge use specific fonts.
    const densityMode = getDensityModeString();
    const countContainerClassNames = classNames(
        customStyle,
        isListViewBadge && styles.listViewBadge,
        styles.unreadOrTotalCount,
        !shouldDisplayTotalCount && styles.unreadCount,
        densityMode,
        hasBadge && isSelected && styles.selectedFolder,
        hasBadge && styles.countWithBackground
    );
    return count ? (
        <span className={countContainerClassNames}>
            <span
                className={classNames(
                    densityMode,
                    hasBadge && hasUnreadCountNext && styles.folderCountText,
                    !hasBadge && hasUnreadCountNext && styles.plainBadge
                )}>
                {count}
            </span>
            <span className="screenReaderOnly">
                {
                    // for a treeitem, inner content that have aria-hidden=true are not hidden in IE
                    // therefore we cannot hide the visual string and use a screenReaderOnly string that has the count
                    screenReaderText || shouldDisplayTotalCount
                        ? count == 1
                            ? loc(nodeCountSingularScreenReaderOnlyText)
                            : loc(nodeCountPluralScreenReaderOnlyText)
                        : loc(unreadCountScreenReaderOnlyText)
                }
            </span>
        </span>
    ) : null;
}
