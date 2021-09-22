const React = require('react');
const { Provider, connect } = require('externals/react-redux/5/react-redux');
const ReactDOM = require('react-dom');
const $ = require('jquery');
const PropTypes = require('prop-types');
const BulkEditUtils = require('utils/bulk-edit-utils');
const CheckboxRow = require('../components/checkbox-row');
const ClickAndDrag = require('utils/click-and-drag-to-select');
const displayName = 'FixedContentGrid';

class ItemsGrid extends React.Component {
	constructor() {
		super();
		this.fixedContentGrid = React.createRef();

		this.state = {};
	}

	componentDidMount() {
		this.clickAndDrag = new ClickAndDrag(
			$(this.fixedContentGrid.current),
			'.gridRow__cell--checkbox'
		);
	}

	componentWillUnmount() {
		this.clickAndDrag.destroy();
	}

	tableStyles = () => {
		const { rowHeight, total } = this.props;

		return {
			height: `${total * rowHeight}px`
		};
	};

	gridClassNames = () => {
		return `gridContent__tableWrapper gridContent__checkbox`;
	};

	render() {
		const { collection, collectionItems, drawableMatrix } = this.props;

		return (
			<div className={this.gridClassNames()} ref={this.fixedContentGrid}>
				<table className="gridContent__table">
					<tbody style={this.tableStyles()}>
						{drawableMatrix.map((item) => {
							const { index, key } = item;
							const modelId = collectionItems.at(index);
							const model = modelId ? collection.get(modelId) : null;
							const checked = BulkEditUtils.isModelSelected(collection, modelId);
							const highlighted = model?.get('highlighted_in_list') || false;

							return (
								<CheckboxRow
									key={`row-${key}`}
									model={model}
									checked={checked}
									highlighted={highlighted}
									matrixItem={item}
								/>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const {
		rowHeight,
		collection,
		collectionItems,
		drawableMatrix,
		fixedContentWidth,
		total
	} = state;

	return {
		rowHeight,
		collection,
		collectionItems,
		drawableMatrix,
		width: fixedContentWidth,
		total
	};
};

ItemsGrid.propTypes = {
	rowHeight: PropTypes.number.isRequired,
	collection: PropTypes.object.isRequired,
	collectionItems: PropTypes.object.isRequired,
	drawableMatrix: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	total: PropTypes.number.isRequired
};

const ItemsGridComponent = connect(mapStateToProps)(ItemsGrid);

ItemsGridComponent.displayName = displayName;

module.exports = {
	draw($element, store) {
		ReactDOM.render(
			<Provider store={store}>
				<ItemsGridComponent />
			</Provider>,
			$element.get(0)
		);
	},
	unmount($element) {
		return ReactDOM.unmountComponentAtNode($element.get(0));
	},
	Component: ItemsGridComponent
};
