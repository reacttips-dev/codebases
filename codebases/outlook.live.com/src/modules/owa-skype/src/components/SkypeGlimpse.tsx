import { observer } from 'mobx-react-lite';
import store from '../store/store';
import initializeRecents from '../utils/initializeRecents';
import refreshRecents from '../utils/refreshRecents';
import { Callout, DirectionalHint } from '@fluentui/react/lib/Callout';

import * as React from 'react';

import styles from './SkypeGlimpse.scss';
import classNames from 'classnames';

const OUTLOOK_DATA_STYLE_VALUE = 'outlook';
const SKYPE_RECENTS_CLASSNAME = 'skype-recents';
const RECENTS_WIDTH = 320;
export interface SkypeGlimpseProps {
    onDismiss: () => void;
    target: HTMLElement;
}

export default observer(function SkypeGlimpse(props: SkypeGlimpseProps) {
    return (
        <Callout
            onDismiss={props.onDismiss}
            target={props.target}
            isBeakVisible={false}
            beakWidth={15}
            gapSpace={0}
            directionalHint={DirectionalHint.bottomCenter}
            calloutWidth={RECENTS_WIDTH}
            setInitialFocus={true}>
            {renderSkypeRecents()}
        </Callout>
    );
});

function populateRecentsContent(recentsWrapper: HTMLDivElement) {
    // SWC needs the recents wrapper in the DOM before recents can be initialized with the appropriate content
    // If the recents have already been initalized, call SWC to refresh the wrapper with its cached element
    if (recentsWrapper) {
        if (store.isRecentsInitialized) {
            refreshRecents(recentsWrapper);
        } else {
            initializeRecents(recentsWrapper);
        }
    }
}

function renderSkypeRecents(): JSX.Element {
    return (
        <div
            data-style={OUTLOOK_DATA_STYLE_VALUE}
            className={classNames(SKYPE_RECENTS_CLASSNAME, styles.recentsWrapper)}
            ref={populateRecentsContent}
        />
    );
}
