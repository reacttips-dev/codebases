import { getLocalizedStringStore } from './store/store';
import { format } from './utilities/format';

export function loc(resourceId: string, ...args: any[]) {
    const locString =
        process.env.NODE_ENV === 'dev'
            ? resourceId
            : getLocalizedStringStore().localizedStrings.get(resourceId) || '';
    return args.length ? format(locString, ...args) : locString;
}
