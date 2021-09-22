import type OofRollUpViewState from '../../store/schema/OofRollUpViewState';
import { OOF_ITEM_CLASS_REGEX } from 'owa-mail-store/lib/utils/constants';

export function createOofRollUpViewState(itemClass: string): OofRollUpViewState {
    return {
        isOofItem: OOF_ITEM_CLASS_REGEX.test(itemClass),
        oofReplyNodeIds: [],
        isOofRollUpExpanded: false,
    };
}
