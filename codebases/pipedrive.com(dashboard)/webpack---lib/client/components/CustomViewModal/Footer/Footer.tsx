import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { Button } from '@pipedrive/convention-ui-react';
import { ModalStatus } from 'Components/CustomViewModal/types';

import * as S from './Footer.styles';
import { SavedWithFilterWarning } from './SavedWithFilterWarning';

type Props = {
	modalStatus: ModalStatus;
	isSaveButtonDisabled: boolean;
	areColumnsSavedWithFilter: boolean;
	onDefaultClick: () => void;
	onCloseClick: () => void;
	onSaveClick: () => void;
};

export const Footer = ({
	modalStatus,
	areColumnsSavedWithFilter,
	isSaveButtonDisabled,
	onCloseClick,
	onDefaultClick,
	onSaveClick,
}: Props) => {
	const translator = useTranslator();
	const isAnyActionDisabled = modalStatus !== 'IDLE';
	const isUpdateInProgress = modalStatus === 'UPDATE';

	return (
		<>
			{areColumnsSavedWithFilter && <SavedWithFilterWarning />}
			<S.Footer>
				<Button
					loading={isUpdateInProgress}
					disabled={isAnyActionDisabled}
					type="submit"
					onClick={onDefaultClick}
				>
					{translator.gettext('Default')}
				</Button>
				<S.Actions>
					<Button disabled={isAnyActionDisabled} type="button" onClick={onCloseClick}>
						{translator.gettext('Cancel')}
					</Button>

					<Button
						loading={isUpdateInProgress}
						disabled={isSaveButtonDisabled}
						color="green"
						type="submit"
						onClick={onSaveClick}
					>
						{translator.gettext('Save')}
					</Button>
				</S.Actions>
			</S.Footer>
		</>
	);
};
