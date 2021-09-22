import React from 'react';
import { Icon, Spacing, Input } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { Interval, TrackingMetric } from '../../../../types/goals';
import { getIntervalLabel } from '../../goalDetailsModalUtils';
import { getDefaultCurrency } from '../../../../api/webapp';

import styles from './OutcomeSection.pcss';

interface OutcomeSectionProps {
	interval: Interval;
	value: number;
	setValue: (value: number) => void;
	error?: string;
	trackingMetric: TrackingMetric;
}

const OutcomeSection: React.FC<OutcomeSectionProps> = ({
	interval,
	value,
	setValue,
	error,
	trackingMetric,
}) => {
	const translator = useTranslator();

	const valueLabel =
		trackingMetric === TrackingMetric.COUNT
			? translator.gettext('Count')
			: `${translator.gettext('Value')} (${getDefaultCurrency()})`;

	return (
		<div className={styles.outcomeSection}>
			<div className={styles.column}>
				<Spacing bottom="l" />
				<Icon icon="ac-loop" size="s" />
			</div>
			<Spacing horizontal="s" />
			<div className={styles.fullWidthColumn}>
				<Spacing bottom="s">
					<div className={styles.label}>
						{translator.gettext('Interval')}
					</div>
				</Spacing>
				<Input
					className={styles.fullWidth}
					readOnly
					value={getIntervalLabel(interval, translator)}
				/>
			</div>
			<Spacing horizontal="s" />
			<div className={styles.column}>
				<Spacing bottom="s">
					<div className={styles.label}>{valueLabel}</div>
				</Spacing>
				<Input
					type="number"
					data-test="goal-details-modal-target-input"
					min="0"
					value={value?.toString()}
					placeholder={translator.gettext('Insert value')}
					onChange={(event: any) =>
						setValue(Number(event.target.value))
					}
					{...(error ? { color: 'red', message: error } : null)}
				/>
			</div>
		</div>
	);
};

export default OutcomeSection;
