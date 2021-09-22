import type PersistedAddinCommand from './schema/PersistedAddinCommand';

const innerPersistedAddins: { [key: string]: PersistedAddinCommand } = {};

export default function persistedAddins() {
    return innerPersistedAddins;
}
