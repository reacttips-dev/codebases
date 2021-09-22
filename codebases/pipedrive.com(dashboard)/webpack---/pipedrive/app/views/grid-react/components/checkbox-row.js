const React = require('react');
const { connect } = require('externals/react-redux/5/react-redux');
const PropTypes = require('prop-types');
const actions = require('../store/actions/index');
const { hoverRow } = actions;
const displayName = 'CheckboxRow';

class CheckboxRow extends React.Component {
	constructor(props) {
		super();

		const { checked } = props;

		this.state = {
			checked,
			hover: false
		};
	}

	UNSAFE_componentWillReceiveProps = (nextProps) => {
		const { checked, hoveredRowIndex } = nextProps;

		this.setState({ checked });
		this.handleHover(hoveredRowIndex);
	};

	onCheckboxClicked = (ev) => {
		ev.preventDefault();

		const { model, onCheckboxSelected } = this.props;
		const checked = !this.state.checked;

		if (model) {
			onCheckboxSelected(model, checked);
			this.setState({ checked });
		}
	};

	rowClassNames = () => {
		const { model, highlighted } = this.props;
		const { checked, hover } = this.state;

		const classNames = ['gridRow'];

		if (model && highlighted) {
			classNames.push('gridRow--highlighted');
		} else if (model && checked) {
			classNames.push('gridRow--selected');
		} else if (model && !checked) {
			classNames.push('gridRow--white');
		}

		if (hover) {
			classNames.push('gridRow--hover');
		}

		return `${classNames.join(' ')}`;
	};

	handleHover = (hoveredRowIndex) => {
		const { matrixItem } = this.props;
		const isHovered = matrixItem.key === hoveredRowIndex;

		this.setState({ hover: isHovered });
	};

	onMouseEnter = (rowIndex) => {
		this.handleHover(rowIndex);
		this.props.hoverRow(rowIndex);
	};

	onMouseLeave = () => {
		this.props.hoverRow(null);
	};

	render() {
		const { model, matrixItem } = this.props;
		const { checked } = this.state;
		const modelId = model ? model.get('id') : -1;
		const rowClassNames = this.rowClassNames();
		const cellClassNames = `gridRow__cell gridRow__cell--checkbox`;
		const fieldClassNames = `item`;

		return (
			<tr
				className={rowClassNames}
				style={matrixItem.styles}
				onMouseEnter={() => this.onMouseEnter(matrixItem.key)}
				onMouseLeave={() => this.onMouseLeave()}
			>
				<td
					key={`cell-checkbox-${matrixItem.key}`}
					className={cellClassNames}
					onClick={this.onCheckboxClicked}
				>
					<div className={fieldClassNames}>
						<label className="cui4-checkbox">
							<input
								value={checked}
								checked={checked}
								onChange={() => {}}
								data-id={modelId}
								data-test={modelId}
								type="checkbox"
							/>
							<svg className="cui4-icon cui4-icon--s cui4-checkbox__checkmark">
								<use
									href="#icon-sm-check-done"
									xmlnsXlink="http://www.w3.org/1999/xlink"
									xlinkHref="#icon-sm-check-done"
								/>
							</svg>
						</label>
					</div>
				</td>
			</tr>
		);
	}
}

const mapStateToProps = (state) => {
	const { onCheckboxSelected, hoveredRowIndex, columns } = state;

	return {
		onCheckboxSelected,
		hoveredRowIndex,
		columns
	};
};
const mapDispatchToProps = {
	hoverRow
};

CheckboxRow.propTypes = {
	model: PropTypes.object,
	checked: PropTypes.bool,
	highlighted: PropTypes.bool,
	matrixItem: PropTypes.object.isRequired,

	// properties available directly from store
	onCheckboxSelected: PropTypes.func,
	hoverRow: PropTypes.func.isRequired,
	hoveredRowIndex: PropTypes.number
};

CheckboxRow.displayName = displayName;

module.exports = connect(mapStateToProps, mapDispatchToProps)(CheckboxRow);
