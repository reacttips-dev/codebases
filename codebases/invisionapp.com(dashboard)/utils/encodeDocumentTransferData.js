export const encodeDocumentTransferData = ({ id, type }) => {
  /*
      team-management-web expects an encoded data structure that looks like the following

      {
        [documentType]: [list of document ids]
      }

      This gets stringifyied and base64 encoded to make sure it never exceeds the url query
      parameter limit. As of now, this is the only way to share data between home-ui and
      team-management-web
    */
  const documentData = JSON.stringify({ [type]: [`${id}`] })
  const encodedDocumentData = window.btoa(documentData)

  return encodedDocumentData
}
