import QuotedBodies from './QuotedBodies';
import {
    hideMessageHistoryText,
    showMessageHistoryText,
    hideFullMessageText,
    showFullMessageText,
} from '../strings.locstring.json';
import { observer } from 'mobx-react';
import { IconButton } from '@fluentui/react/lib/Button';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import expandCollapseQuotedBody from 'owa-mail-reading-pane-store/lib/actions/expandCollapseQuotedBody';
import type QuotedBodyViewState from 'owa-mail-reading-pane-store/lib/store/schema/QuotedBodyViewState';
import type { ClientItem } from 'owa-mail-store';
import * as React from 'react';

import styles from './FossilizedTextAndQuotedBody.scss';

export interface QuotedBodyProps {
    item: ClientItem;
    viewState: QuotedBodyViewState;
    isQuotedTextChanged: boolean;
    quotedTextState?: string;
    isExpandedCallback: (quotedBodyOffsetTop: number) => void;
    copyAllowed: boolean;
    printAllowed: boolean;
    undoDarkMode: boolean;
    isNative: boolean;
}

@observer
export default class QuotedBody extends React.Component<QuotedBodyProps, any> {
    private previousIsExpanded: boolean;
    private quotedBodiesContainer: HTMLDivElement;

    public componentDidMount() {
        this.previousIsExpanded = this.props.viewState.isExpanded;
    }

    public componentDidUpdate() {
        if (this.previousIsExpanded != this.props.viewState.isExpanded) {
            this.previousIsExpanded = this.props.viewState.isExpanded;

            if (
                this.props.viewState.isExpanded &&
                this.quotedBodiesContainer &&
                this.props.isExpandedCallback
            ) {
                this.props.isExpandedCallback(
                    this.quotedBodiesContainer.getBoundingClientRect().top
                );
            }
        }
    }

    private setQuotedBodiesContainer = (quotedBodiesContainer: HTMLDivElement) => {
        this.quotedBodiesContainer = quotedBodiesContainer;
    };

    render() {
        const { isNative } = this.props;
        const hideText = isNative ? loc(hideFullMessageText) : loc(hideMessageHistoryText);
        const showText = isNative ? loc(showFullMessageText) : loc(showMessageHistoryText);

        const title = this.props.viewState.isExpanded ? hideText : showText;

        return (
            <>
                <IconButton
                    title={title}
                    ariaLabel={title}
                    checked={this.props.viewState.isExpanded}
                    onClick={this.onToggleExpandCollapseQuotedBody}
                    className={styles.quotedBodyButton}
                    iconProps={{
                        iconName: ControlIcons.More,
                        styles: {
                            root: styles.quotedBodyButtonIcon,
                        },
                    }}
                />
                {this.props.viewState.loadingState.isLoading && (
                    <Spinner className={styles.quotedBodySpinner} size={SpinnerSize.xSmall} />
                )}
                {this.props.viewState.isExpanded && (
                    <div ref={this.setQuotedBodiesContainer}>
                        <QuotedBodies
                            quotedTextList={this.props.item.QuotedTextList}
                            id={this.props.item.ItemId.Id}
                            copyAllowed={this.props.copyAllowed}
                            printAllowed={this.props.printAllowed}
                            undoDarkMode={this.props.undoDarkMode}
                            item={this.props.item}
                        />
                    </div>
                )}
            </>
        );
    }

    private onToggleExpandCollapseQuotedBody = () => {
        expandCollapseQuotedBody(
            this.props.viewState,
            this.props.item.ItemId.Id,
            this.props.isQuotedTextChanged
        );
    };
}
