import React, { useRef, useEffect, useState } from 'react';
import { Tooltip } from '@pipedrive/convention-ui-react';

import styles from './TruncatedText.pcss';

interface TruncatedTextProps {
	tooltipText: string;
	children: any;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
	tooltipText,
	children,
}) => {
	const TruncatedTextElement = useRef(null);
	const [isVisible, setIsVisible] = useState({});

	useEffect(() => {
		setIsVisible(
			TruncatedTextElement.current &&
				TruncatedTextElement.current.scrollWidth >
					TruncatedTextElement.current.clientWidth,
		);
	});

	const setTooltipVisibleProps = isVisible ? {} : { visible: false };

	return (
		<div className={styles.truncatedTextWrapper}>
			<Tooltip
				placement="top"
				content={<span>{tooltipText}</span>}
				portalTo={document.body}
				innerRefProp="ref"
				{...setTooltipVisibleProps}
			>
				<div>
					<div
						ref={TruncatedTextElement}
						className={styles.truncatedText}
					>
						<span>{children}</span>
					</div>
				</div>
			</Tooltip>
		</div>
	);
};

export default TruncatedText;
