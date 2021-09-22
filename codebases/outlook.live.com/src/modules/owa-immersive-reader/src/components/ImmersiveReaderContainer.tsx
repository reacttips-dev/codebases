import { observer } from 'mobx-react-lite';
import { immersiveReaderIframeTitle } from './ImmersiveReaderContainer.locstring.json';
import loc, { getCurrentCulture } from 'owa-localize';
/* tslint:disable:forbid-import */
import { autorun } from 'mobx';
import * as React from 'react';
import { PerformanceDatapoint, DatapointStatus } from 'owa-analytics';
import { useWindowEvent } from 'owa-react-hooks/lib/useWindowEvent';
import { isFeatureEnabled } from 'owa-feature-flags';
import {
    lazyCloseImmersiveReader,
    store,
    ImmersiveReaderFrameState,
    lazySetImmersiveReaderFrameReady,
} from 'owa-immersive-reader-store';
import closeImmersiveReadingPane from 'owa-mail-actions/lib/closeImmersiveReadingPane';
import { useKeydownHandler } from 'owa-hotkeys';
import { getCommands } from 'owa-mail-hotkeys/lib/utils/MailModuleHotKeys';
import { useConst } from '@fluentui/react-hooks';

import styles from './ImmersiveReaderContainer.scss';

const LEARNING_TOOLS_URL_EDOG = 'https://learningtools.edog.onenote.com/learningtoolsapp/reader';
const LEARNING_TOOLS_URL_PROD = 'https://learningtools.onenote.com/learningtoolsapp/reader';
const IMMERSIVE_READER_CONTAINER_DATAPOINT_NAME = 'ImmersiveReaderContainer';

function closeReader(evt: KeyboardEvent) {
    closeImmersiveReadingPane('Keyboard');
}

export default observer(function ImmersiveReaderContainer(props: {}) {
    const containerRef = React.useRef<HTMLDivElement>();
    const immersiveReaderUrl = useConst(() => getImmersiveReaderUrl());
    useKeydownHandler(containerRef, getCommands().closeMail, closeReader);

    React.useEffect(() => {
        const autorunDisposer = autorun(() => {
            if (
                store.apiResponse &&
                store.immersiveReaderFrameState === ImmersiveReaderFrameState.Ready &&
                immersiveReaderFrame.current
            ) {
                if (dp.current) {
                    dp.current.addCheckmark('SendingPostMessageToFrame');
                }
                immersiveReaderFrame.current.contentWindow.postMessage(
                    JSON.stringify(store.apiResponse),
                    immersiveReaderUrl
                );
            }
        });
        return () => {
            autorunDisposer();
        };
    }, []);

    const onReceivePostMessage = (evt: MessageEvent) => {
        // Don't bother processing if we aren't showing the immersive reader iframe
        if (!evt || store.immersiveReaderFrameState === ImmersiveReaderFrameState.Closed) {
            return;
        }
        // Ensure this message is coming from the immersive reader iframe
        if (immersiveReaderUrl.toLowerCase().indexOf(evt.origin.toLowerCase()) !== 0) {
            return;
        }
        if (evt.data === 'ImmersiveReader-ReadyForContent') {
            if (dp.current) {
                dp.current.addCheckmark('ReceivedReadyForContent');
            }
            // Indicates that the immersive reader has loaded and is ready to receive data
            lazySetImmersiveReaderFrameReady.importAndExecute();
            immersiveReaderFrame.current.focus();
        } else if (evt.data === 'CloseImmersiveReader') {
            if (dp.current) {
                dp.current.addCheckmark('ReceivedCloseReader');
            }
            receivedCloseCallback.current = true;
            // Indicates that we should close and hide the iframe
            lazyCloseImmersiveReader.importAndExecute();
        }
    };

    useWindowEvent('message', onReceivePostMessage);

    const immersiveReaderFrame = React.useRef<HTMLIFrameElement>();
    const dp = React.useRef<PerformanceDatapoint>();
    const receivedCloseCallback = React.useRef<boolean>();
    if (store.immersiveReaderFrameState !== ImmersiveReaderFrameState.Closed && !dp.current) {
        dp.current = new PerformanceDatapoint(IMMERSIVE_READER_CONTAINER_DATAPOINT_NAME);
        dp.current.addCustomData({ sessionId: store.sessionId });
        receivedCloseCallback.current = false;
    } else if (store.immersiveReaderFrameState === ImmersiveReaderFrameState.Closed && dp.current) {
        if (receivedCloseCallback.current) {
            dp.current.end();
        } else {
            dp.current.endWithError(
                DatapointStatus.ServerError,
                new Error('Did not receive close callback')
            );
        }
        dp.current = null;
    }
    return store.immersiveReaderFrameState !== ImmersiveReaderFrameState.Closed ? (
        <div className={styles.immersiveReaderContainer} ref={containerRef}>
            {/* eslint-disable-next-line @microsoft/sdl/react-iframe-missing-sandbox */}
            <iframe
                aria-modal="true"
                id="immersive-reader-iframe"
                className={styles.immersiveReaderIframe}
                title={loc(immersiveReaderIframeTitle)}
                allowFullScreen={true}
                src={immersiveReaderUrl}
                ref={el => {
                    if (dp.current) {
                        dp.current.addCheckmark('GotFrameRef');
                    }
                    immersiveReaderFrame.current = el;
                }}
            />
        </div>
    ) : null;
});

// Gets the URL of the immersive reader page, which depends on the environment we are in.
function getImmersiveReaderUrl() {
    let url: string = LEARNING_TOOLS_URL_PROD;
    // Check to see if we are in dogfood. If so, we need to point to the dogfood endpoint instead.
    if (isFeatureEnabled('rp-immersiveReaderDogfood')) {
        url = LEARNING_TOOLS_URL_EDOG;
    }
    const userCulture = getCurrentCulture();
    // Note: appSubId=React is a simple way to differentiate JsMVVM vs React, so that we, in our telemetry,
    // can track usage in each of the two frameworks.
    return `${url}?exitCallback=CloseImmersiveReader&appId=OWA&sessionId=${store.sessionId}&ui=${userCulture}&appSubId=React`;
}
