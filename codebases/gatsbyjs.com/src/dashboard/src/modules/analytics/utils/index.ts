import * as uuid from "uuid"
import { LocalStorageItems } from "@modules/localStorage/constants"

function setSessionId(id: string) {
  return window.localStorage.setItem(LocalStorageItems.GatsbySessionId, id)
}

export function findOrCreateSessionId() {
  if (typeof window === `undefined`) {
    return null
  }

  const sessionId = window.localStorage.getItem(
    LocalStorageItems.GatsbySessionId
  )

  if (!sessionId) {
    const id = uuid.v4()
    setSessionId(id)
    return id
  }

  return sessionId
}

export function getUserId() {
  return typeof window !== `undefined`
    ? window.localStorage.getItem(LocalStorageItems.GatsbyUserId)
    : undefined
}
