import React, { forwardRef } from 'react';

import Tooltip from './Tooltip';
import { Wrapper, Avatar, UserInfo, Name, Company } from './styled';

export interface Props {
	hasMultipleCompanies: boolean;
	isActive: boolean;
	name: string;
	company: string;
	avatarUrl: string;
	onClick: (ev: React.SyntheticEvent) => void;
}

function UserBar({ hasMultipleCompanies, isActive, name, company, avatarUrl, onClick }: Props, ref) {
	return (
		<Tooltip hasMultipleCompanies={hasMultipleCompanies} name={name} company={company}>
			<Wrapper
				ref={ref}
				active={isActive}
				onClick={onClick}
				hasMultipleCompanies={hasMultipleCompanies}
				aria-label={name}
				tabIndex={0}
				data-test="account-menu-button"
				yellow={false}
				lastItem={false}
			>
				<Avatar type="user" name={name} img={avatarUrl} />
				{hasMultipleCompanies && (
					<UserInfo>
						<Name>{name}</Name>
						<Company>{company}</Company>
					</UserInfo>
				)}
			</Wrapper>
		</Tooltip>
	);
}

export default forwardRef(UserBar);
