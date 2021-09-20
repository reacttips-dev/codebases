/*

This file contains utilities for configuring and using
the MediaContext context.

*/

import { createContext } from 'react'

type ListenerFunction = () => void

// =================== CLASSES ===================

export interface IMatcher {
  name: string
  query: string
  matches(): boolean
  addListener(fn: ListenerFunction): void
  removeListener(): void
}

// ============ Client-side MediaMatcher
export class MediaMatcher implements IMatcher {
  mediaQueryList: MediaQueryList
  onChange: ListenerFunction | undefined

  constructor(public name: string, public query: string) {
    this.mediaQueryList = window.matchMedia(`(${query})`)
    this.addListener = this.addListener.bind(this)
    this.removeListener = this.removeListener.bind(this)
  }

  matches() {
    return this.mediaQueryList.matches
  }

  addListener(listener: ListenerFunction) {
    this.onChange = listener
    this.mediaQueryList.addListener(this.onChange)
  }

  removeListener() {
    if (this.onChange) this.mediaQueryList.removeListener(this.onChange)
  }
}

// ============ Default serverside MediaMatcher
// this is the default value of the MediaContext context.
export class ServerSideMediaMatcher implements IMatcher {
  constructor(public name: string, public query: string) {
    this.name = name
    this.query = query
  }

  matches() {
    return false
  }

  addListener() {
    return
  }

  removeListener() {
    return
  }
}

/*

To configure serverside behavior, write a new class
that extends ServerSideMediaMatcher,
and customize the `matches()` method.

A very naïve MediaMatcher:

class CustomMediaMatcher extends ServerSideMediaMatcher {
  matches() {
    return this.name === "isMobile";
  }
}

*/

// =================== CONTEXT ===================

/*
Each of these initializer functions provides a quick way
to create a client-side or serverside matcher
and add it to the context.
 */
export function initMediaContext() {
  return {
    mediaMatcher(name: string, query: string) {
      return new MediaMatcher(name, query)
    },
  }
}

export function initServerSideMediaContext() {
  return {
    mediaMatcher(name: string, query: string) {
      return new ServerSideMediaMatcher(name, query)
    },
  }
}

export interface IMediaContextConfig {
  mediaMatcher(name: string, query: string): IMatcher
}

// ============ MediaContext
// The default value for MediaContext
// is the very basic ServerSideContext created above.
export const MediaContext = createContext<IMediaContextConfig>(initServerSideMediaContext())
