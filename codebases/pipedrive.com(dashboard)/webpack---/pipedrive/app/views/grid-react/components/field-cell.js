const React = require('react');
const _ = require('lodash');
const { connect } = require('externals/react-redux/5/react-redux');
const PropTypes = require('prop-types');
const fieldEditability = require('../utils/field-editability');
const fieldEditHandler = require('../utils/field-edit-handler');
const CellUtils = require('../utils/cell-utils');
const compareUtils = require('../utils/compare-utils');
const modelUtils = require('../utils/model-utils');
const FieldWrapperFactory = require('../utils/fields-factory');
const { editField, hoverRow } = require('../store/actions/index');
const {
	isContextualViewFullEnabled,
	getEnabledSubTypes,
	isLeadsInActivityListFeatureEnabled
} = require('utils/contextual-view');
const displayName = 'FieldCell';
const PDMetrics = require('utils/pd-metrics');
const { Tooltip } = require('@pipedrive/convention-ui-react');
const { ErrorBoundary } = require('@pipedrive/react-utils');
const Logger = require('@pipedrive/logger-fe').default;

class FieldCell extends React.Component {
	constructor(props) {
		super();

		this.state = this.stateFromProps(props);
	}

	componentWillUnmount() {
		this.unloadFieldEdit();
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (
			this.props.isEditing &&
			!compareUtils.shallowSameModels(this.props.model, nextProps.model)
		) {
			this.unloadFieldEdit();
		}

		return (
			compareUtils.hasDifference(this.props, nextProps, 'column', 'isEditing') ||
			compareUtils.hasDifference(
				this.state,
				nextState,
				'modelAttribute',
				'forceEditHighlight',
				'isEditable',
				'hasCustomEdit',
				'hovered'
			)
		);
	}

	UNSAFE_componentWillReceiveProps = (nextProps) => {
		const newState = this.stateFromProps(nextProps);

		this.setState(newState);
	};

	stateFromProps = ({ model, column, columnKey, modelType, relatedModels }) => {
		const state = {
			forceEditHighlight: false
		};

		if (model) {
			state.modelAttribute = modelUtils.modelChangeableAttr({
				model,
				column,
				columnKey,
				modelType,
				relatedModels
			});
			state.displayModel = modelUtils.modelToDisplay({
				model,
				columnKey,
				relatedModels,
				columnItemType: column.item_type,
				modelType
			});
			state.displayModelType = modelUtils.displayModelType({
				model,
				columnKey,
				modelType
			});
			state.isEditable = fieldEditability.isEditableField({
				columnKey,
				column,
				model: state.displayModel
			});
			state.hasCustomEdit = fieldEditability.hasCustomEdit({
				columnKey,
				modelType: state.displayModelType
			});
		} else {
			state.modelAttribute = null;
			state.displayModel = null;
			state.displayModelType = null;
			state.isEditable = false;
			state.hasCustomEdit = false;
		}

		return state;
	};

	setIsEditing = (isEditing) => {
		const { editField: setEditField } = this.props;

		if (!isEditing) {
			this.onMouseLeave();

			return setEditField(null);
		}

		setEditField({
			rowKey: this.props.rowKey,
			columnKey: this.props.columnKey
		});
	};

	isEditingCurrentField = () => {
		const { isEditing } = this.props;

		return (
			isEditing &&
			isEditing.rowKey === this.props.rowKey &&
			isEditing.columnKey === this.props.columnKey
		);
	};

	unloadFieldEdit = () => {
		app.global.fire('ui.popover.event.close');

		_.result(this.fieldEditHandler, 'unload');
		this.fieldEditHandler = null;
	};

	fieldClassNames = () => {
		const { isEditable } = this.state;
		const editableClass = isEditable ? 'editable' : '';

		return `item read clearfix ${editableClass}`;
	};

	cellClassNames = () => {
		const { column, isEditing } = this.props;
		const { hovered } = this.state;
		const classNames = ['gridRow__cell', `gridRow__cell--${column.field_type}`];

		if (this.isEditingCurrentField()) {
			classNames.push('gridRow__cell--editing');
		} else if (hovered && !isEditing) {
			classNames.push(CellUtils.getExpandedCellClass(this.fieldCell));
		}

		return `${classNames.join(' ')}`;
	};

	fieldStyles = () => {
		const { column } = this.props;
		const fieldStyles = {};

		if (column.width) {
			fieldStyles.width = `${column.width}px`;
		}

		return fieldStyles;
	};

	toggleForceEditHighlight = (isOn) => {
		this.setState({ forceEditHighlight: isOn });
	};

	handleEditField = (event) => {
		const { column, columnKey, scrollContainerRef } = this.props;
		const { displayModel, displayModelType } = this.state;

		if (this.fieldEditHandler) {
			return this.unloadFieldEdit();
		}

		this.toggleForceEditHighlight(true);
		this.setIsEditing(true);
		this.fieldEditHandler = fieldEditHandler.handleFieldEdit(
			{
				model: displayModel,
				modelType: displayModelType,
				column,
				columnKey,
				popoverContainerRef: this.popoverContainerRef,
				scrollContainerRef
			},
			event,
			() => {
				this.toggleForceEditHighlight(false);
				this.setIsEditing(false);
				this.unloadFieldEdit();
			}
		);
	};

	onMouseEnter = () => {
		const timeout = this.props.hoveredRowIndex === this.props.rowKey ? 10 : 160;

		clearTimeout(this.onMouseEnterTimeout);

		if (this.props.hoveredRowIndex !== this.props.rowKey) {
			this.props.hoverRow(this.props.rowKey, 'scrollable');
		}

		this.onMouseEnterTimeout = window.setTimeout(() => {
			this.setState({ hovered: true });
		}, timeout);
	};

	onMouseLeave = () => {
		clearTimeout(this.onMouseEnterTimeout);

		if (this.state.hovered) {
			this.setState({ hovered: false });
		}
	};

	isEditDisabled = () => {
		const { column, model, modelType } = this.props;
		const columnHasValue = model?.attributes[column.key];

		if (modelType !== 'activity' || !isLeadsInActivityListFeatureEnabled() || columnHasValue) {
			return false;
		}

		const relatedKeys = ['deal_id', 'lead_id'];
		const columnIsInRelatedKeys = relatedKeys.includes(column.key);
		const activityIsLinked = relatedKeys.some((k) => model?.attributes[k]);

		if (columnIsInRelatedKeys && activityIsLinked) {
			return true;
		}

		return false;
	};

	editFieldIcon = () => {
		const { forceEditHighlight, isEditable, hasCustomEdit } = this.state;
		const isEditing = this.isEditingCurrentField();
		const spanVisibility = forceEditHighlight || isEditing ? 'gridCell__editIcon--visible' : '';
		const editIconClassNames = `gridCell__editIcon cui4-button cui4-button--s ${spanVisibility}`;
		const iconClassName = isEditing ? 'sm-cross' : 'sm-pencil';
		const isEditDisabled = this.isEditDisabled();

		if (!isEditable || hasCustomEdit) {
			return '';
		}

		return (
			<Tooltip
				content={
					isEditDisabled
						? _.gettext('Activity can be linked to only one deal or lead')
						: _.gettext('Edit')
				}
				placement={isEditDisabled ? 'bottom-end' : 'bottom'}
			>
				<div className="gridCell__editIconWrapper">
					<button
						className={editIconClassNames}
						data-test="edit-field-icon"
						onClick={this.handleEditField}
						disabled={isEditDisabled}
						// eslint-disable-next-line
						dangerouslySetInnerHTML={{ __html: _.icon(iconClassName, 's', null) }}
					/>
				</div>
			</Tooltip>
		);
	};

	getFieldTypeUrl = (fieldType) => {
		return fieldType === 'lead' ? 'leads' : fieldType;
	};

	openInNewTabIcon = () => {
		const { column } = this.props;
		const { forceEditHighlight, displayModel, isEditable } = this.state;
		const isEditing = this.isEditingCurrentField();
		const isAvailable =
			!isEditing && !forceEditHighlight ? 'gridCell__editIcon--available' : '';
		const isWithoutEditIcon = isEditable ? '' : 'gridCell__newTabIcon--standalone';
		const openInNewTabClassNames = `gridCell__newTabIcon cui4-button cui4-button--s ${isAvailable} ${isWithoutEditIcon}`;
		const iconClassName = 'sm-redirect';
		const id = displayModel?.attributes?.[column?.key];
		// eslint-disable-next-line camelcase
		const fieldType = column?.field_type === 'participants' ? 'person' : column?.field_type;
		const fieldTypeUrl = this.getFieldTypeUrl(fieldType);

		if (
			!isContextualViewFullEnabled(displayModel?.collection?.type) ||
			!getEnabledSubTypes().includes(fieldType) ||
			!id
		) {
			return '';
		}

		return (
			<Tooltip content={_.gettext('Open in new tab')}>
				<button
					className={openInNewTabClassNames}
					data-test="new-tab-icon"
					onClick={() => {
						PDMetrics.trackUsage(null, 'contextual_view_open_in_new_tab', 'clicked', {
							// eslint-disable-next-line camelcase
							model: column?.field_type,
							entry_point: 'activity_list_view'
						});
						const win = window.open(
							`${window.location.origin}/${fieldTypeUrl}/${id}`,
							'_blank'
						);

						if (win !== null) {
							win.focus();
						}
					}}
					// eslint-disable-next-line
					dangerouslySetInnerHTML={{ __html: _.icon(iconClassName, 's', null) }}
				/>
			</Tooltip>
		);
	};

	render() {
		const { columnKey, column, relatedModels } = this.props;
		const { displayModel } = this.state;
		const fieldStyles = this.fieldStyles();
		const cellClassNames = this.cellClassNames();
		const fieldClassNames = this.fieldClassNames();
		const { ValueWrapper, props } = FieldWrapperFactory.detectValueRenderer(
			displayModel,
			column
		);
		const editFieldIcon = this.editFieldIcon();
		const openInNewTabIcon = this.openInNewTabIcon();

		return (
			<td
				data-field={columnKey}
				data-test={columnKey}
				className={cellClassNames}
				ref={(element) => (this.fieldCell = element)}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
			>
				<div className={fieldClassNames} style={fieldStyles}>
					{editFieldIcon}
					{openInNewTabIcon}
					<ValueWrapper
						model={displayModel}
						field={column}
						relatedModels={relatedModels}
						{...props}
					/>
					<div
						className="gridCell__popoverContainer"
						ref={(element) => (this.popoverContainerRef = element)}
					/>
				</div>
			</td>
		);
	}
}

const ErrorFallback = ({ column }) => {
	return (
		// eslint-disable-next-line camelcase
		<td className={`gridRow__cell gridRow__cell--${column?.field_type}`}>
			<div className="item read clearfix" style={{ width: column?.width }}>
				<div className="gridCell__item">{_.gettext('Something went wrong.')}</div>
			</div>
		</td>
	);
};

const Wrapper = (props) => {
	const loggingData = {
		message: 'Error occurred while rendering table cell',
		facility: `webapp.${app.ENV}`,
		level: 'warning'
	};

	const logger = new Logger(`webapp.${app.ENV}`, 'field-cell');

	return (
		<ErrorBoundary
			error={<ErrorFallback {...props} />}
			logger={logger}
			loggingData={loggingData}
		>
			<FieldCell {...props} />
		</ErrorBoundary>
	);
};

const mapStateToProps = (state, ownProps) => {
	const { relatedModels } = state;
	const { model } = ownProps;
	const modelId = model ? model.id || model.get('id') : null;

	return {
		hoveredRowIndex: state.hoveredRowIndex,
		relatedModels: (modelId && relatedModels[modelId]) || {},
		isEditing: state.isEditing
	};
};

const mapDispatchToProps = {
	editField,
	hoverRow
};

FieldCell.propTypes = {
	rowKey: PropTypes.number.isRequired,
	column: PropTypes.object.isRequired,
	columnKey: PropTypes.string.isRequired,
	model: PropTypes.object,
	modelType: PropTypes.string,

	// properties available directly from store
	relatedModels: PropTypes.object,
	editField: PropTypes.func.isRequired,
	hoverRow: PropTypes.func.isRequired,
	isEditing: PropTypes.object
};

FieldCell.displayName = displayName;

module.exports = connect(mapStateToProps, mapDispatchToProps)(Wrapper);
