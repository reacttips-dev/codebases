import { CommandingViewMode } from 'owa-outlook-service-option-store/lib/store/schema/options/CommandingOptions';
import { createStore } from 'satcheljs';
import type CommandRibbonStore from './schema/CommandRibbonStore';

const defaultCommandRibbonStore = <CommandRibbonStore>{
    viewMode: CommandingViewMode.CommandBar,
};

export const getStore = createStore<CommandRibbonStore>('CommandRibbon', defaultCommandRibbonStore);
export default getStore();
