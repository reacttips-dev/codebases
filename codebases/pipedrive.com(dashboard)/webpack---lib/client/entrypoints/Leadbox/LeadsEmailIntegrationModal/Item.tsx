import React from 'react';

import * as S from './LeadsEmailIntegrationModal.styles';

type Props = {
	image: React.ReactNode;
	description: string;
};

export const Item: React.FC<Props> = ({ image, description }) => {
	return (
		<S.Item>
			{image}
			<S.Description>{description}</S.Description>
		</S.Item>
	);
};
