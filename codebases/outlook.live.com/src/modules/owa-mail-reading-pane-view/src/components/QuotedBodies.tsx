import MailMessageBody from './MailMessageBody';
import type { ClientItem } from 'owa-mail-store';
import * as React from 'react';

import styles from './FossilizedTextAndQuotedBody.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface QuotedBodiesProps {
    quotedTextList: string[];
    id: string;
    copyAllowed: boolean;
    printAllowed: boolean;
    undoDarkMode: boolean;
    isFocused?: boolean;
    item: ClientItem;
}

const QuotedBodies = (props: QuotedBodiesProps) => {
    const quotedBodiesClassName = classNames(styles.quotedBodies, {
        isFocused: props.isFocused,
    });
    return (
        <div className={quotedBodiesClassName}>
            <div className={styles.quotedBodiesTopBorder} />
            {props.quotedTextList && props.quotedTextList.length > 0
                ? props.quotedTextList.map((quotedBody, index) => {
                      return (
                          <div className={styles.quotedItemPart} key={props.id + '_QB_' + index}>
                              <MailMessageBody
                                  className={styles.quotedItemPartMessageBody}
                                  messageBody={quotedBody}
                                  copyAllowed={props.copyAllowed}
                                  printAllowed={props.printAllowed}
                                  isLoading={false}
                                  undoDarkMode={props.undoDarkMode}
                                  actionableMessageCardInItemViewState={undefined}
                                  item={props.item}
                              />
                              <div className={styles.quotedItemPartHorizontalRule} />
                          </div>
                      );
                  })
                : null}
        </div>
    );
};

export default QuotedBodies;
