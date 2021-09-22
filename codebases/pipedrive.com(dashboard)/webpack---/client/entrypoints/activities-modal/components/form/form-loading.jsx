import React, { createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';
import styled from 'styled-components';

import colors from '../../colors.scss';

const ICON_RADIUS = 12;
const LoadingRow = ({ height, width, offsetY, showIcon }) => (
	<>
		{showIcon && <circle cx={ICON_RADIUS} cy={offsetY + ICON_RADIUS} r={ICON_RADIUS} />}
		<rect x="36" y={offsetY} rx="2" ry="2" width={width - 36} height={height} />
	</>
);

LoadingRow.defaultProps = {
	height: 32,
	offsetY: 0,
	showIcon: false,
};

LoadingRow.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	offsetY: PropTypes.number.isRequired,
	showIcon: PropTypes.bool.isRequired,
};

const DEFAULT_HEIGHT = 32;
const DEFAULT_MARGIN_BOTTOM = 16;
const calculateRowsParameters = (rowsData) => {
	const rowsProps = [];

	let totalOffset = 0;

	rowsData.forEach((row) => {
		rowsProps.push({
			showIcon: row.showIcon,
			height: row.height,
			offsetY: totalOffset,
		});
		row.offsetY = totalOffset;
		totalOffset +=
			(row.height || DEFAULT_HEIGHT) +
			(typeof row.marginBottom === 'number' ? row.marginBottom : DEFAULT_MARGIN_BOTTOM);
	});

	return { rows: rowsProps, totalHeight: totalOffset };
};
const { rows, totalHeight } = calculateRowsParameters([
	{ height: 40, marginBottom: 8 },
	{},
	{ showIcon: true },
	{ showIcon: true },
	{ showIcon: true },
	{ showIcon: true, height: 116 },
	{ showIcon: true },
	{ showIcon: true, marginBottom: 8 },
	{ marginBottom: 8 },
	{ marginBottom: 0 },
]);

const StyledLoader = styled(ContentLoader)`
	width: 100%;
	height: ${totalHeight}px;
`;

const FormLoading = () => {
	const loadingRef = createRef();
	const [width, setWidth] = useState(200);

	useEffect(() => {
		if (loadingRef.current) {
			setWidth(loadingRef.current.getBoundingClientRect().width);
		}
	}, [loadingRef.current]);

	return (
		<div ref={loadingRef}>
			<StyledLoader
				height={totalHeight}
				width="100%"
				primaryColor={colors.loadingPrimaryColor}
				ariaLabel={false}
			>
				{rows.map((rowProps, index) => (
					<LoadingRow key={index} width={width} {...rowProps} />
				))}
			</StyledLoader>
		</div>
	);
};

export default FormLoading;
