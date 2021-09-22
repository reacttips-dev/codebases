import Form from '../form';
import Footer from '../footer/footer';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import styled from 'styled-components';

import { updateModalWidth } from '../../store/actions/viewport';
import AgendaView from '../agenda-view';
import modalContext from '../../../../utils/context';

const calendarMaxHeight = '1225px';
const footerAndHeaderHeight = '96px';

const Container = styled.div`
	display: flex;
	width: ${(props) => (props.isModal ? '850px' : '100%')};
	height: ${(props) => (props.isModal ? 'auto' : '100%')};
	position: relative;
	overflow-x: hidden;
`;

const MainAreaContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: ${(props) => (props.narrowView ? 'calc(100% - 24px)' : '65%')};
`;

const ScrollArea = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	max-height: ${(props) =>
		props.isModal ? `calc(100vh - ${footerAndHeaderHeight})` : `${calendarMaxHeight}`};
	overflow-y: auto;
`;

const FormContainer = styled.div`
	padding: 16px;
`;

class ActivityForm extends React.Component {
	constructor(props) {
		super(props);

		this.modalContainer = React.createRef();
		this.updateViewport = this.updateViewport.bind(this);
	}

	componentDidMount() {
		this.updateViewport();

		window.addEventListener('resize', this.updateViewport);

		const activityModal = document.querySelector('[data-coachmark="activity-modal"]');

		if (activityModal && this.props.onMounted) {
			this.props.onMounted(activityModal);
		}
	}

	componentDidUpdate() {
		const { modalWidth, formWidth } = this.props;

		if (!modalWidth && formWidth && this.modalContainer.current.offsetWidth) {
			this.updateViewport();
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateViewport);
	}

	updateViewport() {
		this.props.updateModalWidth(this.modalContainer.current.offsetWidth);
	}

	render() {
		const {
			isFlowView,
			isContextualView,
			autoFocus,
			closeModal,
			activityId,
			modalWidth,
			onSave,
		} = this.props;
		const showAdditionalActions = !isFlowView && !!activityId;
		const narrowView = modalWidth && modalWidth < 795;
		const isModal = !isFlowView && !isContextualView;

		return (
			<Container isModal={isModal} ref={this.modalContainer}>
				<div id="iamCoachmark--gcalSyncPromo1-placeholder" />
				<MainAreaContainer narrowView={!!narrowView}>
					<ScrollArea isModal={isModal}>
						<FormContainer data-test="add-activity-form">
							<Form autoFocus={autoFocus} />
						</FormContainer>
					</ScrollArea>
					<Footer
						isContextualView={isContextualView}
						showAdditionalActions={showAdditionalActions}
						onClose={() => closeModal()}
						onSave={onSave}
					/>
				</MainAreaContainer>
				<AgendaView narrowView={!!narrowView} />
			</Container>
		);
	}
}

ActivityForm.propTypes = {
	isFlowView: PropTypes.bool,
	isContextualView: PropTypes.bool,
	autoFocus: PropTypes.bool,
	closeModal: PropTypes.func,
	onMounted: PropTypes.func,
	onSave: PropTypes.func,
	activityId: PropTypes.number,

	modalWidth: PropTypes.number,
	formWidth: PropTypes.number,
	updateModalWidth: PropTypes.func,
};

const mapStateToProps = (store) => ({
	activityId: store.getIn(['form', 'activityId']),
	modalWidth: store.getIn(['viewport', 'modalWidth']),
	formWidth: store.getIn(['viewport', 'formWidth']),
});

const mapDispatchToProps = (dispatch) => ({
	updateModalWidth: (width) => dispatch(updateModalWidth(width)),
});

export default connect(mapStateToProps, mapDispatchToProps)(modalContext(ActivityForm));
