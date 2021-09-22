export const hasSidebarEnabled = () => {
  // @ts-ignore
  const { appShell } = window.inGlobalContext || {}
  const appContext =
    appShell &&
    appShell.currentApp &&
    appShell.currentApp.getFeatureContext &&
    appShell.currentApp.getFeatureContext()
  return appContext && appContext.hasSidebarEnabled()
}
