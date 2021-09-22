import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Select, Popover, Spacing } from '@pipedrive/convention-ui-react';
import styled from 'styled-components';
import colors from '../../colors.scss';
import fonts from '../../fonts.scss';
import modalContext from '../../../../utils/context';

const SelectorContent = styled(Select)`
	min-width: 20%;
`;

const BusySelectWrapper = styled.div`
	display: flex;
	align-items: center;
`;

const HelpTooltipWrapper = styled.div`
	height: 16px;
	margin-left: 8px;
	cursor: pointer;
`;

const HelpIcon = styled(Icon)`
	fill: ${(props) =>
		props.helpVisible ? colors.helpIconActiveFill : colors.helpIconDefaultFill};
	&:hover {
		fill: ${(props) =>
			props.helpVisible ? colors.helpIconActiveFill : colors.helpIconHoverFill};
	}
	&:active,
	&:focus {
		fill: ${colors.helpIconActiveFill};
	}
`;

const FreeBusyHelpWrapper = styled(Spacing)`
	width: 282px;
`;

const FreeBusyHelpHeader = styled(Spacing)`
	font-weight: ${fonts.fontBold};
`;

const FreeBusyHelp = ({ translator }) => (
	<FreeBusyHelpWrapper>
		<FreeBusyHelpHeader bottom="s">{translator.gettext('Free/Busy')}</FreeBusyHelpHeader>
		<Spacing>
			{translator.gettext(
				'This option controls whether you are ' +
					'shown as available or unavailable for ' +
					'other meetings at the same time, both ' +
					'in your external calendar and ' +
					'Scheduler.',
			)}
		</Spacing>
	</FreeBusyHelpWrapper>
);

FreeBusyHelp.propTypes = {
	translator: PropTypes.object.isRequired,
};

const BusySelect = ({ value, onChange, placeholder, translator, children }) => {
	const [helpVisible, setHelpVisible] = useState(false);

	return (
		<BusySelectWrapper>
			<SelectorContent
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				data-test="free-busy-selector"
			>
				{children}
			</SelectorContent>
			<HelpTooltipWrapper>
				<Popover
					onVisibilityChange={(visible) => setHelpVisible(visible)}
					placement="top"
					content={<FreeBusyHelp translator={translator} />}
				>
					<HelpIcon helpVisible={helpVisible} icon="help" size="s" />
				</Popover>
			</HelpTooltipWrapper>
		</BusySelectWrapper>
	);
};

BusySelect.propTypes = {
	value: PropTypes.any,
	onChange: PropTypes.func,
	placeholder: PropTypes.string,
	children: PropTypes.any,
	translator: PropTypes.object.isRequired,
};

export default modalContext(BusySelect);
