import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DraggableItem from '../draggable-item';
import GridItemContent from './grid-item-content';
import context from '../../../../utils/context';

class GridItem extends Component {
	shouldComponentUpdate(nextProps) {
		const keysToComapre = ['checkboxState'];

		if (
			!nextProps.item.equals(this.props.item) ||
			keysToComapre.find((key) => this.props[key] !== nextProps[key])
		) {
			return true;
		}

		return false;
	}

	render() {
		let gridItemContent = <GridItemContent {...this.props} />;

		const { gridEl, item, calendarApi } = this.props;
		const popover = calendarApi.renderItem(item, { children: gridItemContent });

		if (popover) {
			gridItemContent = popover;
		}

		if (calendarApi.isDraggable(item)) {
			gridItemContent = (
				<DraggableItem item={item} gridEl={gridEl}>
					{gridItemContent}
				</DraggableItem>
			);
		}

		return gridItemContent;
	}
}

GridItem.propTypes = {
	calendarApi: PropTypes.object.isRequired,
	item: ImmutablePropTypes.map.isRequired,
	date: PropTypes.string.isRequired,
	forwardRef: PropTypes.func,
	gridEl: PropTypes.object,
};

export default context(GridItem);
