import { useContext } from 'react';
import { WebappApiContext } from 'Components/WebappApiContext';
import { UserSettingFilterKeys } from 'Leadbox/UserSettingFilterKeys';

export const useGetFilterIdFromUserSettings = (): (() => string | undefined) => {
	const { userSelf } = useContext(WebappApiContext);

	return () => userSelf.settings.get(UserSettingFilterKeys.FILTER);
};
