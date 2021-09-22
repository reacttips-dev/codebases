import { DefaultButton } from '@fluentui/react/lib/Button';
import * as React from 'react';
import { getFilterButtonStyles } from './SearchFilterStyles';
import { observer } from 'mobx-react-lite';

export interface SearchFilterToggleProps {
    label: string;
    isSelected: boolean;
    onClick: () => void;
}

export default observer(function SearchFilterToggle(props: SearchFilterToggleProps) {
    const { label, isSelected, onClick } = props;

    return (
        <DefaultButton
            toggle={true}
            checked={isSelected}
            text={label}
            onClick={onClick}
            styles={getFilterButtonStyles()}
        />
    );
});
