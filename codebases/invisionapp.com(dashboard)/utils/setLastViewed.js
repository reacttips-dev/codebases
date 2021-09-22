import { getItem, setItem } from './cache'

export default function setLastViewed (type, id) {
  let cachedDocuments = getItem('home.documents.documents', false)

  if (cachedDocuments && cachedDocuments.length > 0) {
    const foundDoc = cachedDocuments.findIndex(d => d.id === id && d.type === type)
    if (foundDoc && foundDoc >= 0) {
      cachedDocuments[foundDoc].data.lastViewed = new Date().toISOString()
      setItem('home.documents.documents', cachedDocuments)
    }
  }
}
