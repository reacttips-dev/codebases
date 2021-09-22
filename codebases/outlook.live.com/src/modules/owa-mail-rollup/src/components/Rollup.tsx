import { ActionButton, BaseButton } from '@fluentui/react/lib/Button';
import { observer } from 'mobx-react-lite';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getListViewColumnWidths, isSingleLineListView } from 'owa-mail-layout';
import type { TableView } from 'owa-mail-list-store';
import { getDensityModeString } from 'owa-fabric-theme';
import * as React from 'react';

import styles from './Rollup.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

interface RollupStyles {
    containerClassName?: string;
    primaryTextClassName?: string;
    secondaryTextClassName?: string;
    dismissButtonClassName?: string;
    dismissButtonIconClassName?: string;
    backButtonIconClassName?: string;
}

export interface RollupProps {
    badgeCount?: number;
    onClick: () => void;
    onDismissed?: (evt?: React.MouseEvent<BaseButton>) => void;
    onBackButtonClicked?: (evt?: React.MouseEvent<BaseButton>) => void;
    onRendered?: () => void;
    primaryText: string;
    secondaryText?: string;
    showOverlay?: boolean;
    styleSelectorAsPerUserSettings: string;
    styles?: RollupStyles;
    tableView: TableView;
}

export default observer(function Rollup(props: RollupProps) {
    const {
        badgeCount,
        onClick,
        onDismissed: onDismissed_0,
        onBackButtonClicked: onBackButtonClicked_0,
        onRendered,
        primaryText,
        secondaryText,
        showOverlay,
        styleSelectorAsPerUserSettings,
        styles: customStyles = {},
        tableView,
    } = props;

    const {
        primaryTextClassName,
        secondaryTextClassName,
        containerClassName,
        dismissButtonClassName,
        dismissButtonIconClassName,
        backButtonIconClassName,
    } = customStyles;
    const densityModeString = getDensityModeString();
    const primaryTextClassNames = classNames(styles.text, primaryTextClassName);
    const secondaryTextClassNames = classNames(styles.text, secondaryTextClassName);
    const dismissButtonClassNames = classNames(styles.dismissButton, dismissButtonClassName);

    const { senderColumnWidth } = getListViewColumnWidths(tableView);
    const firstColumnStyles = isFeatureEnabled('mon-tri-columnHeadersSlv')
        ? {
              flexBasis: senderColumnWidth,
              width: senderColumnWidth,
              maxWidth: senderColumnWidth,
          }
        : null;

    React.useEffect(() => {
        onRendered?.();
    }, []);

    const onDismissed = React.useCallback(
        (evt: React.MouseEvent<BaseButton>) => {
            evt.stopPropagation();
            onDismissed_0(evt);
        },
        [onDismissed_0]
    );

    const dismissButton = onDismissed_0 && (
        <ActionButton
            className={dismissButtonClassNames}
            onClick={onDismissed}
            iconProps={{
                iconName: ControlIcons.Cancel,
                styles: {
                    root: dismissButtonIconClassName,
                },
            }}
        />
    );

    const onBackButtonClicked = React.useCallback(
        (evt: React.MouseEvent<BaseButton>) => {
            evt.stopPropagation();
            onBackButtonClicked_0(evt);
        },
        [onBackButtonClicked_0]
    );

    const backButton = onBackButtonClicked_0 && (
        <div className={classNames(styles.backButtonContainer, styleSelectorAsPerUserSettings)}>
            <ActionButton
                className={dismissButtonClassNames}
                onClick={onBackButtonClicked}
                iconProps={{
                    iconName: ControlIcons.Back,
                    styles: {
                        root: backButtonIconClassName,
                    },
                }}
            />
        </div>
    );

    const overlay = showOverlay && <div className={styles.overlay}></div>;

    const isFirstColumnEmpty = !badgeCount && !backButton;

    const isSingleLineView = isSingleLineListView();

    const renderSingleLineViewRollup = () => {
        return (
            <div
                className={classNames(
                    styles.singleLineViewContainer,
                    styles.slvRollupContainer,
                    containerClassName
                )}
                onClick={onClick}>
                {overlay}
                <div className={classNames(densityModeString, styles.firstRow)}>
                    <div
                        className={classNames(
                            styles.firstColumnNoTwisty,
                            styleSelectorAsPerUserSettings,
                            isFirstColumnEmpty && styles.emptyFirstColumn
                        )}
                        style={firstColumnStyles}>
                        {badgeCount && (
                            <div
                                className={classNames(
                                    styles.unseenCountBadgeContainer,
                                    styleSelectorAsPerUserSettings
                                )}>
                                <div className={styles.badgeOverlaySlv}></div>
                                <span className={styles.unseenCountBadge}>{badgeCount}</span>
                            </div>
                        )}
                        {backButton}
                        <span className={primaryTextClassNames}>{primaryText}</span>
                    </div>
                    <div
                        className={classNames(
                            styles.secondColumn,
                            isFeatureEnabled('mon-tri-columnHeadersSlv') &&
                                styles.secondColumnWithHeaders
                        )}>
                        <div className={secondaryTextClassNames}>{secondaryText}</div>
                    </div>
                    {dismissButton}
                </div>
            </div>
        );
    };

    const renderThreeColumnViewRollup = () => {
        return (
            <div
                className={classNames(
                    densityModeString,
                    styles.threeColumnRollupContainer,
                    containerClassName
                )}
                onClick={onClick}>
                {overlay}
                {badgeCount && (
                    <div className={styles.firstColumnThreeColumn}>
                        <div
                            className={classNames(
                                styles.unseenCountBadgeContainer,
                                styleSelectorAsPerUserSettings
                            )}>
                            <div className={styles.badgeOverlay}></div>
                            <span className={styles.unseenCountBadge}>{badgeCount}</span>
                        </div>
                    </div>
                )}
                {backButton && <div className={styles.firstColumnThreeColumn}>{backButton}</div>}
                <div
                    className={classNames(
                        styles.column,
                        styleSelectorAsPerUserSettings,
                        isFirstColumnEmpty && styles.emptyFirstColumn,
                        isFeatureEnabled('mon-tri-mailItemTwisty') &&
                            !isSingleLineView &&
                            styles.highTwisty
                    )}>
                    <div className={primaryTextClassNames} title={primaryText}>
                        {primaryText}
                    </div>
                    <div className={secondaryTextClassNames} title={secondaryText}>
                        {secondaryText}
                    </div>
                </div>
                {dismissButton}
            </div>
        );
    };

    return isSingleLineView ? renderSingleLineViewRollup() : renderThreeColumnViewRollup();
});
