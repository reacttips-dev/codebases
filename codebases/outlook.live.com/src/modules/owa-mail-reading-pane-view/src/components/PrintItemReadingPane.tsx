import { contentPaneLabel } from 'owa-locstrings/lib/strings/contentpanelabel.locstring.json';
import loc from 'owa-localize';
import { observer } from 'mobx-react';
import ItemReadingPaneContent from './ItemReadingPaneContent';
import PrintItemHeader from './PrintItemHeader';
import PrintSubjectHeader from './PrintSubjectHeader';
import {
    HtmlContent,
    InlineImageHandler,
    INLINE_IMAGE_HANDLER_NAME,
} from 'owa-controls-content-handler';
import closePrintPanel from 'owa-mail-reading-pane-store/lib/actions/closePrintPanel';
import type ItemReadingPaneViewState from 'owa-mail-reading-pane-store/lib/store/schema/ItemReadingPaneViewState';
import mailStore from 'owa-mail-store/lib/store/Store';
import type Item from 'owa-service/lib/contract/Item';

import * as React from 'react';
import { reactive } from 'satcheljs/lib/legacy/react';

import styles from './PrintPanel.scss';
import classNames from 'classnames';

// Load context, this normally indicates surface of the loading, i.e. RP, Draft, Compose
const CONTEXT_READINGPANE_PRINT = 'RP_PRINT';

export interface PrintItemReadingPaneProps {
    itemId: string;
    viewState: ItemReadingPaneViewState;
    item?: Item;
}

@reactive({
    item: (props: PrintItemReadingPaneProps) => mailStore.items.get(props.itemId),
})
@observer
export default class PrintItemReadingPane extends React.Component<PrintItemReadingPaneProps, any> {
    private readonly contentHandlerDictionary = {};
    private readonly contentHandlerKeys = [];

    constructor(props: PrintItemReadingPaneProps) {
        super(props);

        if (!props.item.HasBlockedImages) {
            // The only content handler that is needed in print is imageContentHandler which handles servicing inline image from attachment
            // For simplicity, keep the code here. When the list grows or there are more initialization work to do, we should consider spitting it
            // out to a separate function
            this.contentHandlerDictionary[INLINE_IMAGE_HANDLER_NAME] = new InlineImageHandler(
                CONTEXT_READINGPANE_PRINT,
                false /* usePlaceHolder */,
                null /* userIdentity */,
                true /* delayRevoke */
            );
            this.contentHandlerKeys.push(INLINE_IMAGE_HANDLER_NAME);
        }
    }

    private createContainer = () => {
        const { item, viewState } = this.props;

        // VSTS: 47356. If the item has been removed from the mailStore, close print panel and return null to avoid component error.
        if (!item) {
            closePrintPanel(viewState);
            return null;
        }

        const messageBody = item.NormalizedBody ? item.NormalizedBody.Value : '';

        return (
            <>
                <PrintSubjectHeader subject={item.Subject} />
                <PrintItemHeader item={item} viewState={viewState} />
                <div className={styles.printMessageBody}>
                    <HtmlContent
                        html={messageBody}
                        contentHandlerDictionary={this.contentHandlerDictionary}
                        contentHandlerKeys={this.contentHandlerKeys}
                    />
                </div>
            </>
        );
        /* tslint:enable:react-no-dangerous-html */
    };

    render() {
        const loadingState = this.props.viewState.loadingState;

        return (
            <div
                key="printItemReadingPaneDiv"
                className={classNames(styles.printContent, 'allowTextSelection')}
                tabIndex={-1}
                role={'main'}
                aria-label={loc(contentPaneLabel)}>
                <ItemReadingPaneContent
                    loadingState={loadingState}
                    contentCreator={this.createContainer}
                />
            </div>
        );
    }
}
