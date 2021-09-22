import {
    whatsNew_Card_AddFlairWithExpressions_Body,
    whatsNew_Card_AddFlairWithExpressions_Title,
} from '../../strings.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { logWhatsNewCardShown } from '../../utils/logDatapoint';
import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import { ControlIcons } from 'owa-control-icons';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { getOwaResourceImageUrl } from 'owa-resource-url';

import styles from '../WhatsNewFluentCard.scss';

export const AddFlairWithExpressions = observer(function AddFlairWithExpressions(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.AddFlairWithExpressions);
    }, []);

    return <div tabIndex={0}>{loc(whatsNew_Card_AddFlairWithExpressions_Body)}</div>;
});

function addFlairWithExpressionsProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.AddFlairWithExpressions,
        title: loc(whatsNew_Card_AddFlairWithExpressions_Title),
        iconName: ControlIcons.Emoji2,
        body: <AddFlairWithExpressions />,
        animation: (
            <img
                className={styles.whatsNewCardAnimation}
                src={getOwaResourceImageUrl('Web_Expressions_Sized.gif')}
            />
        ),
    };
}

export default addFlairWithExpressionsProps;
