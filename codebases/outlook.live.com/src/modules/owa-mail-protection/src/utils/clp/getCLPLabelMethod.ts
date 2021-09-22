import CLPViewState, {
    LabelApplyMethod,
} from 'owa-mail-protection-types/lib/schema/clp/CLPViewState';
import { STANDARD_LABEL_METHOD, PRIVILEGED_LABEL_METHOD } from './constants';

export default function (clpViewState: CLPViewState): string {
    switch (clpViewState.labelApplyMethod) {
        case LabelApplyMethod.Manual:
            return PRIVILEGED_LABEL_METHOD;
        case LabelApplyMethod.Default:
        case LabelApplyMethod.Automatic:
        default:
            return STANDARD_LABEL_METHOD;
    }
}
