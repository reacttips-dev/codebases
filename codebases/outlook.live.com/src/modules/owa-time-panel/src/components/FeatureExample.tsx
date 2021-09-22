import { observer } from 'mobx-react-lite';
import { IconButton } from '@fluentui/react/lib/Button';
import { ControlIcons } from 'owa-control-icons';
import { lighted, LightningProps, Lightable } from 'owa-lightning-v2';
import * as React from 'react';

import styles from './FeatureExample.scss';

export interface FeatureExampleProps extends LightningProps {
    gif: string;
    gifText: string;
    showTextAsOverlay: boolean;
}

export default observer(function FeatureExample(props: FeatureExampleProps) {
    const { gif, gifText, showTextAsOverlay, ...lightningProps } = props;

    const onClickCallback = React.useCallback(() => lighted(lightningProps.lid), [
        lightningProps.lid,
    ]);

    return (
        <Lightable {...lightningProps}>
            <div className={styles.gifContainer}>
                {showTextAsOverlay && <div className={styles.gifOverlayText}>{gifText}</div>}
                <img
                    className={styles.gif}
                    src={gif}
                    title={!showTextAsOverlay ? gifText : undefined}
                />
                <IconButton
                    className={styles.cancel}
                    iconProps={{
                        iconName: ControlIcons.Cancel,
                        styles: {
                            root: styles.cancelIcon,
                        },
                    }}
                    onClick={onClickCallback}
                />
            </div>
        </Lightable>
    );
});
