import { DragDropContext as dragDropContext } from 'react-dnd';
import multiBackend from 'react-dnd-multi-backend';
import html5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch';

export default dragDropContext(multiBackend(html5toTouch));
