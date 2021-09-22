import setLeftNavIrisState from '../mutators/setLeftNavIrisState';
import { makeArcCall } from '../service/makeArcCalls';
import { isFeatureEnabled } from 'owa-feature-flags';

const TEST_CAMPAIGNPLACEMENTID = '88000363';
const PROD_CAMPAIGNPLACEMENTID = '88000364';
export default async function initializeLeftNavUpsellState() {
    const placementId = isFeatureEnabled('auth-EnableIrisTestCampaign')
        ? TEST_CAMPAIGNPLACEMENTID
        : PROD_CAMPAIGNPLACEMENTID;
    let leftNavIrisDetails = await makeArcCall(placementId);
    if (leftNavIrisDetails) {
        setLeftNavIrisState(leftNavIrisDetails);
    }
}
