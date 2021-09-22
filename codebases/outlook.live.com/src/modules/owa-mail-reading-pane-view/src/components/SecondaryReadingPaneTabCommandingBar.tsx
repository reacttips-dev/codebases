import { observer } from 'mobx-react-lite';
import { useComputed } from 'owa-react-hooks/lib/useComputed';
import { mailEllipsisAriaLabelText } from 'owa-locstrings/lib/strings/mailellipsisarialabeltext.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { ControlIcons } from 'owa-control-icons';
import {
    DisplayOption,
    FilterableMenuItem,
    FilterableMenuItemArgs,
    FilterableCommandBar,
} from 'owa-filterable-menu';
import { TabViewState, lazyCloseTab } from 'owa-tab-store';

export interface SecondaryReadingPaneTabCommandingBarProps {
    tab: TabViewState;
    readingPaneOff: boolean;
    renderCustomItem?: () => JSX.Element;
}

export default observer(function SecondaryReadingPaneTabCommandingBar(
    props: SecondaryReadingPaneTabCommandingBarProps
) {
    const closeMenuItem = useComputed(
        (): FilterableMenuItem => {
            const { tab } = props;
            return new FilterableMenuItem({
                [FilterableMenuItemArgs.icon]: ControlIcons.Cancel,
                [FilterableMenuItemArgs.onClick]: () => {
                    lazyCloseTab.importAndExecute(tab);
                },
                [FilterableMenuItemArgs.displayOption]: DisplayOption.Right,
            });
        }
    );
    const customMenuItem = useComputed(
        (): FilterableMenuItem => {
            return new FilterableMenuItem({
                [FilterableMenuItemArgs.name]: 'customItem',
                [FilterableMenuItemArgs.displayOption]: DisplayOption.Left,
                [FilterableMenuItemArgs.onRender]: () => {
                    // Always render item container since it's responsible for left padding
                    return props.renderCustomItem?.();
                },
            });
        }
    );
    return (
        <FilterableCommandBar
            filterableItems={
                props.readingPaneOff
                    ? [closeMenuItem.get(), customMenuItem.get()]
                    : [customMenuItem.get()]
            }
            elipisisAriaLabel={loc(mailEllipsisAriaLabelText)}
        />
    );
});
