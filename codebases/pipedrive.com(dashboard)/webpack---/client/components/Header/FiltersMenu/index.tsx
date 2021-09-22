import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import {
	addFilter,
	FilterActions,
	FiltersActionsType,
	removeFilter,
	setSelectedFilter,
	setTemporarySelectedFilter,
	updateFilter,
} from '../../../actions/filters';
import { editFilterModal, openAddNewFilterModal } from '../../../shared/api/webapp/modals';
import { getFilters, getSelectedFilter } from '../../../selectors/filters';
import { getSelectedPipelineId } from '../../../selectors/pipelines';
import { Container } from './StyledComponents';
import useExternalComponent from '../../useExternalComponent';
import { ViewTypes } from '../../../utils/constants';

const FILTERS_MENU_COMPONENT = 'filter-components:filters-menu';

interface DispatchProps {
	filterActions: FiltersActionsType;
}

interface StateProps {
	selectedFilter: Pipedrive.SelectedFilter;
	filters: Pipedrive.Filter[];
	selectedPipelineId: number;
}

interface OwnProps {
	viewType: ViewTypes;
}

type FiltersMenuProps = DispatchProps & StateProps & OwnProps;

const FiltersMenu: React.FunctionComponent<FiltersMenuProps> = (props) => {
	const FiltersMenuComponent = useExternalComponent(FILTERS_MENU_COMPONENT);
	const { filterActions, selectedFilter, filters } = props;

	const onAddNewFilter = useCallback(
		() => openAddNewFilterModal(selectedFilter, filterActions, props.viewType),
		[selectedFilter],
	);

	const onEditFilter = useCallback(
		(filter) => editFilterModal(filter.id || filter.value, selectedFilter, filterActions, props.viewType),
		[selectedFilter],
	);

	const onSelectFilter = useCallback((filterType: Pipedrive.SelectedFilter['type'], filterItem: Pipedrive.Filter) => {
		const filterValue = filterType === 'filter' ? filterItem.id : filterItem.value;

		filterActions.setSelectedFilter(
			{
				type: filterType,
				value: filterValue,
			} as Pipedrive.SelectedFilter,
			props.viewType,
		);
	}, []);

	if (!FiltersMenuComponent) {
		return null;
	}

	return (
		<Container>
			<FiltersMenuComponent
				type="deal"
				activeFilter={selectedFilter}
				filters={filters}
				onAddNewFilter={onAddNewFilter}
				onEditFilter={onEditFilter}
				onSelectFilter={onSelectFilter}
			/>
			<div data-coachmark="iamcoachmark-filters-menu-container" />
		</Container>
	);
};

const mapStateToProps = (state: PipelineState): StateProps => {
	return {
		selectedFilter: getSelectedFilter(state),
		selectedPipelineId: getSelectedPipelineId(state),
		filters: getFilters(state),
	};
};

const mapDispatchToProps = (dispatch: Dispatch<FilterActions>): DispatchProps => ({
	filterActions: bindActionCreators(
		{ setSelectedFilter, setTemporarySelectedFilter, removeFilter, addFilter, updateFilter },
		dispatch,
	),
});

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(FiltersMenu);
