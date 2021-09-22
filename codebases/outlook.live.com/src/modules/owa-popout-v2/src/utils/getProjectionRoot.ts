import type { ProjectionItem } from '../store/schema/PopoutParentStore';
import { PROJECTION_ROOT_ID } from './constants';

export default function getProjectionRoot(projection: ProjectionItem) {
    return projection?.window.document.getElementById(PROJECTION_ROOT_ID);
}
