import { TriggeredCommand } from '@atlassian/butler-command-parser';
import { SharedState } from '@trello/shared-state';

// Expose a singleton that contains the current working draft of a new Butler
// rule created from the list menu. Unfortunately, we need to maintain it this
// way instead of using Context because the list menu isn't in a React context.
// @ts-expect-error -- Non-optional fields are populated in `hydrateListRuleTemplate`.
export const listRuleDraftState = new SharedState<TriggeredCommand>({});
