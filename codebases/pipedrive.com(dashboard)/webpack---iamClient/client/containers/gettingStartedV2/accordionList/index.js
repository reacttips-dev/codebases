import React from 'react';
import PropTypes  from 'prop-types';

import Accordion from '../accordion';

const AccordionList = ({ list, onClick }) => {
	return (
		<div>
			{list.map((props, key) => (
				<Accordion {...props} key={key} id={key} onClick={onClick} />
			))}
		</div>
	);
};

AccordionList.propTypes = {
	list: PropTypes.array.isRequired,
	onClick: PropTypes.func,
};

export default AccordionList;