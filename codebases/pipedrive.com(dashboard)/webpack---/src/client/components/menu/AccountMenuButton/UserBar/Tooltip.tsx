import React from 'react';
import styled from 'styled-components';

import fonts from '@pipedrive/convention-ui-css/dist/amd/fonts.js';

import { HeaderTooltip } from '../../../Header';

import { Props as UserBarProps } from './';

const Wrapper = styled.div`
	text-align: right;
`;

const Name = styled.p`
	font-weight: ${fonts['$font-weight-semi']};
`;

type ContentProps = Pick<UserBarProps, 'name' | 'company'>;

function TooltipContent({ name, company }: ContentProps) {
	return (
		<Wrapper>
			<Name>{name}</Name>
			<p>{company}</p>
		</Wrapper>
	);
}

interface Props extends Pick<UserBarProps, 'hasMultipleCompanies' | 'name' | 'company'> {
	children: React.ReactNode;
}

function Tooltip({ hasMultipleCompanies, name, company, children }: Props) {
	if (hasMultipleCompanies) {
		return <>{children}</>;
	}

	return (
		<HeaderTooltip content={<TooltipContent name={name} company={company} />} placement="bottom-end">
			{children}
		</HeaderTooltip>
	);
}

export default Tooltip;
