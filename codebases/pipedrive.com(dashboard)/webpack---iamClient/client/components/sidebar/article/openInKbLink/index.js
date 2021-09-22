import React from 'react';
import PropTypes from 'prop-types';
import translate from 'containers/translation';
import { Icon } from '@pipedrive/convention-ui-react';

import style from './style.css';

const openInKbLink = ({
	gettext,
	url,
	trackExternalLink,
}) => {
	return (
		<div className={style.OpenInKb}>
			<a
				className={style.OpenInKb__link}
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				onClick={(ev) => trackExternalLink(ev.target.href, 'open_in_kb', 'knowledge_base')}
			>
				{gettext('Open in Knowledge base')}
				<Icon
					className={style.OpenInKb__icon}
					icon="redirect"
					color="blue"
					size="s"
				/>
			</a>
		</div>
	);
};

openInKbLink.propTypes = {
	gettext: PropTypes.func.isRequired,
	url: PropTypes.string.isRequired,
	trackExternalLink: PropTypes.func.isRequired,
};

export default translate()(openInKbLink);
