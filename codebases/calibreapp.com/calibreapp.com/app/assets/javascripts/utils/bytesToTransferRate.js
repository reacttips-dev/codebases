const bytesToTransferRate = num => {
  const byte = 8

  if (num < 100000) {
    return `${((num * byte) / 1000).toFixed(2)} Kbps`
  } else {
    return `${((num * byte) / 1000000).toFixed(2)} Mbps`
  }
}

export default bytesToTransferRate
