import { observer } from 'mobx-react-lite';

import { WideContentHost } from 'owa-controls-content-handler';
import * as React from 'react';

import styles from './FossilizedTextAndQuotedBody.scss';

export interface NewestOnBottomFossilizedTextProps {
    quotedBodies: JSX.Element;
}

export default observer(function NewestOnTopFossilizedText(
    props: NewestOnBottomFossilizedTextProps
) {
    return (
        <WideContentHost>
            <div className={styles.newestOnTopFossilizedText}>{props.quotedBodies}</div>
        </WideContentHost>
    );
});
