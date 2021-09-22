import React, { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './Board.pcss';

interface BoardProps {
	className?: string;
	children?: ReactNode;
}

const Board = React.forwardRef<any, BoardProps>(
	({ className, children }, ref) => {
		return (
			<div ref={ref} className={classNames(styles.board, className)}>
				{children}
			</div>
		);
	},
);

export default Board;
