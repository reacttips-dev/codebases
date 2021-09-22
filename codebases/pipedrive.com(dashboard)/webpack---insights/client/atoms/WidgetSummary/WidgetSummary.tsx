import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';

import CollapsingList from '../../molecules/CollapsingList';

import styles from './WidgetSummary.pcss';

type FilterDataItem = {
	title: string;
	tooltip: string;
};

interface WidgetSummaryProps {
	filterData: FilterDataItem[];
}

const WidgetSummary: React.FC<WidgetSummaryProps> = ({ filterData }) => {
	const translator = useTranslator();

	if (filterData?.length) {
		return <CollapsingList data={filterData} alignment="left" />;
	}

	return (
		<span className={styles.noConditionsText}>
			{translator.gettext('No conditions applied')}
		</span>
	);
};

export default WidgetSummary;
