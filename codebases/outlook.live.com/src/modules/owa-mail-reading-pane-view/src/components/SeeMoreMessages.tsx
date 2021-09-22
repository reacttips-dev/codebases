import {
    seeMoreMessagesText,
    collapsedItemsRollUpText as collapsedItemsRollUpText_1,
    expiredMessageRollUpText,
} from './SeeMoreMessages.locstring.json';
import { loading } from 'owa-locstrings/lib/strings/loading.locstring.json';
import loc, { format } from 'owa-localize';
import { observer } from 'mobx-react';
import { IconButton } from '@fluentui/react/lib/Button';
import { Spinner } from '@fluentui/react/lib/Spinner';
import { ControlIcons } from 'owa-control-icons';
import expandSeeMore from 'owa-mail-reading-pane-store/lib/actions/expandSeeMore';
import type ConversationReadingPaneViewState from 'owa-mail-reading-pane-store/lib/store/schema/ConversationReadingPaneViewState';
import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';
import {
    getItemsCountInCollapsedItemsRollUp,
    hasCollapsedItemsRollUp,
} from 'owa-mail-reading-pane-store/lib/utils/rollUp/collapsedItemsRollUpUtils';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getDensityModeString } from 'owa-fabric-theme';
import { ThemeProvider } from '@fluentui/react/lib/utilities/ThemeProvider';
import { getMailRollupTheme } from 'owa-mail-densities/lib/utils/getMailRollupTheme';
import { lazyOverrideCustomZoomToDefaultRollUp } from 'owa-custom-zoom';

import * as React from 'react';

export interface SeeMoreMessagesProps {
    conversationReadingPaneViewState: ConversationReadingPaneViewState;
    canLoadMore: boolean;
    isFocused: boolean;
    isLoadMoreInProgress: boolean;
    isCalendarCardOpen: boolean;
}
import styles from './ConversationReadingPane.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

@observer
export default class SeeMoreMessages extends React.Component<SeeMoreMessagesProps, any> {
    private seeMoreContainer: HTMLDivElement;

    public componentDidUpdate(prevProps: SeeMoreMessagesProps) {
        if (this.props.isFocused && !prevProps.isFocused && this.seeMoreContainer) {
            this.seeMoreContainer.focus();
        }
    }

    render() {
        const hasDensityNext = isFeatureEnabled('mon-densities');
        const densityMode = hasDensityNext ? getDensityModeString() : null;

        const loadingSpinnerDivStyle = classNames(styles.loadingSpinnerDiv, {
            isFocused: this.props.isFocused,
        });
        const overrideCustomZoomToDefaultRollUp = lazyOverrideCustomZoomToDefaultRollUp.tryImportForRender();
        const wrapperClassName = classNames(
            styles.collapsedItemsRollUpContainer,
            !hasDensityNext && styles.collapsedItemsRollUpContainerHeight,
            this.props.isFocused && styles.selectedItemPart,
            overrideCustomZoomToDefaultRollUp?.(),
            { isFocused: this.props.isFocused }
        );

        const { canLoadMore, conversationReadingPaneViewState } = this.props;

        const seeMoreText =
            this.props.isCalendarCardOpen &&
            hasCollapsedItemsRollUp(conversationReadingPaneViewState)
                ? format(
                      loc(expiredMessageRollUpText),
                      getItemsCountInCollapsedItemsRollUp(conversationReadingPaneViewState)
                  )
                : canLoadMore
                ? loc(seeMoreMessagesText)
                : format(
                      loc(collapsedItemsRollUpText_1),
                      getItemsCountInCollapsedItemsRollUp(conversationReadingPaneViewState)
                  );

        const iconButtonStyle = classNames(
            !hasDensityNext && styles.collapsedItemsRollUpIconButtonMargin,
            styles.collapsedItemsRollUpIconButton
        );
        const iconStyle = classNames(!hasDensityNext && styles.collapsedItemsRollUpIcon);
        const textStyle = classNames(styles.collapsedItemsRollUpText, densityMode);

        const content = this.props.isLoadMoreInProgress ? (
            <div className={loadingSpinnerDivStyle}>
                <Spinner className={styles.loadingSpinner} />
                <span className={styles.loadingText}>{loc(loading)}</span>
            </div>
        ) : (
            <ThemeProvider theme={getMailRollupTheme(densityMode)}>
                <div
                    role={'button'}
                    aria-label={seeMoreText}
                    className={wrapperClassName}
                    onClick={this.onClick}>
                    <IconButton
                        ariaLabel={seeMoreText}
                        className={iconButtonStyle}
                        onClick={this.onClick}
                        iconProps={{
                            iconName: isNewestOnBottom()
                                ? ControlIcons.DoubleChevronUp
                                : ControlIcons.DoubleChevronDown,
                            styles: {
                                root: iconStyle,
                            },
                        }}
                    />
                    <span className={textStyle}>{seeMoreText}</span>
                </div>
            </ThemeProvider>
        );

        return (
            <div tabIndex={-1} ref={this.setSeeMoreContainer}>
                {content}
            </div>
        );
    }

    private onClick = (event: React.MouseEvent<unknown>) => {
        event.stopPropagation();

        const { conversationReadingPaneViewState } = this.props;
        expandSeeMore(conversationReadingPaneViewState);
    };

    private setSeeMoreContainer = (seeMoreContainer: HTMLDivElement) => {
        this.seeMoreContainer = seeMoreContainer;
    };
}
