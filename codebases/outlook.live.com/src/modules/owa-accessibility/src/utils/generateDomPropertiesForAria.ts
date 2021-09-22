import type { AriaProperties, AriaPropertiesWithId } from './ariaProperties';

function joinListOfTokens(tokens: any[] | any) {
    if (Array.isArray(tokens)) {
        return tokens.join(' ');
    } else {
        return tokens;
    }
}

export function generateDomPropertiesForAria(ariaProps: AriaProperties | AriaPropertiesWithId) {
    if (!ariaProps) {
        return null;
    }

    let domProperties = {};
    let ariaKeys = Object.keys(ariaProps);

    /* tslint:disable:no-string-literal */
    /* Can't access or assign 'aria-*' properties without string literals */
    for (let i = 0; i < ariaKeys.length; i++) {
        let key = ariaKeys[i];
        switch (key) {
            case 'role':
                domProperties['role'] = ariaProps.role;
                break;
            case 'id':
                domProperties['id'] = (<AriaPropertiesWithId>ariaProps).id;
                break;
            case 'activeDescendant':
                domProperties['aria-activedescendant'] = ariaProps.activeDescendant;
                break;
            case 'atomic':
                domProperties['aria-atomic'] = ariaProps.atomic;
                break;
            case 'autocomplete':
                domProperties['aria-autocomplete'] = ariaProps.autocomplete;
                break;
            case 'busy':
                domProperties['aria-busy'] = ariaProps.busy;
                break;
            case 'checked':
                domProperties['aria-checked'] = ariaProps.checked;
                break;
            case 'controls':
                domProperties['aria-controls'] = joinListOfTokens(ariaProps.controls);
                break;
            case 'describedBy':
                domProperties['aria-describedby'] = joinListOfTokens(ariaProps.describedBy);
                break;
            case 'disabled':
                domProperties['aria-disabled'] = ariaProps.disabled;
                break;
            case 'dropEffect':
                domProperties['aria-dropeffect'] = joinListOfTokens(ariaProps.dropEffect);
                break;
            case 'expanded':
                domProperties['aria-expanded'] = ariaProps.expanded;
                break;
            case 'flowTo':
                domProperties['aria-flowto'] = joinListOfTokens(ariaProps.flowTo);
                break;
            case 'grabbed':
                domProperties['aria-grabbed'] = ariaProps.grabbed;
                break;
            case 'hasPopup':
                domProperties['aria-haspopup'] = ariaProps.hasPopup;
                break;
            case 'hidden':
                domProperties['aria-hidden'] = ariaProps.hidden;
                break;
            case 'invalid':
                domProperties['aria-invalid'] = ariaProps.invalid;
                break;
            case 'label':
                domProperties['aria-label'] = ariaProps.label;
                break;
            case 'labelledBy':
                domProperties['aria-labelledby'] = joinListOfTokens(ariaProps.labelledBy);
                break;
            case 'level':
                domProperties['aria-level'] = ariaProps.level;
                break;
            case 'live':
                domProperties['aria-live'] = ariaProps.live;
                break;
            case 'multiline':
                domProperties['aria-multiline'] = ariaProps.multiline;
                break;
            case 'multiselectable':
                domProperties['aria-multiselectable'] = ariaProps.multiselectable;
                break;
            case 'orientation':
                domProperties['aria-orientation'] = ariaProps.orientation;
                break;
            case 'owns':
                domProperties['aria-owns'] = joinListOfTokens(ariaProps.owns);
                break;
            case 'positionInSet':
                domProperties['aria-posinset'] = ariaProps.positionInSet;
                break;
            case 'pressed':
                domProperties['aria-pressed'] = ariaProps.pressed;
                break;
            case 'readonly':
                domProperties['aria-readonly'] = ariaProps.readonly;
                break;
            case 'relevant':
                domProperties['aria-relevant'] = joinListOfTokens(ariaProps.relevant);
                break;
            case 'required':
                domProperties['aria-required'] = ariaProps.required;
                break;
            case 'selected':
                domProperties['aria-selected'] = ariaProps.selected;
                break;
            case 'setSize':
                domProperties['aria-setsize'] = ariaProps.setSize;
                break;
            case 'sort':
                domProperties['aria-sort'] = ariaProps.sort;
                break;
            case 'valueMax':
                domProperties['aria-valuemax'] = ariaProps.valueMax;
                break;
            case 'valueMin':
                domProperties['aria-valuemin'] = ariaProps.valueMin;
                break;
            case 'valueNow':
                domProperties['aria-valuenow'] = ariaProps.valueNow;
                break;
            case 'valueText':
                domProperties['aria-valuetext'] = ariaProps.valueText;
                break;
        }
    }
    /* tslint:enable:no-string-literal */

    return domProperties;
}
