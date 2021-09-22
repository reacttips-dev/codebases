import { MAX_COUNT_TO_RENDER } from '../helpers/couponPeekConsts';
import { Icon } from '@fluentui/react/lib/Icon';
import * as React from 'react';

import styles from './CouponPreview.scss';

export interface CouponPreviewWellProps {
    couponPreviews: string[];
    validCouponIndexes: number[];
    couponContainerClass: string;
}

export default function renderCouponPlaceholder(props: CouponPreviewWellProps): JSX.Element {
    const couponCountsToRender = Math.min(MAX_COUNT_TO_RENDER, props.validCouponIndexes.length);
    return Array.apply(null, Array(couponCountsToRender)).map(text => (
        <div key={text}>
            <Icon iconName={''} className={styles.icon} />
        </div>
    ));
}
