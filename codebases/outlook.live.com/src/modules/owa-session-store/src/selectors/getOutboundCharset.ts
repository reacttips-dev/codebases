import getUserConfiguration from '../actions/getUserConfiguration';

export default function getOutboundCharset() {
    const policySettings = getUserConfiguration().PolicySettings;
    return policySettings
        ? {
              OutboundCharset: policySettings.OutboundCharset,
              UseGB18030: policySettings.UseGB18030,
              UseISO885915: policySettings.UseISO885915,
          }
        : { OutboundCharset: 'AutoDetect' };
}
