import React from 'react';
import classNames from 'classnames';
import { useDrop } from 'react-dnd';

import { ACCEPTED_DROP_TARGET_ITEMS } from '../../utils/constants';

import styles from './DropNewReportArea.pcss';

interface DropNewReportAreaProps {
	title: string;
	isAlreadyInDashboard: boolean;
}

const DropNewReportArea: React.FC<DropNewReportAreaProps> = ({
	title,
	isAlreadyInDashboard,
}) => {
	const [{ isOver }, drop] = useDrop({
		accept: ACCEPTED_DROP_TARGET_ITEMS,
		collect: (monitor) => ({ isOver: monitor.isOver() }),
	});

	return (
		<article
			ref={drop}
			className={classNames(styles.dropNewReportArea, {
				[styles.isAlreadyInDashboard]: isAlreadyInDashboard,
				[styles.hoverDrop]: isOver && !isAlreadyInDashboard,
			})}
		>
			{title}
		</article>
	);
};

export default DropNewReportArea;
