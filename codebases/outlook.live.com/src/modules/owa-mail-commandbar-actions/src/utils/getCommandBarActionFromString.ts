import type { CommandBarAction } from '../store/schema/CommandBarAction';
import defaultCommandBarConfig from './defaultCommandBarConfig';
import { isFeatureEnabled } from 'owa-feature-flags';

export function getCommandBarActionFromString(
    actionsString: string | undefined
): CommandBarAction[] {
    if (!isFeatureEnabled('tri-commandBarCustomization') || !actionsString) {
        return defaultCommandBarConfig.slice();
    }
    return actionsString.split(',').map(Number) as CommandBarAction[];
}
