import { observer } from 'mobx-react-lite';
import { Spinner } from '@fluentui/react/lib/Spinner';
import loc from 'owa-localize';
import { loadingLabel } from 'owa-locstrings/lib/strings/loadinglabel.locstring.json';
import * as React from 'react';

import styles from './TimePanelLoadingView.scss';

export default observer(function TimePanelLoadingView() {
    return (
        <div className={styles.loadingView}>
            <Spinner />
            {loc(loadingLabel)}
        </div>
    );
});
