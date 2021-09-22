import React from 'react';
import PropTypes from 'prop-types';
import PDBox from 'components/gettingStarted/pdBox';

import style from './style.css';

function footer({
	hide,
	hideLabel,
	stages,
}) {
	return (
		<div className={style.Footer}>
			<PDBox stages={stages} />
			<div className={style.Footer__skip} onClick={hide}>
				{hideLabel}
			</div>
		</div>
	);
}

footer.propTypes = {
	hide: PropTypes.func.isRequired,
	hideLabel: PropTypes.string.isRequired,
	stages: PropTypes.array.isRequired,
};

export default footer;

