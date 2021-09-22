import React, { useMemo } from 'react';
import { useTranslator } from '@pipedrive/react-utils';

import UserSelectInput, { SearchOption } from './UserSelectInput';
import {
	SharingOption,
	SharingOptionType,
} from '../../../../types/apollo-query-types';
import { getActiveTeams, getActiveUsers } from '../../../../api/webapp';

interface UserSelectorProps {
	selectedOptions: SharingOption[];
	onAdd: (type: string, id: number) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({
	selectedOptions,
	onAdd,
}) => {
	const translator = useTranslator();
	const companyUsers = getActiveUsers();
	const teams = getActiveTeams();

	const addOption = (option: SearchOption) => {
		onAdd(option?.type, option?.id);
	};

	const getUnselectedOptions = (items: SearchOption[]) =>
		items.filter(
			(item) => !selectedOptions.some((option) => option.id === item.id),
		);

	const otherActiveUsers = useMemo(() => {
		const filteredUsers = companyUsers.filter(
			(companyUser: Pipedrive.User) => !companyUser.is_you,
		);

		return filteredUsers.map((user: Pipedrive.User) => ({
			id: user.id,
			name: user.name,
			iconUrl: user.icon_url,
			type: SharingOptionType.USER,
		}));
	}, []);
	const allActiveTeams = useMemo(
		() =>
			teams.map((team: Pipedrive.Team) => ({
				id: team.id,
				name: team.name,
				type: SharingOptionType.TEAM,
				numberOfUsers: team.users.length,
			})),
		[],
	);
	const everyone = {
		id: 0,
		name: translator.gettext('Everyone'),
		type: SharingOptionType.EVERYONE,
	};

	return (
		<div data-test="share-user-select">
			<UserSelectInput
				placeholder={translator.gettext('Find users')}
				options={{
					everyone: getUnselectedOptions([everyone]),
					users: getUnselectedOptions(otherActiveUsers),
					teams: getUnselectedOptions(allActiveTeams),
				}}
				onOptionSelected={addOption}
			/>
		</div>
	);
};

export default UserSelector;
