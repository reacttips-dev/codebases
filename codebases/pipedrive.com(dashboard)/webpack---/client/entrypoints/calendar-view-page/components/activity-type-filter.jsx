import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
	toggleExcludedActivityType,
	toggleAllActivityTypes,
} from '../actions/activity-type-filter';
import { trackActivityTypeFiltered } from '../../../utils/track-usage';
import withContext from '../../../utils/context';

const ACTIVITY_TYPE_FILTER_COMPONENT = 'filter-components:activity-filters';

class ActivityTypeFilter extends Component {
	constructor(props) {
		super(props);

		this.state = {
			TypeFilterComponent: null,
		};

		this.toggleAllTypes = this.toggleAllTypes.bind(this);
		this.toggleActivityType = this.toggleActivityType.bind(this);
	}

	componentDidMount() {
		this.props.webappApi.componentLoader
			.load(ACTIVITY_TYPE_FILTER_COMPONENT)
			.then((TypeFilterComponent) => {
				this.setState({ TypeFilterComponent });
			});
	}

	toggleAllTypes(isSelected) {
		const { toggleAllActivityTypes, webappApi } = this.props;

		toggleAllActivityTypes(webappApi, isSelected);
		trackActivityTypeFiltered(webappApi, !isSelected);
	}

	toggleActivityType(keyString) {
		const { toggleExcludedActivityType, webappApi } = this.props;
		const isExcluded = this.props.activityTypes.get(keyString).get('excluded');

		toggleExcludedActivityType(webappApi, keyString);
		trackActivityTypeFiltered(webappApi, isExcluded, keyString);
	}

	render() {
		const { TypeFilterComponent } = this.state;
		const { activityTypes, webappApi } = this.props;
		const languageCode = webappApi.userSelf.getLanguage();

		if (!TypeFilterComponent || !activityTypes || !languageCode) {
			return null;
		}

		return (
			<TypeFilterComponent
				activityTypes={activityTypes
					.sortBy((item) => item.get('order_nr'))
					.map((item) => item.toJS())
					.toArray()}
				languageCode={languageCode}
				toggleAllTypes={this.toggleAllTypes}
				toggleActivityType={this.toggleActivityType}
				toggleObjectType={() => {}}
			/>
		);
	}
}

ActivityTypeFilter.propTypes = {
	toggleExcludedActivityType: PropTypes.func.isRequired,
	toggleAllActivityTypes: PropTypes.func.isRequired,
	activityTypes: ImmutablePropTypes.map.isRequired,
	webappApi: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	activityTypes: state.getIn(['activityTypeFilter', 'items']),
});

export default connect(mapStateToProps, {
	toggleAllActivityTypes,
	toggleExcludedActivityType,
})(withContext(ActivityTypeFilter));
