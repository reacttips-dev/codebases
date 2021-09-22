import React, { useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { Icon, Spinner, Tooltip, Button } from '@pipedrive/convention-ui-react';
import { getSearchResults, setSearchTerm, resetTermAndResults, termSelector } from 'store/modules/itemSearch';
import { setModalVisible, modalVisibleSelector } from 'store/modules/sharedState';
import { useArrowNavigation } from 'hooks/keyboard';
import { clearSelection } from 'utils/helpers';
import { SEARCH_QUERY_ACTIONS } from 'utils/constants';
import translator from 'utils/translator';

import styles from './style.scss';

function SearchInput({ useSearchHotKey, tooltipProps }) {
	const inputRef = useRef(null);
	const dispatch = useDispatch();

	const queryInProgress = useSelector((state) => state.itemSearch.queryInProgress);
	const searchTerm = useSelector(termSelector);
	const modalVisible = useSelector(modalVisibleSelector);

	useSearchHotKey(inputRef);
	const onKeyDown = useArrowNavigation(inputRef);

	function onInputFocus() {
		inputRef.current.select();
		onInputClick();
	}

	function onInputClick() {
		if (!modalVisible) {
			dispatch(setModalVisible(true));
		}
	}

	const debouncedQuery = useCallback(
		debounce(() => {
			dispatch(getSearchResults(SEARCH_QUERY_ACTIONS.TERM_ENTERED));
		}, 350),
		[dispatch],
	);

	function onChange(e) {
		const value = e.target.value;

		if (value) {
			dispatch(setSearchTerm(value));
			debouncedQuery();
		} else {
			dispatch(resetTermAndResults());
		}
	}

	function onCrossClick() {
		inputRef.current.focus();
		dispatch(resetTermAndResults());
	}

	return (
		<Tooltip {...tooltipProps} {...(modalVisible ? { visible: false } : {})}>
			<div className="cui4-input cui4-input--icon-left">
				<div id="froot-global-search" className={classNames('cui4-input__box', queryInProgress && 'searching')}>
					<input
						className={styles.nofocus}
						value={searchTerm}
						ref={inputRef}
						onFocus={onInputFocus}
						onClick={onInputClick}
						onChange={onChange}
						onBlur={clearSelection}
						onKeyDown={onKeyDown}
						placeholder={translator.gettext('Search Pipedrive')}
					/>
					<Icon id="search-icon" icon="ac-search" color="black-64" className="cui4-input__icon" />
					<Spinner id="search-spinner" size="s" light />
				</div>
				<Button
					color="ghost-alternative"
					size="s"
					tabIndex="-1"
					className={classNames(styles.clearButton, !searchTerm && styles.visibilityHidden)}
					onClick={onCrossClick}
				>
					<Icon icon="cross" size="s" />
				</Button>
			</div>
		</Tooltip>
	);
}

SearchInput.propTypes = {
	useSearchHotKey: PropTypes.func.isRequired,
	tooltipProps: PropTypes.shape({
		content: PropTypes.object.isRequired,
		style: PropTypes.object.isRequired,
	}).isRequired,
};

export default SearchInput;
