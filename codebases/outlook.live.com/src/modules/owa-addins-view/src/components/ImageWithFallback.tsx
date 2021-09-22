import { observer } from 'mobx-react-lite';
import * as React from 'react';
import classNames from 'classnames';
import { ControlIcons } from 'owa-addins-icons';
import { Icon, IconType } from '@fluentui/react/lib/Icon';
import { IImageProps, Image, ImageFit, ImageLoadState } from '@fluentui/react/lib/Image';

import styles from './TaskPaneHeader.scss';

export interface ImageWithFallbackState {
    hasLoadFailed: boolean;
}

export default observer(function ImageWithFallback(props: IImageProps) {
    const [hasLoadFailed, setHasLoadFailed] = React.useState<boolean>(false);
    const onLoadingStateChanged = (loadState: ImageLoadState) => {
        if (loadState == ImageLoadState.error) {
            setHasLoadFailed(true);
        } else {
            setHasLoadFailed(false);
        }
    };
    if (hasLoadFailed) {
        return (
            <Icon
                iconName={ControlIcons.Photo2}
                iconType={IconType.default}
                className={classNames([styles.fallbackIcon, props.className])}
            />
        );
    }
    return (
        <Image
            onLoadingStateChange={onLoadingStateChanged}
            src={props.src}
            width={props.width}
            height={props.height}
            imageFit={ImageFit.contain}
            className={props.className}
        />
    );
});
