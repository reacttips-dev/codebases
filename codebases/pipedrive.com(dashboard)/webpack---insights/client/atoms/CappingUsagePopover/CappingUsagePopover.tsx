import React from 'react';
import { useReactiveVar } from '@apollo/client';

import { get, getCompanyTierCode, isAdmin } from '../../api/webapp';
import { capMappingState } from '../../api/vars/capMappingState';
import { CAPPING_REPORT_KEY } from '../../shared/featureCapping/cappingConstants';
import { Tiers } from '../../types/feature-capping';

const CappingUsagePopover = ({
	usage,
	cappingLimit,
	nextTierLimit,
}: {
	usage: number;
	cappingLimit: number;
	nextTierLimit: number;
}) => {
	const tierCode = getCompanyTierCode();

	if (tierCode === Tiers.DIAMOND) {
		return null;
	}

	const { loading, error } = useReactiveVar(capMappingState);
	const CappingPopover = get().cappingPopover;

	return (
		<CappingPopover
			limitType={CAPPING_REPORT_KEY}
			tierCode={tierCode}
			numberOfItems={usage}
			tierLimit={cappingLimit}
			nextTierLimit={nextTierLimit}
			canBill={isAdmin()}
			loading={loading}
			error={error}
		/>
	);
};

export default CappingUsagePopover;
