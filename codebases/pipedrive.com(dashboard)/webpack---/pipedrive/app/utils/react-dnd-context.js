import { DragDropContext } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch';

let context;

export function setDragDropContext(dragDropContext) {
	context = dragDropContext;
}

/**
 * This is for sharing one HTML5Backend instead of creating multiple, which is not supported.
 */
export function getDragDropContext() {
	if (!context) {
		// eslint-disable-next-line
		context = DragDropContext(MultiBackend(HTML5toTouch));
	}

	return context;
}

export default getDragDropContext;
