import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { getExtendedTheme } from 'owa-fabric-theme';
import { classNamesFunction } from '@fluentui/utilities';

import { getStyles } from './CommonFloatingPickerItem.styles';
import type {
    CommonFloatingPickerItemStyleProps,
    CommonFloatingPickerItemStyles,
    CommonFloatingPickerItemProps,
} from './CommonFloatingPickerItem.types';

const getClassNames = classNamesFunction<
    CommonFloatingPickerItemStyleProps,
    CommonFloatingPickerItemStyles
>();

export default observer(function CommonFloatingPickerItem(props: CommonFloatingPickerItemProps) {
    const addSelectedItem = (evt: React.MouseEvent<any>) => {
        evt.preventDefault();
        if (props.addPickerItemAction) {
            props.addPickerItemAction(props.pickerItemData);
        }
    };
    let {
        isHighlighted,
        personaControl,
        firstLineElement,
        secondLineElement,
        theme = getExtendedTheme(),
    } = props;
    const classNames = getClassNames(getStyles, {
        theme: theme,
        isHighlighted: isHighlighted,
    });
    return (
        <div className={classNames.container} onClick={addSelectedItem}>
            <div className={classNames.personaContainer}>
                <div className={classNames.personaImage}>{personaControl}</div>
                <div className={classNames.personaText}>
                    {firstLineElement}
                    {secondLineElement}
                </div>
            </div>
        </div>
    );
});
