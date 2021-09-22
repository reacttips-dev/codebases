import { wideContentScaleControlZoomIn } from './ScaleControl.locstring.json';
import { observer } from 'mobx-react-lite';
import { IconButton } from '@fluentui/react/lib/Button';
import type { IIconProps } from '@fluentui/react/lib/Icon';
import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import styles from './ScaleControl.scss';

export interface ScaleControlProps {
    onScaleUp: () => void;
}

const ScaleControl = observer(function ScaleControl(props: ScaleControlProps) {
    const onClick = () => {
        props.onScaleUp();
    };

    const onFocus = (event: React.FocusEvent<HTMLElement>) => {
        event.stopPropagation();
        const target = event.currentTarget as HTMLElement;
        showScaleControl(target.parentElement);
    };

    const onBlur = (event: React.FocusEvent<HTMLElement>) => {
        event.stopPropagation();
        const target = event.currentTarget as HTMLElement;
        hideScaleControl(target.parentElement);
    };

    const iconProps: IIconProps = {
        iconName: ControlIcons.FullScreen,
    };

    return (
        <IconButton
            className={styles.scaleControl}
            title={loc(wideContentScaleControlZoomIn)}
            ariaLabel={loc(wideContentScaleControlZoomIn)}
            onFocus={onFocus}
            onBlur={onBlur}
            onClick={onClick}
            iconProps={iconProps}
        />
    );
});

function showScaleControl(container: HTMLElement) {
    container.style.opacity = '1';
    container.style.zIndex = '1';
}

function hideScaleControl(container: HTMLElement) {
    container.style.opacity = '0';
    container.style.zIndex = '-1';
}

export function MountScaleControl(scaleControlContainer: HTMLElement, onScaleUp: () => void) {
    ReactDOM.render(
        <React.StrictMode>
            <ScaleControl onScaleUp={onScaleUp} />
        </React.StrictMode>,
        scaleControlContainer
    );
}

export function UnmountScaleControl(scaleControlContainer: HTMLElement) {
    ReactDOM.unmountComponentAtNode(scaleControlContainer);
}
