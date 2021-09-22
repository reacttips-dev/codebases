export const hasSidebarEnabled = () => {
  if (!window.inGlobalContext || !window.inGlobalContext.appShell) {
    return false
  }
  return window.inGlobalContext.appShell.getFeatureContext('home').hasSidebarEnabled()
}
