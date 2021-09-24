export const parseXMLErrorMessage = (
  xmlString: string,
): string | null | undefined => {
  try {
    const parser = new DOMParser()
    const xmlDOM = parser.parseFromString(xmlString, 'application/xml')

    if (
      xmlDOM?.documentElement?.nodeName === 'Error' &&
      xmlDOM?.querySelector('Message')?.textContent
    ) {
      return xmlDOM?.querySelector('Message')?.textContent
    }
  } catch (error) {
    return null
  }
}
