import ReadOnlyRecipientWell, { ReadOnlyRecipientWellProps } from './ReadOnlyRecipientWell';
import { plusOther, plusOthers } from './ReadOnlyTruncatedRecipientWell.locstring.json';
import type ReadOnlyRecipientViewState from 'owa-recipient-types/lib/types/ReadOnlyRecipientViewState';
import { observer } from 'mobx-react';
import loc, { format } from 'owa-localize';
import { lazySubscribeToResizeEvent, lazyUnsubscribeFromResizeEvent } from 'owa-resize-event';
import { isFeatureEnabled } from 'owa-feature-flags';
import * as React from 'react';
import { getDensityModeString } from 'owa-fabric-theme';

import styles from './ReadOnlyTruncatedRecipientWell.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface ReadOnlyTruncatedRecipientWellProps extends ReadOnlyRecipientWellProps {
    totalRecipientCount: number;
    onToggleIsTruncated: React.MouseEventHandler<EventTarget>;
    useButtonForTruncatedCount?: boolean;
}

export interface TruncatedRecipientWellState {
    recipientsShown: ReadOnlyRecipientViewState[];
    truncatedCount: number;
    showPlainText: boolean;
}

const trailingComponentMaxWidth = 70;
const timeoutForTruncation = 1; /* There are issues on some browsers with a 0 timeout, but a 1ms timeout ends up behaving the same */

@observer
export default class ReadOnlyTruncatedRecipientWell extends React.Component<
    ReadOnlyTruncatedRecipientWellProps,
    TruncatedRecipientWellState
> {
    private containerRef: HTMLDivElement;
    private wellRef: HTMLElement;
    private shouldTruncateOnPropUpdate: boolean;
    private resizeThrottlingJob: number;
    private truncationTaskAfterMount: number;
    private truncationTaskAfterUpdate: number;

    constructor(props: ReadOnlyTruncatedRecipientWellProps) {
        super(props);
        this.state = {
            ...this.getShowAllRecipientsState(),
            showPlainText: true, // Show the plain text recipients in first load
        };
    }

    private onResize = () => {
        if (!this.resizeThrottlingJob) {
            this.resizeThrottlingJob = window.requestAnimationFrame(() => {
                this.resizeThrottlingJob = 0;
                this.setState(this.getShowAllRecipientsState());
                this.truncateRecipientsIfNecessary();
            });
        }
    };

    private getShowAllRecipientsState(
        newProps?: ReadOnlyTruncatedRecipientWellProps
    ): TruncatedRecipientWellState {
        const props = newProps ? newProps : this.props;
        return {
            recipientsShown: props.recipients ? props.recipients.slice() : [],
            truncatedCount: props.recipients
                ? props.totalRecipientCount - props.recipients.length
                : 0,
        } as TruncatedRecipientWellState;
    }

    private truncateRecipientsIfNecessary() {
        if (!this.containerRef || !this.wellRef) {
            return;
        }

        const maxWidth = this.containerRef.offsetWidth;
        let actualWidth = this.containerRef.scrollWidth;
        if (maxWidth == 0 || actualWidth - 1 <= maxWidth) {
            // No need to truncate in this case.
            // In IE/Edge, scrollWidth is off by 1px compared to offsetWidth
            // For details, see http://stackoverflow.com/questions/30900154/workaround-for-issue-with-ie-scrollwidth
            // So here we add a tolerance check of 1px.
            return;
        }

        for (let i = this.state.recipientsShown.length - 1; i > 0; i--) {
            const recipientRef = this.wellRef.children[i] as HTMLElement;
            actualWidth -= recipientRef.offsetWidth;
            this.state.recipientsShown.splice(i, 1);
            if (actualWidth + trailingComponentMaxWidth <= maxWidth || i == 1) {
                // Stop truncation here and set state to re-render.
                this.setState({
                    recipientsShown: this.state.recipientsShown,
                    truncatedCount:
                        this.props.totalRecipientCount - this.state.recipientsShown.length,
                });
                break;
            }
        }
    }

    componentWillUnmount() {
        lazyUnsubscribeFromResizeEvent.importAndExecute(this.onResize);
        if (this.resizeThrottlingJob) {
            window.cancelAnimationFrame(this.resizeThrottlingJob);
            this.resizeThrottlingJob = 0;
        }

        clearTimeout(this.truncationTaskAfterMount);
        clearTimeout(this.truncationTaskAfterUpdate);
    }

    componentDidMount() {
        lazySubscribeToResizeEvent.importAndExecute(this.onResize);
        this.truncationTaskAfterMount = window.setTimeout(() => {
            this.setState(this.getShowAllRecipientsState());
            this.truncateRecipientsIfNecessary();

            // Only when the truncation is finished, change the plain text to persona card behavior
            this.setState({
                showPlainText: false,
            });
        }, timeoutForTruncation);
    }

    //tslint:disable-next-line:react-strict-mode  Tracked by WI 78456
    UNSAFE_componentWillReceiveProps(newProps: ReadOnlyTruncatedRecipientWellProps) {
        if (
            this.props.renderSelf != newProps.renderSelf ||
            this.props.recipients != newProps.recipients
        ) {
            //Update the state if the renderSelf flag flips.
            this.setState(this.getShowAllRecipientsState(newProps));
            this.shouldTruncateOnPropUpdate = true;
        }
    }

    componentDidUpdate() {
        clearTimeout(this.truncationTaskAfterUpdate);

        this.truncationTaskAfterUpdate = window.setTimeout(() => {
            if (this.shouldTruncateOnPropUpdate) {
                this.truncateRecipientsIfNecessary();
                this.shouldTruncateOnPropUpdate = false;
            }
        }, timeoutForTruncation);
    }

    render() {
        const trailingComponentText =
            this.state.truncatedCount == 1
                ? format(loc(plusOther), this.state.truncatedCount)
                : format(loc(plusOthers), this.state.truncatedCount);

        const trailingComponent = this.props.useButtonForTruncatedCount ? (
            // Display + N Others button if truncated (No chevron)
            this.state.truncatedCount ? (
                <button
                    className={styles.clickableTrailingComponent}
                    onClick={this.props.onToggleIsTruncated}>
                    {trailingComponentText}
                </button>
            ) : null
        ) : (
            <span>
                {this.state.truncatedCount ? (
                    <span onClick={this.props.onToggleIsTruncated}>{trailingComponentText}</span>
                ) : (
                    ''
                )}
                {this.props.trailingComponent /* Show chevron */}
            </span>
        );
        return (
            <div
                className={classNames(
                    isFeatureEnabled('mon-densities') && getDensityModeString(),
                    styles.truncatedRecipientsContainer,
                    isFeatureEnabled('mon-tri-readingPaneRedlineUXUpdates') &&
                        styles.paddedRecipientSpacing,
                    this.props.className
                )}
                key="readOnlyTruncatedRecipientWellDiv"
                ref={ref => (this.containerRef = ref)}>
                <ReadOnlyRecipientWell
                    ref={ref => (this.wellRef = ref)}
                    recipientType={this.props.recipientType}
                    recipients={this.state.recipientsShown}
                    trailingComponent={trailingComponent}
                    renderSelf={this.props.renderSelf}
                    disableHover={this.props.disableHover}
                    showPlainText={this.state.showPlainText}
                    recipientClassName={classNames({
                        [styles.truncatedOnlyChildRecipient]:
                            this.state.recipientsShown.length === 1,
                        [styles.noTruncatedRecipients]:
                            this.state.recipientsShown.length === 1 &&
                            this.state.truncatedCount == 0,
                        [styles.separateRecipientWells]: !!this.props.useButtonForTruncatedCount,
                    })}
                />
            </div>
        );
    }
}
