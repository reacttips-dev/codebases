import { updateAddinOnNavigationToEmptyNullReadingPane } from 'owa-mail-addins';
import React from 'react';

export default class NullReadingPane extends React.Component<{}, {}> {
    componentDidMount() {
        updateAddinOnNavigationToEmptyNullReadingPane();
    }

    render() {
        return null;
    }
}
