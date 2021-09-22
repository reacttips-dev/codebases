import { observer } from 'mobx-react-lite';
import { gdprMinorWarningText, gdprMinorRemoveAddinText } from '../../strings.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { default as openInClientStore } from '../../actions/openInClientStore';

import styles from './MinorFrame.scss';

export interface MinorFrameProps {
    onClickUninstall: () => void;
}

export default observer(function MinorFrame(props: MinorFrameProps) {
    const handleRemoveLinkClick = (event: React.MouseEvent<unknown>) => {
        event.stopPropagation();
        event.preventDefault();
        if (props.onClickUninstall) {
            props.onClickUninstall();
        }
        openInClientStore();
    };
    return (
        <div className={styles.divContainer}>
            <div>
                {loc(gdprMinorWarningText)}{' '}
                <a href="" onClick={handleRemoveLinkClick}>
                    {loc(gdprMinorRemoveAddinText)}
                </a>
            </div>
        </div>
    );
});
