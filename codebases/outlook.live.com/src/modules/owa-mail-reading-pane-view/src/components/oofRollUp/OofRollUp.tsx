import OofRollUpExpanded from './OofRollUpExpanded';
import OofRollUpHeader from './OofRollUpHeader';
import { logUsage } from 'owa-analytics';
import type { ItemPartViewState } from 'owa-mail-reading-pane-store';
import toggleIsOofRollUpExpanded from 'owa-mail-reading-pane-store/lib/actions/toggleIsOofRollUpExpanded';
import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';
import type { ClientItem } from 'owa-mail-store';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import { getItemToShowFromNodeId } from 'owa-mail-store/lib/utils/conversationsUtils';
import truncateCountForDataPointAggregation from 'owa-mail-store/lib/utils/truncateCountForDataPointAggregation';
import * as React from 'react';
import { reactive } from 'satcheljs/lib/legacy/react';

import styles from './OofRollUp.scss';
import conversationStyles from '../ConversationReadingPane.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface OofRollUpProps {
    isExpanded: boolean;
    isFocused: boolean;
    oofItems?: ClientItem[];
    parentItemPartViewState: ItemPartViewState;
    instrumentationContext: InstrumentationContext;
}

@reactive({
    oofItems: (props: OofRollUpProps) =>
        props.parentItemPartViewState.oofRollUpViewState.oofReplyNodeIds.map(nodeId =>
            getItemToShowFromNodeId(nodeId)
        ),
})
export default class OofRollUp extends React.Component<OofRollUpProps, any> {
    private oofRollUpDiv: HTMLDivElement;

    private onClickOofRollUpHeader = (): void => {
        const { oofItems, parentItemPartViewState, isExpanded } = this.props;
        // log datapoint
        logUsage('RPOofFilterCollapseExpandTriggered', [
            !isExpanded,
            truncateCountForDataPointAggregation(oofItems.length),
        ]);

        // action to toggle isOofRollUpExpanded
        toggleIsOofRollUpExpanded(oofItems[0].ConversationId?.Id, parentItemPartViewState);
    };

    componentDidMount() {
        const { oofItems } = this.props;
        // log datapoint
        logUsage('RPOofFilterActivation', [truncateCountForDataPointAggregation(oofItems.length)]);
    }

    componentDidUpdate(prevProps: OofRollUpProps) {
        if (!prevProps.isFocused && this.props.isFocused) {
            this.oofRollUpDiv.focus();
        }
    }

    render() {
        const { oofItems, isFocused, isExpanded, parentItemPartViewState } = this.props;

        if (oofItems.length == 0) {
            return null;
        }

        const wrapperClassName = classNames(
            styles.oofRollUp,
            !isNewestOnBottom() && conversationStyles.oofRollUp,
            {
                isFocused: isFocused,
            }
        );
        return (
            <div className={wrapperClassName} ref={this.setContainerRef} tabIndex={-1}>
                <OofRollUpHeader
                    oofItems={oofItems}
                    onClickOofRollUpHeader={this.onClickOofRollUpHeader}
                    parentItemPartViewState={parentItemPartViewState}
                />
                {isExpanded && (
                    <OofRollUpExpanded
                        oofItems={oofItems}
                        instrumentationContext={this.props.instrumentationContext}
                        conversationId={oofItems[0].ConversationId?.Id}
                    />
                )}
            </div>
        );
    }

    private setContainerRef = (ref: HTMLDivElement) => {
        this.oofRollUpDiv = ref;
    };
}
