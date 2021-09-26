import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { updateActiveFilter } from '../actions/filter';
import withContext from '../../../utils/context';

const FILTERS_MENU_COMPONENT = 'filter-components:filters-menu';

class Filter extends Component {
	constructor(props) {
		super(props);

		this.state = {
			FilterMenu: null,
		};
		this.onSelectFilter = this.onSelectFilter.bind(this);
	}

	componentDidMount() {
		this.props.webappApi.componentLoader.load(FILTERS_MENU_COMPONENT).then((FilterMenu) => {
			this.setState({ FilterMenu });
		});
	}

	onSelectFilter(type, selectedFilter) {
		const { updateActiveFilter: updateFilter, webappApi, calendarViewUrl } = this.props;

		updateFilter(webappApi, calendarViewUrl, { type, value: selectedFilter.value });
	}

	render() {
		const { FilterMenu } = this.state;
		const { activeFilter, webappApi } = this.props;

		if (!FilterMenu || !activeFilter) {
			return null;
		}

		const filterValue = {
			type: activeFilter.get('type'),
			value: activeFilter.get('value'),
		};

		return (
			<FilterMenu
				type="activity"
				activeFilter={filterValue}
				webappApi={webappApi}
				excludeEveryoneUser={true}
				excludeTeams={true}
				excludeFiltersTab={true}
				onSelectFilter={this.onSelectFilter}
			/>
		);
	}
}

Filter.propTypes = {
	activeFilter: ImmutablePropTypes.map.isRequired,
	updateActiveFilter: PropTypes.func.isRequired,
	webappApi: PropTypes.object.isRequired,
	calendarViewUrl: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
	activeFilter: state.getIn(['filter', 'activeFilter']),
});

const mapDispatchToProps = {
	updateActiveFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(withContext(Filter));
