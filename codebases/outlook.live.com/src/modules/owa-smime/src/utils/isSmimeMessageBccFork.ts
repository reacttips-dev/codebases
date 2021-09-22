import SmimeBccForkingMode from 'owa-smime-types/lib/schema/SmimeBccForkingMode';
import type SmimeViewState from 'owa-smime-types/lib/schema/SmimeViewState';

export default function isSmimeMessageBccFork(smimeViewState: SmimeViewState): boolean {
    if (smimeViewState.smimeBccForkingMode) {
        const { smimeBccForkingMode } = smimeViewState;
        return (
            smimeBccForkingMode === SmimeBccForkingMode.IncludeSingleBccInEachMessage ||
            smimeBccForkingMode === SmimeBccForkingMode.IncludeAllBccInSingleMessage
        );
    } else {
        return false;
    }
}
