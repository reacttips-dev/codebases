import React from 'react';
import { Button } from '@pipedrive/convention-ui-react';
import PropTypes  from 'prop-types';

import style from './style.css';

const GenericContent = ({ buttonText, bodyText, path, GSVersion, gettingStartedItemClick }) => {
	return (
		<div className={style.GenericContent}>
			<div>
				<div className={style.GenericContent__body}>
					{bodyText}
				</div>
				<Button color="green" href={path} onClick={() => {
					gettingStartedItemClick('link', path, GSVersion);
				}}>
					{ buttonText }
				</Button>
			</div>
		</div>
	);
};

GenericContent.propTypes = {
	buttonText: PropTypes.string.isRequired,
	bodyText: PropTypes.string.isRequired,
	path: PropTypes.string.isRequired,
	GSVersion: PropTypes.object.isRequired,
	gettingStartedItemClick: PropTypes.func.isRequired,
};

export default GenericContent;