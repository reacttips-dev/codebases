import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component, createRef } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { Select } from '@pipedrive/convention-ui-react';
import { User } from '@pipedrive/form-fields';

import DateTimePickers from '../date-time-pickers';
import LinkedFields from './linked-fields';
import ActivityTypeSelection from './activity-type-selection';
import FeatureFields from './feature-fields';
import LogRow from './log';

import { handleHiddenUser } from '../../../../utils/activity';
import { withLoadingState } from '../../../../utils/hocs';
import modalContext from '../../../../utils/context';
import { updateField as updateFieldAction } from '../../store/actions/form';
import { updateFormWidth } from '../../store/actions/viewport';
import FormLoading from './form-loading';
import SendInvitationsRow from './send-invitations-row';
import BusySelect from './busy-select';
import { Content, NotesWysiwyg, Row, StyledIcon, SubjectInput } from './form-styles';
import AudioNote from '../audio-note';

import { FileLink } from '../form/form-styles';
import { getLinkText, getIconType } from '../../../../utils/form';

class Form extends Component {
	constructor(props) {
		super(props);

		this.state = {
			CalendarView: null,
			interfaces: [],
		};

		this.setActivityType = this.setActivityType.bind(this);
		this.updateViewport = this.updateViewport.bind(this);
		this.updateFormField = this.updateFormField.bind(this);

		this.autoFocusSubjectInput = props.autoFocus ?? true;
		this.activitySubjectRef = createRef();
	}

	componentDidMount() {
		this.updateViewport();
		window.addEventListener('resize', this.updateViewport);

		if (this.autoFocusSubjectInput) {
			this.focusTimeout = setTimeout(() => {
				this.activitySubjectRef.current.focus();
			}, 100);
		}
	}

	componentDidUpdate() {
		if (!this.props.formWidth && this.formContainer.offsetWidth) {
			this.updateViewport();
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateViewport);
		this.autoFocusSubjectInput && clearTimeout(this.focusTimeout);
	}

	updateViewport() {
		this.props.updateFormWidth(this.formContainer.offsetWidth);
	}

	updateFormField(field, value) {
		this.props.updateField(field, value);
	}

	setActivityType(type) {
		this.updateFormField('type', type.key_string);
	}

	renderFile() {
		const file = this.props.file;
		const fileName = file.get('clean_name');
		const icon = getIconType(fileName);

		return (
			<Row>
				<StyledIcon icon={icon} alignStart />
				{icon === 'file-sound' ? (
					<AudioNote dataTest="activity-media-note" mediaFile={file} />
				) : (
					<FileLink href={file.get('url')}>{getLinkText(fileName)}</FileLink>
				)}
			</Row>
		);
	}

	get gCalSyncEnabled() {
		return this.props.webappApi.userSelf.settings.get('google_calendar_sync');
	}

	get advancedModalEnabled() {
		return this.props.webappApi.userSelf.companyFeatures.get('activities_modal_new_advanced');
	}

	get activeUsers() {
		const { userId, webappApi, translator } = this.props;
		const activeUsers = webappApi.companyUsers.models.filter(
			({ attributes }) => attributes.active_flag && attributes.verified,
		);
		const activityOwnerIsHidden = userId && !activeUsers.find((user) => user.id === userId);

		if (activityOwnerIsHidden) {
			activeUsers.push(handleHiddenUser(userId, translator.gettext('hidden')));
		}

		return activeUsers;
	}

	get notePlaceholder() {
		const { translator } = this.props;

		if (this.gCalSyncEnabled) {
			return '';
		}

		return this.advancedModalEnabled
			? translator.gettext('Notes are visible within Pipedrive, but not to event guests')
			: translator.gettext(
					'Notes are private and visible only within your Pipedrive account',
			  );
	}

	render() {
		const {
			formWidth,
			webappApi,
			type: activityType,
			userId,
			subject,
			note,
			busyFlag,
			isAllDay,
			translator,
			activityTypes,
			activitySubjectPlaceholder,
			file,
		} = this.props;

		const locale = webappApi.userSelf.attributes.locale;
		const companyUsers = webappApi.companyUsers;
		const busyValue = typeof busyFlag === 'boolean' ? busyFlag : !isAllDay;

		return (
			<Content ref={(el) => (this.formContainer = el)} data-coachmark="add-activity-form">
				<Row>
					<SubjectInput
						data-test="activity-subject"
						className="activityTitle"
						value={subject}
						placeholder={activitySubjectPlaceholder}
						onChange={(e) => this.updateFormField('subject', e.target.value)}
						inputRef={this.activitySubjectRef}
					/>
					<ActivityTypeSelection
						activityTypes={activityTypes}
						selectedActivityType={activityType}
						setActivityType={this.setActivityType}
						viewportWidth={formWidth}
					/>
				</Row>

				<Row>
					<StyledIcon icon="ac-task" />
					<DateTimePickers locale={locale} />
				</Row>
				<FeatureFields />
				<Row>
					<StyledIcon icon="busy-free" />
					<BusySelect
						value={busyValue}
						onChange={(value) => this.updateFormField('busyFlag', value)}
						placeholder={translator.pgettext('Free/Busy Event', 'Busy')} // NOSONAR
					>
						<Select.Option value={true}>
							{translator.pgettext('Free/Busy Event', 'Busy')}
						</Select.Option>
						<Select.Option value={false}>
							{translator.pgettext('Free/Busy Event', 'Free')}
						</Select.Option>
					</BusySelect>
				</Row>

				<Row>
					<StyledIcon icon="note" alignStart />
					<NotesWysiwyg
						value={note}
						translator={translator}
						placeholder={translator.gettext('Notes')}
						message={this.notePlaceholder}
						onChange={(e) => this.updateFormField('note', e.target.value)}
						dataTest="activity-note"
						contentEditableClassName="activityNote"
					/>
				</Row>

				{file && this.renderFile()}

				<Row>
					<StyledIcon icon="user" />
					<User
						isOwner
						value={userId}
						users={this.activeUsers}
						allowClear={false}
						portalTo={document.body}
						onComponentChange={(user) => this.updateFormField('userId', user.id)}
					/>
				</Row>

				<Row>
					<LinkedFields />
				</Row>

				{!this.advancedModalEnabled && <SendInvitationsRow data-test="send-invitations" />}

				<LogRow users={companyUsers.models} />
			</Content>
		);
	}
}

StyledIcon.defaultProps = {
	color: 'black-64',
};

Form.propTypes = {
	webappApi: PropTypes.object.isRequired,
	subject: PropTypes.string,
	note: PropTypes.string,
	type: PropTypes.string,
	isAllDay: PropTypes.bool.isRequired,
	busyFlag: PropTypes.bool,
	autoFocus: PropTypes.bool,
	updateField: PropTypes.func.isRequired,
	userId: PropTypes.number,
	updateFormWidth: PropTypes.func.isRequired,
	formWidth: PropTypes.number.isRequired,
	translator: PropTypes.object.isRequired,
	activityTypes: ImmutablePropTypes.list,
	activitySubjectPlaceholder: PropTypes.string,
	file: ImmutablePropTypes.map,
};

const mapStateToProps = (state) => {
	return {
		subject: state.getIn(['form', 'subject']),
		busyFlag: state.getIn(['form', 'busyFlag']),
		isAllDay: !state.getIn(['form', 'dueTime']),
		note: state.getIn(['form', 'note']),
		type: state.getIn(['form', 'type']),
		userId: state.getIn(['form', 'userId']),
		file: state.getIn(['form', 'file']),
		formWidth: state.getIn(['viewport', 'formWidth']),
		activityTypes: state.getIn(['defaults', 'activityTypes']),
		activitySubjectPlaceholder: state.getIn(['defaults', 'activitySubjectPlaceholder']),
	};
};

const mapDispatchToProps = (dispatch) => ({
	updateField: (field, value) => dispatch(updateFieldAction(field, value)),
	updateFormWidth: (formWidth) => dispatch(updateFormWidth(formWidth)),
});

const mapStateToIsLoading = (state) => ({
	isLoading: state.getIn(['requestState', 'activityIsLoading']),
});

export default withLoadingState(
	FormLoading,
	connect(mapStateToProps, mapDispatchToProps)(modalContext(Form)),
	mapStateToIsLoading,
);
