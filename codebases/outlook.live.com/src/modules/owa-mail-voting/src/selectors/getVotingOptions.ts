import { getStore } from '../store/store';
import type VotingOption from '../store/schema/VotingOption';

export default function getVotingOptions(): VotingOption[] {
    const store = getStore();
    return store?.options ? store.options : [];
}
