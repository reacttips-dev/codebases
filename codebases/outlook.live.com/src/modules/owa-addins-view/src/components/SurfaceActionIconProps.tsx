import * as React from 'react';
import { ControlIcons } from 'owa-addins-icons';
import { Icon, IconType, IIconProps } from '@fluentui/react/lib/Icon';
import { IImageProps, ImageFit } from '@fluentui/react/lib/Image';

import styles from './SurfaceActionIcon.scss';

const getIconProps = (srcUrl: string): IIconProps => {
    return {
        iconType: IconType.Image,
        imageProps: {
            src: srcUrl,
            width: 16,
            height: 16,
            imageFit: ImageFit.contain,
            shouldFadeIn: false,
        },
        styles: {
            root: {
                width: '16px !important',
                height: '16px !important',
            },
        },
        imageErrorAs: (props: IImageProps) => (
            <Icon
                className={styles.fallbackIcon}
                iconName={ControlIcons.Photo2}
                iconType={IconType.Default}
            />
        ),
    };
};

export default getIconProps;
