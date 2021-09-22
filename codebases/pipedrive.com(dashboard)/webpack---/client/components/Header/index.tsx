import React from 'react';
import { connect } from 'react-redux';
import SwitchButton from './SwitchButton';
import AddNewButton from './AddNewButton';
import TotalSummary from './TotalSummary';
import FiltersMenu from './FiltersMenu';
import PipelineSelect from './PipelineSelect';
import { Spinner } from '@pipedrive/convention-ui-react';
import { getDealsLoadingStatus } from '../../selectors/deals';
import { getFilters } from '../../selectors/filters';
import { Container, Left, Right, Loader } from './StyledComponents';
import { isViewerServiceEnabled } from '../../shared/api/webapp';
import { ViewTypes } from '../../utils/constants';
import ShareButton from './ShareButton';

type Props = {
	isLoading: boolean;
	filters: Pipedrive.Filter[];
};

const Header: React.FunctionComponent<Props> = (props) => {
	const { isLoading, filters } = props;
	const isViewerEnabled = isViewerServiceEnabled();

	return (
		<Container>
			<Left>
				<SwitchButton activeView={ViewTypes.PIPELINE} />
				<AddNewButton viewType={ViewTypes.PIPELINE} />
			</Left>

			<Right>
				<TotalSummary />
				{isLoading && (
					<Loader>
						<Spinner className="activityIndicator" />
					</Loader>
				)}
				<PipelineSelect allowEdit={true} viewType={ViewTypes.PIPELINE} />
				<FiltersMenu viewType={ViewTypes.PIPELINE} />
				{isViewerEnabled && <ShareButton filters={filters} />}
			</Right>
		</Container>
	);
};

const mapStateToProps = (state) => ({
	isLoading: getDealsLoadingStatus(state),
	filters: getFilters(state),
});

export default connect(mapStateToProps)(Header);
