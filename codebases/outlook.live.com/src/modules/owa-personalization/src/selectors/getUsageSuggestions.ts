import store from '../store/Store';
import type { UsageSuggestion } from '../store/schema/PersonalizationSchema';

export default function getUsageSuggestions(key: string): UsageSuggestion[] {
    return store.usageSuggestions?.get(key);
}
