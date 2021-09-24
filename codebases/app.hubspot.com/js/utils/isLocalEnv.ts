function isLocalEnv() {
  return window.location.host.indexOf('local') === 0;
}

export default isLocalEnv;