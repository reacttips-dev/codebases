import { observer } from 'mobx-react-lite';
import { closeTabAriaLabel } from 'owa-locstrings/lib/strings/closetabarialabel.locstring.json';
import { noSubject } from 'owa-locstrings/lib/strings/nosubject.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import closeTab from 'owa-tab-store/lib/actions/closeTab';

import { ControlIcons } from 'owa-control-icons';
import findInlineComposeViewState from 'owa-mail-compose-actions/lib/utils/findInlineComposeViewState';
import { getSelectedTableView, isConversationView } from 'owa-mail-list-store';
import { Icon } from '@fluentui/react/lib/Icon';
import { IconButton } from '@fluentui/react/lib/Button';
import type { SecondaryReadingPaneTabViewState } from 'owa-tab-store/lib/store/schema/TabViewState';
import setReadingPaneTabHiddenWhenSameWithPrimary from 'owa-tab-store/lib/actions/setReadingPaneTabHiddenWhenSameWithPrimary';

import styles from './ReadingPaneTab.scss';

export interface SecondaryReadingPaneTabProps {
    viewState: SecondaryReadingPaneTabViewState;
    className: string;
    subjectClassName: string;
}

export default observer(function SecondaryReadingPaneTab(props: SecondaryReadingPaneTabProps) {
    const onClickCloseButton = (e: React.MouseEvent<unknown>) => {
        e.stopPropagation();
        closeTab(props.viewState);
    };
    const { viewState, className, subjectClassName } = props;
    const secondaryReadingPaneTabData = viewState.data;
    let subject = secondaryReadingPaneTabData.subject;
    subject = subject || '';
    if (subject.trim() == '') {
        subject = loc(noSubject);
    }

    React.useEffect(() => {
        setReadingPaneTabHiddenWhenSameWithPrimary(
            viewState.data,
            false /*hideWhenSameWithPrimary*/
        );
    }, []);

    const inlineCompose =
        getSelectedTableView() &&
        isConversationView(getSelectedTableView()) &&
        findInlineComposeViewState(secondaryReadingPaneTabData.id.Id);
    return (
        <div className={className} title={subject}>
            {inlineCompose && <Icon iconName={ControlIcons.Edit} className={styles.leftIcon} />}
            <div className={subjectClassName}>{subject}</div>
            <IconButton
                iconProps={{ iconName: ControlIcons.Cancel }}
                onClick={onClickCloseButton}
                className={styles.rightIcon}
                aria-label={loc(closeTabAriaLabel)}
            />
        </div>
    );
});
