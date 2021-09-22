import store from '../store/store';
import type OwaWorkload from '../store/schema/OwaWorkload';

export default function getOwaWorkload(): OwaWorkload {
    return store.currentWorkload;
}
