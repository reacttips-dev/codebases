import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { Button, ButtonGroup, Icon, Tooltip } from '@pipedrive/convention-ui-react';

import { ViewTypes } from '../../../utils/constants';

import { Container } from './StyledComponents';
export interface SwitchButtonProps {
	activeView: ViewTypes;
	className?: string;
}

const SwitchButton: React.FunctionComponent<SwitchButtonProps> = (props) => {
	const translator = useTranslator();

	return (
		<Container>
			<ButtonGroup>
				<Tooltip placement="bottom" content={<span>{translator.gettext('Pipeline')}</span>}>
					<Button
						active={props.activeView === ViewTypes.PIPELINE}
						className={props.className}
						href="/pipeline"
					>
						<Icon icon="pipeline" size="s" />
					</Button>
				</Tooltip>
				<Tooltip placement="bottom" content={<span>{translator.gettext('List')}</span>}>
					<Button className={props.className} rel="noreferrer noopener" href="/deals">
						<Icon icon="list" size="s" />
					</Button>
				</Tooltip>
				<Tooltip placement="bottom" content={<span>{translator.gettext('Forecast')}</span>}>
					<Button
						active={props.activeView === ViewTypes.FORECAST}
						className={props.className}
						rel="noreferrer noopener"
						href="/timeline"
					>
						<Icon icon="forecast" size="s" />
					</Button>
				</Tooltip>
			</ButtonGroup>
		</Container>
	);
};

export default SwitchButton;
