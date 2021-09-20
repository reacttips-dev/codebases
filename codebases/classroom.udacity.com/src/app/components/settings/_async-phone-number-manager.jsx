import loadable from 'react-loadable';

const AsyncPhoneNumberManager = loadable({
  loader: () =>
    import(
      './_phone-number-manager' /* webpackChunkName: "phone-number-manager" */
    ),
  loading: () => null,
});
export default AsyncPhoneNumberManager;
