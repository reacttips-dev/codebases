import getConfig from 'next/config'

export const getRuntimeConfigVariable = (
  variableName: string,
): string | undefined => {
  const { publicRuntimeConfig } = getConfig()
  return publicRuntimeConfig[variableName] || undefined
}
