import * as React from 'react';
import { observer } from 'mobx-react-lite';
import type { WebUrlLocationProps } from '../schema/WebUrlLocationSchema';

export default observer(function WebUrlLocationPlaceholder(props: WebUrlLocationProps) {
    return <>{props.location}</>;
});
