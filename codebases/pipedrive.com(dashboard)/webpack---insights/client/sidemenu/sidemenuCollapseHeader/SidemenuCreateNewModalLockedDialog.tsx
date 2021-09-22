import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';

import { DashboardLockedDialog } from '../../shared';
import { ModalType } from '../../utils/constants';
import usePlanPermissions from '../../hooks/usePlanPermissions';

interface SidemenuCreateNewModalLockedDialogProps {
	setVisibleModal: React.Dispatch<React.SetStateAction<ModalType | boolean>>;
}

const SidemenuCreateNewModalLockedDialog: React.FC<SidemenuCreateNewModalLockedDialogProps> =
	({ setVisibleModal }) => {
		const translator = useTranslator();
		const { isAdmin } = usePlanPermissions();

		return (
			<DashboardLockedDialog
				isAdmin={isAdmin}
				setVisibleModal={setVisibleModal}
				translator={translator}
			/>
		);
	};

export default React.memo(SidemenuCreateNewModalLockedDialog);
