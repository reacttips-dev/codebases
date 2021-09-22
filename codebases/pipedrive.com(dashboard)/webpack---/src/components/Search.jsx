import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import Input from './Input';
import Modal from './Modal';
import ImageOverlay from './ImageOverlay';

import { useClickOutside } from 'hooks/browser';
import { setModalVisible, modalVisibleSelector } from 'store/modules/sharedState';

function Search({ tooltipProps, useSearchHotKey }) {
	const searchRef = useRef(null);
	const dispatch = useDispatch();
	const modalVisible = useSelector(modalVisibleSelector);

	useClickOutside(searchRef, () => dispatch(setModalVisible(false)));

	return (
		<div ref={searchRef}>
			<Input tooltipProps={tooltipProps} useSearchHotKey={useSearchHotKey} />
			{modalVisible && <Modal />}
			<ImageOverlay />
		</div>
	);
}

Search.propTypes = {
	tooltipProps: PropTypes.shape({
		content: PropTypes.object.isRequired,
		style: PropTypes.object.isRequired,
	}).isRequired,
	useSearchHotKey: PropTypes.func.isRequired,
};

export default Search;
