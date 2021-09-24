const profileMetadata = ({
  hasDeviceEmulation,
  hasBandwidthEmulation,
  device,
  bandwidth,
  jsIsDisabled,
  adBlockerIsEnabled,
  cookies,
  headers,
  blockedThirdParties
}) => {
  let metadataList = []
  if (hasDeviceEmulation) metadataList.push(device.title)
  if (hasBandwidthEmulation) {
    metadataList.push(bandwidth.title)
  } else {
    metadataList.push('No bandwidth throttling')
  }
  if (jsIsDisabled) metadataList.push('JavaScript Requests Blocked')
  if (adBlockerIsEnabled) metadataList.push('Ads Blocked')
  if (cookies && cookies.length == 1) metadataList.push(`1 cookie`)
  if (cookies && cookies.length > 1)
    metadataList.push(`${cookies.length} cookies`)
  if (headers && headers.length == 1) metadataList.push(`1 header`)
  if (headers && headers.length > 1)
    metadataList.push(`${headers.length} headers`)
  if (blockedThirdParties && blockedThirdParties.length == 1)
    metadataList.push(`1 third party blocked`)
  if (blockedThirdParties && blockedThirdParties.length > 1)
    metadataList.push(`${blockedThirdParties.length} third parties blocked`)

  return metadataList
}

export default profileMetadata
