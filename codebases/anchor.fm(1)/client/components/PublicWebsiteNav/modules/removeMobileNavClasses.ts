export function removeMobileNavClasses() {
  document.body.classList.remove('lockScroll');
  const appContent = document.getElementById('app-content');
  if (appContent) appContent.classList.remove('hidden');
}
