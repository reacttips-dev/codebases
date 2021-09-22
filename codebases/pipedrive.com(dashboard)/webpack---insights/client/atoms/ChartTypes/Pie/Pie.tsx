import React from 'react';
import {
	Tooltip,
	PieChart,
	Cell,
	Pie as RechartPie,
	ResponsiveContainer,
} from 'recharts';

import { getColor, getCursor } from '../../../utils/styleUtils';
import { isPublicPage } from '../../../utils/helpers';
import ChartTooltip from '../../../atoms/ChartTooltip/ChartTooltip';
import PieChartLabel from '../../../atoms/PieChartLabel/PieChartLabel';
import getChartTooltipItems from '../../ChartTooltip/getChartTooltipItems';
import { CONTAINER_HEIGHT } from '../chartStyleConstants';
import { UniqueSegment } from '../../../types/data-layer';
import { ListViewSegmentDataType } from '../../../types/list-view';

interface PieProps {
	uniqueSegments: UniqueSegment[];
	isShownAsWidget: boolean;
	hasSegment: boolean;
	showChartListView: (data: ListViewSegmentDataType) => void;
	labelValueFormatter: (value: number) => string | number;
	tooltipValueFormatter: (value: number) => string | number;
}

const Pie = ({
	uniqueSegments = [],
	isShownAsWidget,
	hasSegment,
	showChartListView,
	labelValueFormatter,
	tooltipValueFormatter,
}: PieProps) => {
	const CustomTooltip = (props: any) => {
		const { active, payload } = props;

		const tooltipItems = getChartTooltipItems(
			payload,
			'name',
			'payload.fill',
			(value: number) => tooltipValueFormatter(value),
		);

		return active ? <ChartTooltip tooltipItems={tooltipItems} /> : null;
	};

	const getLabel = (props: any) => {
		return (
			<PieChartLabel
				props={props}
				isShownAsWidget={isShownAsWidget}
				valueFormatter={labelValueFormatter}
				minChars={8}
				maxChars={10}
			/>
		);
	};

	return (
		<ResponsiveContainer
			height={isShownAsWidget ? '100%' : CONTAINER_HEIGHT}
		>
			<PieChart margin={{ right: 32, left: 32 }}>
				<RechartPie
					data={uniqueSegments}
					dataKey="value"
					cx="50%"
					cy="50%"
					outerRadius="72%"
					labelLine={false}
					isAnimationActive={false}
					label={getLabel}
				>
					{uniqueSegments.map((entry, index) => (
						<Cell
							key={index}
							cursor={getCursor()}
							fill={getColor(entry.name, index, hasSegment)}
							onClick={() =>
								!isPublicPage() &&
								showChartListView({
									groupId: entry?.unsanitizedId,
									listName: entry?.name,
								})
							}
						/>
					))}
				</RechartPie>
				<Tooltip content={<CustomTooltip />} />
			</PieChart>
		</ResponsiveContainer>
	);
};

export default Pie;
