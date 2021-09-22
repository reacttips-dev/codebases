import { mutatorAction } from 'satcheljs';
import type CLPUserLabelStore from '../../store/schema/clp/CLPUserLabelStore';
import { protectionStore } from '../../store/protectionStore';

export default mutatorAction('initializeCLPStore', (labelInfoFromResp: CLPUserLabelStore) => {
    protectionStore.clpLabels = labelInfoFromResp.clpLabels;
    protectionStore.learnMoreUrl = labelInfoFromResp.learnMoreUrl;
    protectionStore.hasMandatoryLabel = labelInfoFromResp.hasMandatoryLabel;
});
