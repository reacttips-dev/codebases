import { DisplayOption } from 'owa-filterable-menu';
import { CommandBarAction, getStore } from 'owa-mail-commandbar-actions';
import { DirectionalHint } from '@fluentui/react/lib/ContextualMenu';

export function getCommandBarDisplayOption(action: CommandBarAction): DisplayOption {
    return getStore().surfaceActions.includes(action) ? DisplayOption.Left : DisplayOption.Overflow;
}

export function getCommandBarDirectionalHint(action: CommandBarAction): DirectionalHint {
    return getStore().surfaceActions.includes(action)
        ? DirectionalHint.bottomLeftEdge
        : DirectionalHint.rightTopEdge;
}
