import { auth as authText } from "@modules/locales/default.js"

export enum LoginOption {
  Github = `GITHUB`,
  Gitlab = `GITLAB`,
  Bitbucket = `BITBUCKET`,
  Google = `GOOGLE`,
  Workos = "WORKOS",
}

export const LoginOptionLabels: Record<LoginOption, string> = {
  GITHUB: authText.morphemes.github,
  GITLAB: authText.morphemes.gitlab,
  BITBUCKET: authText.morphemes.bitbucket,
  GOOGLE: authText.morphemes.google,
  WORKOS: authText.morphemes.workos,
}
