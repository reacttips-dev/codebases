import { observer } from 'mobx-react-lite';
import PrintCommandBar from './PrintCommandBar';
import PrintItemReadingPane from './PrintItemReadingPane';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import closePrintPanel from 'owa-mail-reading-pane-store/lib/actions/closePrintPanel';
import type ItemReadingPaneViewState from 'owa-mail-reading-pane-store/lib/store/schema/ItemReadingPaneViewState';
import * as React from 'react';
import classNames from 'classnames';
import print from 'owa-printableiframe-view/lib/components/PrintableIframe';
import { isShySuiteHeaderMode } from 'owa-suite-header-store';

import styles from './PrintPanel.scss';
import appStyles from 'owa-application/lib/components/App.css';
import recipientStyles from 'owa-readonly-recipient-well/lib/components/ReadOnlyRecipient.scss';
import recipientWellStyles from 'owa-readonly-recipient-well/lib/components/ReadOnlyRecipientWell.scss';
import attachmentWellStyles from 'owa-attachment-well-view/lib/components/AttachmentWellPrintView.scss';

export interface PrintPanelProps {
    itemId: string;
    viewState: ItemReadingPaneViewState;
}

export default observer(function PrintPanel(props: PrintPanelProps) {
    const printContainer = React.useRef<HTMLDivElement>();
    const onDismissPanel = () => {
        closePrintPanel(props.viewState);
    };
    const onRenderHeader = (): JSX.Element => {
        return (
            <div className={styles.printCommandBar}>
                <PrintCommandBar viewState={props.viewState} onClickPrint={onClickPrint} />
            </div>
        );
    };
    const onClickPrint = (
        event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>
    ) => {
        event.stopPropagation();
        // We don't want to delay the print action, so we don't use the lazy function here.
        print(
            printContainer.current.innerHTML,
            getCssStyles(),
            document.documentElement.attributes
        );
    };
    return (
        <Panel
            isOpen={props.viewState.isPrint}
            onDismiss={onDismissPanel}
            onRenderHeader={onRenderHeader}
            type={PanelType.largeFixed}
            hasCloseButton={false}
            isLightDismiss={true}
            className={classNames(styles.printPanelContainer, {
                isShyHeaderMode: isShySuiteHeaderMode(),
            })}>
            <div ref={ref => (printContainer.current = ref)} className={styles.printContainer}>
                <PrintItemReadingPane itemId={props.itemId} viewState={props.viewState} />
            </div>
        </Panel>
    );
});

function getCssStyles(): string {
    const styleSheets = document.getElementsByTagName('style');
    let cssString = '';

    // The print panel inherits its font-family from the <Fabric> app container.
    // We need to get its font-family and apply it to the body in the iframe.
    const appContainer = document.getElementsByClassName(appStyles.appContainer)[0];
    cssString += `body { font-family: ${window.getComputedStyle(appContainer).fontFamily}; }`;

    // Hide the refence attachments in the message body.
    cssString += '#OwaReferenceAttachments{display:none}';

    // Construct a regex of all classes in relevant sass files to include in the iframe. Importing them like this will unsure the minified class names are used.
    const regex = [styles, recipientWellStyles, recipientStyles, attachmentWellStyles]
        .map(sassFile =>
            Object.keys(sassFile)
                .map(className => sassFile[className])
                .join('|')
        )
        .join('|');

    for (let i = 0; i < styleSheets.length; i++) {
        // We only need style that applies to our components. So only include the styleSheet if it matches the regex.
        const styleSheet = styleSheets[i].innerHTML;
        if (styleSheet.match(regex)) {
            cssString += styleSheet;
        }
    }

    return cssString;
}
