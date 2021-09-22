import React from 'react';
import Panel from 'components/sidebar/panel';

import style from './style.css';

function sidebar(props) {
	return (
		<Panel {...props} className={style.GSPanel} />
	);
}

export default sidebar;
