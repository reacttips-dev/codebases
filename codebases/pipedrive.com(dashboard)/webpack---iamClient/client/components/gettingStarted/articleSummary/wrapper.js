import React from 'react';
import PropTypes  from 'prop-types';

const wrapper = (props) => {
	if (props.articleId) {
		return (
			<div className={props.className} onClick={() => {
				props.open(props.articleId);
			}}>
				{props.children}
			</div>
		);
	}

	if (props.url) {
		return (
			<a className={props.className} href={props.url} target={props.target} onClick={props.onClick}>
				{props.children}
			</a>
		);
	}

	return (
		<div className={props.className}>
			{props.children}
		</div>
	);
};

wrapper.propTypes = {
	children: PropTypes.node.isRequired,
	open: PropTypes.func.isRequired,
	articleId: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.object,
	]),
	url: PropTypes.string,
	target: PropTypes.string,
	onClick: PropTypes.func,
	className: PropTypes.string,
};

export default wrapper;
