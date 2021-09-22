import { useEffect, useState } from 'react';

import { uid } from '../utils/helpers';

const useActionBarTitle = <T extends { id?: string; name?: string }>(
	item: T,
): {
	actionBarTitle: string;
	actionBarTitleKey: string;
	changeActionBarTitle: (
		title: string,
		callback: () => void,
	) => Promise<void>;
} => {
	const [tempTitle, setTempTitle] = useState<string>(null);
	const [actionBarTitleKey, setActionBarTitleKey] = useState<string>(
		item?.id,
	);

	useEffect(() => {
		setTempTitle(null);
	}, [item?.id]);

	const actionBarTitle = tempTitle || item?.name;

	const changeActionBarTitle = async (
		title: string,
		callback: () => void,
	) => {
		if (title) {
			setTempTitle(title);

			if (item.name !== title) {
				callback();
			}
		}

		if (!title) {
			const uniqueId = uid();

			setTempTitle(item?.name);
			setActionBarTitleKey(uniqueId);
		}
	};

	return { actionBarTitle, actionBarTitleKey, changeActionBarTitle };
};

export default useActionBarTitle;
