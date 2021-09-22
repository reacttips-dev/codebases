import getExtensibilityState from 'owa-addins-store/lib/store/getExtensibilityState';
import { translatorAddinId } from './constants';

export default function isTranslatorEnabled(): boolean {
    const state = getExtensibilityState();
    const context = state ? state.Context : null;
    const installedExts = context
        ? context.Extensions.filter(ext => ext.Id == translatorAddinId)
        : [];
    return installedExts.length > 0 ? installedExts[0].Enabled : false;
}
