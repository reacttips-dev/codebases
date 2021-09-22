import type Button from 'owa-service/lib/contract/Button';
import type Control from 'owa-service/lib/contract/Control';
import type ExecuteFunction from 'owa-service/lib/contract/ExecuteFunction';
import type Menu from 'owa-service/lib/contract/Menu';
import type ShowTaskPane from 'owa-service/lib/contract/ShowTaskPane';

export function isTaskPaneAction(control: Control): boolean {
    const button = control as Button;
    const action = button && (button.Action as ShowTaskPane);
    return action && !!action.SourceLocation;
}

export function isExecuteFunctionAction(control: Control): boolean {
    const button = control as Button;
    const action = button && (button.Action as ExecuteFunction);
    return action && !!action.FunctionName;
}

export function isMenuControl(control: Control): boolean {
    const menu = control as Menu;
    return !!menu && !!menu.MenuItems;
}

export function isActionableControl(control: Control): boolean {
    const button = control as Button;
    return button && !!button.Action;
}
