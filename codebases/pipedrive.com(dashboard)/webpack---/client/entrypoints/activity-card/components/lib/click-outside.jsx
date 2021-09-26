import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const BackDrop = styled.div`
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0);
	z-index: 2000;
`;

/**
 * Component that runs a function if you click outside the wrapped component
 */
const ClickOutside = ({ clickOutside, children }) => {
	const onKeyUp = (e) => {
		if (e.keyCode === 27) {
			clickOutside(e);
		}
	};

	useEffect(() => {
		document.addEventListener('keyup', onKeyUp);

		return () => {
			document.removeEventListener('keyup', onKeyUp);
		};
	}, [children]);

	return (
		<span>
			<BackDrop onClick={(e) => clickOutside(e)} />
			{children}
		</span>
	);
};

ClickOutside.propTypes = {
	clickOutside: PropTypes.func.isRequired,
	children: PropTypes.element.isRequired,
};

export default ClickOutside;
