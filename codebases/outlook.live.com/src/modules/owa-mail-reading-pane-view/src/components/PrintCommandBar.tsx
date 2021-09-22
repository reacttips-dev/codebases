import { observer as observerLite } from 'mobx-react-lite';
import { CommandBarButton, IButtonProps, IButtonStyles } from '@fluentui/react/lib/Button';
import { CommandBar } from '@fluentui/react/lib/CommandBar';
import type { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import { CancelText } from 'owa-locstrings/lib/strings/canceltext.locstring.json';
import { itemHeaderPrint } from 'owa-locstrings/lib/strings/itemheaderprint.locstring.json';
import closePrintPanel from 'owa-mail-reading-pane-store/lib/actions/closePrintPanel';
import type ItemReadingPaneViewState from 'owa-mail-reading-pane-store/lib/store/schema/ItemReadingPaneViewState';
import * as React from 'react';

export interface PrintCommandBarProps {
    viewState: ItemReadingPaneViewState;
    onClickPrint: (
        ev?: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>
    ) => boolean | void;
}

import styles from './PrintPanel.scss';

const PrintCommandBarButton = observerLite((props: IButtonProps) => {
    const buttonStyles: IButtonStyles = {
        root: styles.commandBarButton,
    };
    return (
        <CommandBarButton
            {...props}
            styles={{
                ...props.styles,
                ...buttonStyles,
            }}
        />
    );
});

export default observerLite(function PrintCommandBar(props: PrintCommandBarProps) {
    const onCancel = (event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => {
        closePrintPanel(props.viewState);
    };
    const menuItems: IContextualMenuItem[] = [
        {
            key: 'Print',
            name: loc(itemHeaderPrint),
            iconProps: { iconName: ControlIcons.Print },
            onClick: props.onClickPrint,
        },
        {
            key: 'Cancel',
            name: loc(CancelText),
            iconProps: { iconName: ControlIcons.Cancel },
            onClick: onCancel,
        },
    ];
    return <CommandBar items={menuItems} buttonAs={PrintCommandBarButton} />;
});
