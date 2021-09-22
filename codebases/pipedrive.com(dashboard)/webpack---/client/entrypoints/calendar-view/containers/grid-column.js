import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import GridItem from '../components/grid-item/grid-item';
import context from '../../../utils/context';
import classes from '../scss/_grid-day.scss';

class GridColumn extends Component {
	shouldComponentUpdate(nextProps) {
		const keysToComapre = ['date'];

		if (
			!nextProps.items.equals(this.props.items) ||
			keysToComapre.find((key) => this.props[key] !== nextProps[key])
		) {
			return true;
		}

		return false;
	}

	renderGridItem(item) {
		const { gridEl, date } = this.props;

		return <GridItem key={`${item.get('id')}`} gridEl={gridEl} item={item} date={date} />;
	}

	render() {
		const { items } = this.props;

		return (
			<div className={classes.day}>
				<div className={classes.activitiesWrapper}>
					{items.map(this.renderGridItem.bind(this))}
				</div>
			</div>
		);
	}
}

GridColumn.propTypes = {
	items: ImmutablePropTypes.list,
	date: PropTypes.string.isRequired,
	gridEl: PropTypes.object,
};

export default context(GridColumn);
