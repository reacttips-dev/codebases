import { observer } from 'mobx-react-lite';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { isBrowserSafari } from 'owa-user-agent/lib/userAgent';
import { WindowProvider } from '@fluentui/react/lib/WindowProvider';

import styles from './PrintableIframe.scss';

interface PrintableIframeProps {
    htmlString: string;
    cssString?: string;
    docAttributes?: NamedNodeMap;
    divToRemoveAfterPrint: HTMLDivElement;
}

const PrintableIframe = observer(function PrintableIframe(props: PrintableIframeProps) {
    React.useEffect(() => {
        print_0();
    }, []);
    const printFrame = React.useRef<HTMLIFrameElement>();
    const print_0 = () => {
        if (!printFrame.current) {
            return;
        }
        const { htmlString, cssString, docAttributes } = props;
        // create documentHTML
        let documentHTML = '<!DOCTYPE html><html ';
        if (docAttributes) {
            for (let i = 0; i < docAttributes.length; i++) {
                documentHTML += docAttributes.item(i).name;
                documentHTML += '="' + docAttributes.item(i).value + '" ';
            }
        }
        documentHTML += '><head>';
        documentHTML += cssString ? '<style>' + cssString + '</style>' : '';
        documentHTML += '</head><body>' + htmlString + '</body></html>';
        const ifrm = printFrame.current;
        const ifrmDocument = ifrm.contentDocument;
        let isContentLoaded = false;
        printFrame.current.onload = () => {
            if (!isContentLoaded) {
                isContentLoaded = true;
                triggerPrintAfterContentLoaded();
            }
        };
        // write documentHTML to iframe
        /* tslint:disable:no-document-write */
        /* eslint-disable @microsoft/sdl/no-document-write */
        ifrmDocument.open();
        ifrmDocument.write(documentHTML);
        ifrmDocument.close();
        /* eslint-enable @microsoft/sdl/no-document-write */
        /* tslint:enable:no-document-write */
        if (printFrame.current.contentWindow) {
            printFrame.current.contentWindow.onload = () => {
                if (!isContentLoaded) {
                    isContentLoaded = true;
                    triggerPrintAfterContentLoaded();
                }
            };
        }
    };
    const triggerPrintAfterContentLoaded = () => {
        const frameWindow = printFrame.current.contentWindow;
        if (isBrowserSafari()) {
            // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeprint
            // Safari doesn't implement onbeforeprint/onafterprint events
            // In Safari, the print confirmation dialog doesn't stop JS code execution flow to
            // wait for printing. So we need to emulate the onafterprint event for Safari.
            const mediaQueryCallback = function (mql) {
                if (!mql.matches && printFrame) {
                    removePrintDiv(props.divToRemoveAfterPrint);
                }
            };
            const mediaQueryList = frameWindow.matchMedia('print');
            mediaQueryList.addListener(mediaQueryCallback);
            printFrame.current.onfocus = function () {
                return mediaQueryCallback(mediaQueryList);
            };
        } else {
            frameWindow.onafterprint = function () {
                removePrintDiv(props.divToRemoveAfterPrint);
            };
        }
        printFrame.current.focus();
        const result = frameWindow.document.execCommand('print', false, null);
        if (!result) {
            frameWindow.print();
        }
    };
    /* eslint-disable-next-line @microsoft/sdl/react-iframe-missing-sandbox */
    return <iframe ref={ref => (printFrame.current = ref)} className={styles.printIframe} />;
});

function removePrintDiv(divToRemoveAfterPrint: HTMLDivElement) {
    setTimeout(() => {
        ReactDOM.unmountComponentAtNode(divToRemoveAfterPrint);
        document.body.removeChild(divToRemoveAfterPrint);
    }, 0);
}

let instance = 0;

/**
 * htmlString: the stringified version of the the html element to print
 * cssString: styling for the element
 **/
export default function print(
    htmlString: string,
    cssString?: string,
    docAttributes?: NamedNodeMap,
    targetWindow?: Window
) {
    const document = (targetWindow || window).document;
    const printDiv = document.createElement('div');
    printDiv.id = 'printableIframe' + instance++;
    document.body.appendChild(printDiv);
    ReactDOM.render(
        <React.StrictMode>
            <WindowProvider window={targetWindow || window}>
                <PrintableIframe
                    htmlString={htmlString}
                    cssString={cssString}
                    divToRemoveAfterPrint={printDiv}
                    docAttributes={docAttributes}
                />
            </WindowProvider>
        </React.StrictMode>,
        printDiv
    );
}
