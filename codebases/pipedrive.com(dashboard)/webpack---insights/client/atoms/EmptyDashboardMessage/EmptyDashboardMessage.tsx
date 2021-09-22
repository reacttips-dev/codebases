import React, { useState } from 'react';
import classNames from 'classnames';
import { useTranslator } from '@pipedrive/react-utils';

import EmptyDashboard from '../../utils/svg/EmptyDashboard.svg';
import { NewItemModal } from '../../shared';
import useReportModalAndDialogOptions from '../../hooks/modalAndDialogOptions/useReportModalAndDialogOptions';
import { ModalType } from '../../utils/constants';
import { getCappings } from '../../api/commands/capping';
import { getReportsLimitData } from '../../shared/featureCapping/cappingUtils';
import CappingUpsellModal from '../CappingUpsellModal';
import localState from '../../utils/localState';
import { SharedAddModalView } from '../../types/modal';

import styles from './EmptyDashboardMessage.pcss';

const EmptyDashboardMessage = ({ isHover }: { isHover: boolean }) => {
	const translator = useTranslator();
	const [visibleUpsellModal, setVisibleUpsellModal] =
		useState<boolean>(false);
	const [visibleModal, setVisibleModal] = useState<ModalType>(null);
	const reportOptions = useReportModalAndDialogOptions();
	const { cap: cappingLimit } = getCappings();
	const { getCurrentUserSettings } = localState();
	const { reports } = getCurrentUserSettings();
	const { hasReachedReportsLimit } = getReportsLimitData(
		reports,
		cappingLimit,
	);

	const reportModalAndDialogOptions = reportOptions({
		setVisibleModal,
	});

	const handleClick = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();

		if (hasReachedReportsLimit) {
			setVisibleUpsellModal(true);

			return;
		}

		setVisibleModal(ModalType.REPORT_CREATE);
	};

	return (
		<div
			className={classNames(styles.message, { [styles.hover]: isHover })}
		>
			<div>
				<EmptyDashboard />
				<h1 className={styles.title}>
					{translator.gettext('Start building your dashboard')}
				</h1>
				<p className={styles.subtitle}>
					{translator.gettext(
						'Drop existing reports here from the sidebar or',
					)}{' '}
					<a href="#0" className={styles.link} onClick={handleClick}>
						{translator.gettext('add a new report')}
					</a>
				</p>
			</div>

			{visibleUpsellModal && (
				<CappingUpsellModal
					visible={visibleUpsellModal}
					setVisible={setVisibleUpsellModal}
				/>
			)}

			{visibleModal && (
				<NewItemModal
					{...reportModalAndDialogOptions
						.modal()
						[ModalType.REPORT_CREATE]()}
					type={SharedAddModalView.REPORTS}
				/>
			)}
		</div>
	);
};

export default React.memo(EmptyDashboardMessage);
