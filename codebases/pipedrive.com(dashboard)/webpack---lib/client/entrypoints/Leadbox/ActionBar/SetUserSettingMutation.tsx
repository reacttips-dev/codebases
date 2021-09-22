import { graphql, useMutation } from '@pipedrive/relay';

import { SetUserSettingMutation, UserSettingKey } from './__generated__/SetUserSettingMutation.graphql';

const mutation = graphql`
	mutation SetUserSettingMutation($key: UserSettingKey!, $value: String) {
		setUserSetting(key: $key, value: $value) {
			... on GraphQLUserSettingResultData {
				userSetting {
					id
					key
					value
				}
			}
		}
	}
`;

export const useSetUserSettingMutation = () => {
	const [call] = useMutation<SetUserSettingMutation>(mutation);

	return (key: UserSettingKey, value: string | null) => call({ variables: { key, value } });
};
