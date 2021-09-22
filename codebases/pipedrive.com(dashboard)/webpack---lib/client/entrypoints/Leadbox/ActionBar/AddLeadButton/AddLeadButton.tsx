import React, { useState, useContext } from 'react';
import { Popover, Button } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { WebappApiContext } from 'Components/WebappApiContext';
import { useAddLeadModal } from 'Leadbox/hooks/useAddLeadModal';

import * as S from './AddLeadButton.styles';

export const AddLeadButton = () => {
	const translator = useTranslator();
	const [isOpen, setIsOpen] = useState(false);
	const WebappAPIContext = useContext(WebappApiContext);
	const {
		permissions: { canUseImport },
	} = WebappAPIContext;

	const handleOpenAddModal = useAddLeadModal();

	const handleVisibilityChange = (visibility: boolean) => {
		setIsOpen(visibility);
	};

	return (
		<S.Wrapper>
			<Button
				color="green"
				onClick={handleOpenAddModal}
				aria-label={translator.gettext('Add lead')}
				data-testid="AddLeadButton"
			>
				<span>{translator.gettext('Add lead')}</span>
			</Button>
			{canUseImport && (
				<Popover
					placement="bottom-start"
					content={
						<div style={{ padding: '8px 0' }}>
							<S.StyledOption onClick={handleOpenAddModal}>
								{translator.gettext('Add lead')}
							</S.StyledOption>
							<S.StyledOption href="/settings/import">
								{translator.gettext('Import leads')}
							</S.StyledOption>
						</div>
					}
					spacing="none"
					visible={isOpen}
					onVisibilityChange={handleVisibilityChange}
				>
					<div style={{ display: 'flex' }}>
						<S.DropdownTrigger color="green">
							<S.Icon $isOpen={isOpen} icon="triangle-down" color="white" />
						</S.DropdownTrigger>
					</div>
				</Popover>
			)}
		</S.Wrapper>
	);
};
