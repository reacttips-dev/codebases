import React from 'react';
import SortableElement from './shared/Sortable/SortableElement';

type SortableElementTileProps = {
	elements: Element[];
	marginBetweenElements?: number;

	includeReactDndContext?: boolean;
	onMove?: (dragIndex: number, hoverIndex: number) => void;
	onDrop?: () => void;
};

type SharedComponentProps = {
	dragDropContext?: any;
};

type Element = {
	id: number;
	highlighted?: boolean;
	Component: React.ComponentType;
};

export default async function (componentLoader) {
	const [dragDropContext] = await Promise.all([componentLoader.load('froot:dragDropContext')]);

	return (props: SortableElementTileProps) => <SortableElementTiles {...props} dragDropContext={dragDropContext} />;
}

export function SortableElementTiles(props: SortableElementTileProps & SharedComponentProps) {
	if (props.includeReactDndContext) {
		const DragDropContext = props.dragDropContext;
		// eslint-disable-next-line new-cap
		const DraggableApp = DragDropContext(App);

		return <DraggableApp {...props} />;
	}

	return <App {...props} />;
}

const App = (props: SortableElementTileProps) => {
	return (
		<div>
			{props.elements.map((element: Element, index) => (
				<SortableElement
					key={element.id}
					id={element.id}
					highlighted={element.highlighted}
					Component={element.Component}
					index={index}
					marginBetweenElements={props.marginBetweenElements || 8}
					onMove={props.onMove}
					onDrop={props.onDrop}
				/>
			))}
		</div>
	);
};
