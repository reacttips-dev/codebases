export type VisibilityValue = 'PRIVATE' | 'SHARED' | 'SHARED_BELOW' | 'GLOBAL';
export type VisibilityRoleId = 1 | 3 | 5 | 7;

const mapValues =
	<K extends string | number, V>(map: Record<K, V>) =>
	(val: string | number | null): V | null => {
		if (val && val in map) {
			return map[val as K];
		}

		return null;
	};

export const getVisibilityRoleId = mapValues<VisibilityValue, VisibilityRoleId>({
	PRIVATE: 1,
	SHARED: 3,
	SHARED_BELOW: 5,
	GLOBAL: 7,
});

export const getVisibilityValue = mapValues<VisibilityRoleId, VisibilityValue>({
	1: 'PRIVATE',
	3: 'SHARED',
	5: 'SHARED_BELOW',
	7: 'GLOBAL',
});

export const roles: Record<number, VisibilityValue> = {
	1: 'PRIVATE',
	3: 'SHARED',
	5: 'SHARED_BELOW',
	7: 'GLOBAL',
};
