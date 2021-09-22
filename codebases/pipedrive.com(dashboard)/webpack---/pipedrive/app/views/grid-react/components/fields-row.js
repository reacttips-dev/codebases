const React = require('react');
const { connect } = require('externals/react-redux/5/react-redux');
const PropTypes = require('prop-types');
const FieldsRowUtils = require('../utils/fields-row-utils');
const FieldCell = require('./field-cell');
const displayName = 'FieldsRow';

class FieldsRow extends React.Component {
	state = {
		hover: false
	};

	constructor() {
		super();
		this.itemRef = React.createRef();
		this.scrollToItem = this.scrollToItem.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.highlighted && this.props.highlighted) {
			this.scrollToItem();
		}
	}

	scrollToItem() {
		if (this.itemRef?.current) {
			const isInViewport = FieldsRowUtils.isRowInVerticalViewPort(
				this.itemRef?.current,
				this.props.scrollContainerRef
			);

			if (isInViewport) {
				return;
			}

			this.itemRef.current.scrollIntoView({ block: 'nearest' });
		}
	}

	UNSAFE_componentWillReceiveProps = (nextProps) => {
		const { hoveredRowIndex } = nextProps;

		this.handleHover(hoveredRowIndex);
	};

	rowClassNames = () => {
		const { model, checked, highlighted, matrixItem, rowClassName, isEditing } = this.props;
		const { hover } = this.state;
		const classNames = ['gridRow'];

		if (model) {
			classNames.push(rowClassName);

			if (highlighted) {
				classNames.push('gridRow--highlighted');
			} else if (checked) {
				classNames.push('gridRow--selected');
			} else {
				classNames.push('gridRow--white');
			}
		}

		if (hover) {
			classNames.push('gridRow--hover');
		}

		if (matrixItem.index === 0) {
			classNames.push('gridRow--first');
		}

		if (isEditing && isEditing.rowKey === matrixItem.key) {
			classNames.push('gridRow--editing');
		}

		return `${classNames.join(' ')}`;
	};

	handleHover = (hoveredRowIndex) => {
		const { matrixItem } = this.props;
		const isHovered = matrixItem.key === hoveredRowIndex;

		this.setState({ hover: isHovered });
	};

	render() {
		const { model, modelType, matrixItem, columns, scrollContainerRef } = this.props;
		const rowClassNames = this.rowClassNames();

		return (
			<tr
				ref={this.itemRef}
				className={rowClassNames}
				style={matrixItem.styles}
				data-test="grid-row"
			>
				{columns.map((columnInfo) => {
					return (
						<FieldCell
							key={`cell-${matrixItem.key}-${columnInfo.key}`}
							scrollContainerRef={scrollContainerRef}
							modelType={modelType}
							rowKey={matrixItem.key}
							column={columnInfo.column}
							columnKey={columnInfo.key}
							model={model}
						/>
					);
				})}
			</tr>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const { model } = ownProps;

	return {
		hoveredRowIndex: state.hoveredRowIndex,
		columns: state.columns,
		isEditing: state.isEditing,
		rowClassName: FieldsRowUtils.getRowClass(model)
	};
};

FieldsRow.propTypes = {
	scrollContainerRef: PropTypes.instanceOf(Element),
	model: PropTypes.object,
	checked: PropTypes.bool,
	highlighted: PropTypes.bool,
	modelType: PropTypes.string,
	matrixItem: PropTypes.object.isRequired,
	rowClassName: PropTypes.string,

	// properties available directly from store
	columns: PropTypes.array,
	hoveredRowIndex: PropTypes.number,
	isEditing: PropTypes.object
};

FieldsRow.displayName = displayName;

module.exports = connect(mapStateToProps)(FieldsRow);
