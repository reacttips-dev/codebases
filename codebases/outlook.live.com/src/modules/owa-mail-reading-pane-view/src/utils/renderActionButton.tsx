import { ActionButton } from '@fluentui/react/lib/Button';
import type { IIconProps } from '@fluentui/react';
import * as React from 'react';

export default function renderActionButton(
    name: string,
    onclick: (event?: React.MouseEvent<unknown>) => void,
    disabled: boolean,
    className: string,
    iconProps?: IIconProps
): JSX.Element {
    return (
        <ActionButton
            text={name}
            ariaLabel={name}
            onClick={onclick}
            disabled={disabled}
            className={className}
            iconProps={iconProps}
        />
    );
}
