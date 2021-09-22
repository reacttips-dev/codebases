import React, { useRef } from 'react';
import ConditionalTooltip from '../../Shared/ConditionalTooltip';
import { Title } from './StyledComponents';

interface StageNameProps {
	name: string;
}

const StageName: React.FunctionComponent<StageNameProps> = (props) => {
	const { name } = props;
	const element = useRef(null);

	const isTooltipVisible = element.current && element.current.scrollWidth > element.current.clientWidth;

	return (
		<ConditionalTooltip
			condition={isTooltipVisible}
			placement="top"
			content={<span>{name}</span>}
			portalTo={() => document.body}
			innerRefProp="ref"
		>
			<div>
				<Title ref={element}>{name}</Title>
			</div>
		</ConditionalTooltip>
	);
};

export default StageName;
