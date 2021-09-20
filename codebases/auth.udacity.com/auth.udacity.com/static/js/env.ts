// Most config env vars are in src/config
// For the few the react app needs that don't make sense to push down to that
// package, we use react-scripts use of .env, which will make the top-level
// config/.env* files exported (if they start with REACT_APP_).
export default {
  ...process.env
};
