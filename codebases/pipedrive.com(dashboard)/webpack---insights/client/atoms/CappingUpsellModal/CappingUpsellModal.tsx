import React from 'react';
import { cloneDeep } from 'lodash';
import { useReactiveVar } from '@apollo/client';

import { get, getCompanyTierCode, isAdmin } from '../../api/webapp';
import { CAPPING_REPORT_KEY } from '../../shared/featureCapping/cappingConstants';
import { Tiers } from '../../types/feature-capping';
import { getCapMapping } from '../../api/commands/capping';
import { capMappingState } from '../../api/vars/capMappingState';

const CappingUpsellModal = ({
	visible,
	setVisible,
}: {
	visible: boolean;
	setVisible: (visible: boolean) => void;
}): JSX.Element => {
	const tierCode = getCompanyTierCode();

	if (tierCode === Tiers.DIAMOND) {
		return null;
	}

	const { loading, error } = useReactiveVar(capMappingState);
	const CappingDialog = get().cappingDialog;
	const { mapping: tierLimitsMapping } = getCapMapping();
	const tierLimits = cloneDeep(tierLimitsMapping);

	return (
		<CappingDialog
			limitType={CAPPING_REPORT_KEY}
			tierCode={tierCode}
			tierLimits={tierLimits}
			canBill={isAdmin()}
			visible={visible}
			onClose={() => setVisible(false)}
			loading={loading}
			error={error}
		/>
	);
};

export default CappingUpsellModal;
