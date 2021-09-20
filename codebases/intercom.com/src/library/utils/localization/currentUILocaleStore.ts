import { createContext } from 'react'

import { defaultCorpus } from './default-corpus'

type Corpus = object

interface ICurrentUILocale {
  setLocale: (localeName: string) => void
  localize: (id: string, corpus?: Corpus) => string
  getLocalizedCorpus: () => Corpus
  localeName: string
  localizedCorpus: Corpus
}

export class CurrentUILocale implements ICurrentUILocale {
  localizedCorpus = {}

  constructor(public localeName: string) {
    this.setLocale(localeName)
  }

  setLocale(localeName: string) {
    this.localeName = localeName
    this.localizedCorpus = this.getLocalizedCorpus()
  }

  localize(id: string, corpus?: object): string {
    const c = corpus || this.localizedCorpus
    const segments = id.split('.')
    if (segments.length === 1) {
      // @ts-ignore
      return c[id]
    }
    const primary = segments[0]
    // @ts-ignore
    return this.localize(id.split(`${primary}.`)[1], c[primary])
  }

  getLocalizedCorpus() {
    return defaultCorpus.en
  }
}

export function initCurrentUILocaleContext() {
  return {
    ui: new CurrentUILocale('en'),
  }
}

export interface ICurrentUILocaleContext {
  ui: ICurrentUILocale
}

export const CurrentUILocaleContext = createContext<ICurrentUILocaleContext>(
  initCurrentUILocaleContext(),
)
