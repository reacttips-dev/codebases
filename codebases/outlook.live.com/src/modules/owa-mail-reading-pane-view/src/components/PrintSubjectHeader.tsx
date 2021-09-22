import { noSubjectText } from 'owa-locstrings/lib/strings/nosubjecttext.locstring.json';
import loc, { isStringNullOrWhiteSpace } from 'owa-localize';

import * as React from 'react';

import styles from './PrintPanel.scss';
import classNames from 'classnames';

export interface PrintSubjectHeaderProps {
    subject: string;
}

const PrintSubjectHeader = (props: PrintSubjectHeaderProps) => {
    const subjectDisplay = isStringNullOrWhiteSpace(props.subject)
        ? loc(noSubjectText)
        : props.subject;

    return (
        <div className={classNames(styles.printSubject)} title={subjectDisplay}>
            {subjectDisplay}
        </div>
    );
};

export default PrintSubjectHeader;
