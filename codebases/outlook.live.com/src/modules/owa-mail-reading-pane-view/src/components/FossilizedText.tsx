import NewestOnBottomFossilizedText from './NewestOnBottomFossilizedText';
import NewestOnTopFossilizedText from './NewestOnTopFossilizedText';
import QuotedBodies from './QuotedBodies';
import { renderFossilizedText } from '../utils/readingPaneRenderChooser';
import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';
import type { ClientItem } from 'owa-mail-store';
import * as React from 'react';

import styles from './FossilizedTextAndQuotedBody.scss';

export interface FossilizedTextProps {
    quotedTextList: string[];
    nodeId: string;
    fossilizedTextCollapsedCallback: (fossilizedTextOffsetTop: number) => void;
    isExpanded: boolean;
    undoDarkMode: boolean;
    copyAllowed: boolean;
    printAllowed: boolean;
    isFocused: boolean;
    item: ClientItem;
}

const FossilizedText = (props: FossilizedTextProps) => {
    let orderedQuotedTextList = props.quotedTextList;
    if (!orderedQuotedTextList || orderedQuotedTextList.length == 0) {
        return null;
    }

    if (isNewestOnBottom()) {
        orderedQuotedTextList = orderedQuotedTextList.reverse();
    }

    const firstQuotedBody = (
        <QuotedBodies
            quotedTextList={[orderedQuotedTextList[0]]}
            id={props.nodeId}
            copyAllowed={props.copyAllowed}
            printAllowed={props.printAllowed}
            undoDarkMode={props.undoDarkMode}
            item={props.item}
        />
    );

    const quotedBodies = (
        <QuotedBodies
            quotedTextList={orderedQuotedTextList}
            id={props.nodeId}
            copyAllowed={props.copyAllowed}
            printAllowed={props.printAllowed}
            undoDarkMode={props.undoDarkMode}
            isFocused={!isNewestOnBottom() && props.isFocused}
            item={props.item}
        />
    );

    return (
        <div className={props.undoDarkMode ? styles.undoDarkMode : ''}>
            {renderFossilizedText(
                <NewestOnTopFossilizedText quotedBodies={quotedBodies} />,
                <NewestOnBottomFossilizedText
                    conversationId={props.item.ConversationId.Id}
                    isFocused={props.isFocused}
                    nodeId={props.nodeId}
                    isExpanded={props.isExpanded}
                    firstQuotedBody={firstQuotedBody}
                    quotedBodies={quotedBodies}
                    collapsedCallback={props.fossilizedTextCollapsedCallback}
                />
            )}
        </div>
    );
};

export default FossilizedText;
