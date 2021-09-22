const React = require('react');
const { Provider, connect } = require('externals/react-redux/5/react-redux');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');
const BulkEditUtils = require('utils/bulk-edit-utils');
const FieldsRow = require('../components/fields-row');
const { hoverRow } = require('../store/actions/index');
const displayName = 'ScrollableContentGrid';

class ItemsGrid extends React.Component {
	componentDidUpdate() {
		const event = document.createEvent('Event');

		event.initEvent('ui.grid.content.update', false, false);
		event.element = this.scrollableContentElement;
		window.dispatchEvent(event);
	}

	tableStyles = () => {
		const { rowHeight, total } = this.props;

		return {
			height: `${total * rowHeight}px`
		};
	};

	gridClassNames = () => {
		return `gridContent__tableWrapper`;
	};

	gridStyles = () => {
		const { width } = this.props;

		return {
			width
		};
	};

	render() {
		const { collection, collectionItems, drawableMatrix, scrollContainerRef } = this.props;

		return (
			<div
				className={this.gridClassNames()}
				style={this.gridStyles()}
				ref={(element) => (this.scrollableContentElement = element)}
				onMouseLeave={() => this.props.hoverRow(null)}
			>
				<table className="gridContent__table">
					<tbody style={this.tableStyles()}>
						{drawableMatrix.map((item) => {
							const { index, key } = item;
							const modelId = collectionItems.at(index);
							const model = modelId ? collection.get(modelId) : null;
							const checked = BulkEditUtils.isModelSelected(collection, modelId);
							const highlighted = model?.get('highlighted_in_list') || false;

							return (
								<FieldsRow
									key={`row-${key}`}
									scrollContainerRef={scrollContainerRef}
									model={model}
									checked={checked}
									highlighted={highlighted}
									modelType={collection.type}
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
		mainContentWidth,
		total,
		drawableMatrix
	} = state;

	return {
		rowHeight,
		collection,
		collectionItems,
		width: mainContentWidth,
		total,
		drawableMatrix
	};
};

const mapDispatchToProps = {
	hoverRow
};

ItemsGrid.propTypes = {
	scrollContainerRef: PropTypes.instanceOf(Element),
	rowHeight: PropTypes.number.isRequired,
	collection: PropTypes.object.isRequired,
	collectionItems: PropTypes.object.isRequired,
	drawableMatrix: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	total: PropTypes.number.isRequired
};

const ItemsGridComponent = connect(mapStateToProps, mapDispatchToProps)(ItemsGrid);

ItemsGridComponent.displayName = displayName;

module.exports = {
	draw({ gridContentContainer, scrollContainer, store }) {
		ReactDOM.render(
			<Provider store={store}>
				<ItemsGridComponent scrollContainerRef={scrollContainer} />
			</Provider>,
			gridContentContainer
		);
	},
	unmount($element) {
		ReactDOM.unmountComponentAtNode($element.get(0));
	},
	Component: ItemsGridComponent
};
