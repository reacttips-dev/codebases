import PropTypes from 'prop-types';
import React from 'react';

import { ToolbarButton, ToolbarButtonGroup } from '@pipedrive/pd-wysiwyg';

import { getTooltip } from './buttons-tooltips';
import modalContext from '../../../../utils/context';

const buttonGroups = [
	[{ type: 'bold' }, { type: 'italic' }, { type: 'underline' }, { type: 'link' }],
	[
		{ type: 'ul', icon: 'list-bulleted' },
		{ type: 'ol', icon: 'list-numbered' },
	],
	[{ type: 'remove', icon: 'clearformat' }],
];

const DefaultToolbar = ({ translator }) => (
	<>
		{buttonGroups.map((buttons, index) => (
			<ToolbarButtonGroup key={index}>
				{buttons.map(({ type, icon }) => (
					<ToolbarButton
						key={type}
						type={type}
						tooltipText={getTooltip(type, translator)}
						{...(icon ? { icon } : {})}
					/>
				))}
			</ToolbarButtonGroup>
		))}
	</>
);

DefaultToolbar.propTypes = {
	translator: PropTypes.object.isRequired,
};

export default modalContext(DefaultToolbar);
