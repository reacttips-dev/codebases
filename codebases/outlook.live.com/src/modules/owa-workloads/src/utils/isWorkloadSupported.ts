import getOwaWorkload from '../selectors/getOwaWorkload';
import type OwaWorkload from '../store/schema/OwaWorkload';

export default function isWorkloadSupported(workload: OwaWorkload): boolean {
    return !!(getOwaWorkload() & workload);
}
